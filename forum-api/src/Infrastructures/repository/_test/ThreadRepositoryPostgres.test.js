const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
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
      });
      const fakeIdGenerator = () => '456'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById('thread-456');
      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual({
        id: 'thread-456',
        title: 'New Thread Title',
      });
    });
  });

  describe('findThreadById function', () => {
    it('should return thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('Thread Title');
      expect(thread.body).toEqual('Thread Body');
    });

    it('should throw InvariantError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrow(InvariantError);
    });
  });

  describe('updateThreadById function', () => {
    it('should update thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body' });
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

    it('should throw InvariantError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const updatedThread = {
        title: 'Updated Title',
        body: 'Updated Body',
      };

      // Action & Assert
      await expect(threadRepositoryPostgres.updateThread('thread-123', updatedThread)).rejects.toThrow(InvariantError);
    });
  });

  describe('deleteThreadById function', () => {
    it('should delete thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      await threadRepositoryPostgres.deleteThread('thread-123');

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(threads).toHaveLength(0);
    });

    it('should throw InvariantError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.deleteThread('thread-123')).rejects.toThrow(InvariantError);
    });
  });
});
