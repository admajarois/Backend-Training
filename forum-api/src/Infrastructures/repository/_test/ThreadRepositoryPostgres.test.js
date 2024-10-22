const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
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
    it('should throw InvariantError when title or body not contain needed property', async () => {
      
        await ThreadsTableTestHelper.addThread({ title: 'Lorem Ipsum' });
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        await expect(threadRepositoryPostgres.addThread({})).rejects.toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });
  });

  describe('findThreadById function', () => {
    it('should return thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.findThreadById('thread-123');

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
      await expect(threadRepositoryPostgres.findThreadById('thread-123')).rejects.toThrow(InvariantError);
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
      await threadRepositoryPostgres.updateThreadById('thread-123', updatedThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
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
      await expect(threadRepositoryPostgres.updateThreadById('thread-123', updatedThread)).rejects.toThrow(InvariantError);
    });
  });

  describe('deleteThreadById function', () => {
    it('should delete thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      await threadRepositoryPostgres.deleteThreadById('thread-123');

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(0);
    });

    it('should throw InvariantError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.deleteThreadById('thread-123')).rejects.toThrow(InvariantError);
    });
  });
});

