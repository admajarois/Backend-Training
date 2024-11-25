const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'testuser', password: 'password', fullname: 'Test User' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body', owner: 'user-123' });
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist a new thread and return the thread correctly', async () => {
      // Arrange
      const newThread = new AddThread({
        title: 'New Thread Title',
        body: 'This is the body of the new thread.',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '456'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toEqual({
        id: 'thread-456',
        title: 'New Thread Title',
        body: 'This is the body of the new thread.',
        owner: 'user-123',
      });

      // Verify persistency
      const threads = await ThreadsTableTestHelper.getThreadById('thread-456');
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual('thread-456');
      expect(threads[0].title).toEqual('New Thread Title');
      expect(threads[0].body).toEqual('This is the body of the new thread.');
      expect(threads[0].owner).toEqual('user-123');
    });
  });

  describe('getThreadById function', () => {
    it('should return thread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');
      const { id, title, body, username } = thread;

      // Assert
      expect(thread).toBeDefined();
      expect(id).toEqual('thread-123');
      expect(title).toEqual('Thread Title');
      expect(body).toEqual('Thread Body');
      expect(username).toEqual('testuser');
    });

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-1545')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateThreadById function', () => {
    it('should update thread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const updatedThread = {
        title: 'Updated Title',
        body: 'Updated Body',
      };

      // Action
      await threadRepositoryPostgres.updateThread('thread-123', updatedThread);
      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(threads[0].title).toEqual(updatedThread.title);
      expect(threads[0].body).toEqual(updatedThread.body);
    });
  });

  describe('deleteThreadById function', () => {
    it('should delete thread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      await threadRepositoryPostgres.deleteThread('thread-123');

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(threads).toHaveLength(0);
    });
  });

  describe('verifyThreadAccess function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAccess('thread-1545', 'user-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when user is not the owner of the thread', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAccess('thread-123', 'user-321'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw error when user is the owner of the thread', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.verifyThreadAccess('thread-123', 'user-123');

      // Action & Assert
      expect(thread).toEqual('thread-123');
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-1545')).rejects.toThrow(NotFoundError);
    });

    it('should not throw error when thread is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123')).resolves.not.toThrow();
    });
  });
});
