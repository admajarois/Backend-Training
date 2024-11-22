const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
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
    });
  });

  describe('findThreadById function', () => {
    it('should return thread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('Thread Title');
      expect(thread.body).toEqual('Thread Body');
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

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const updatedThread = {
        title: 'Updated Title',
        body: 'Updated Body',
      };

      // Action & Assert
      await expect(threadRepositoryPostgres.updateThread('thread-1545', updatedThread)).rejects.toThrow(NotFoundError);
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

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.deleteThread('thread-1545')).rejects.toThrow(NotFoundError);
    });
  });
});
