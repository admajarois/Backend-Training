const pool = require('../../database/postgres/pool');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedReply = require('../../../Domains/replies/entites/AddedReply');
const GetReply = require('../../../Domains/replies/entites/GetReply');
const DeletedReply = require('../../../Domains/replies/entites/DeletedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('RepliesRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'testuser',
      password: 'password',
      fullname: 'Test User',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      owner: 'user-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'Comment Body',
      owner: 'user-123',
      threadId: 'thread-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-456',
      content: 'Another Comment Body',
      owner: 'user-123',
      threadId: 'thread-123',
    });
    await RepliesTableTestHelper.addReply({
      id: 'reply-123',
      content: 'Reply Body',
      owner: 'user-123',
      commentId: 'comment-123',
    });
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('postReply function', () => {
    it('should persist and return added reply correctly', async () => {
      // Arrange
      const addReply = {
        content: 'a reply',
        owner: 'user-123',
        commentId: 'comment-123',
      };
      const fakeIdGenerator = () => '456'; // stub!
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await repliesRepositoryPostgres.postReply(addReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-456',
        content: 'a reply',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should update reply to inactive and return deleted reply correctly', async () => {
      // Arrange
      const deleteReply = {
        id: 'reply-123',
      };

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Action
      const deletedReply = await repliesRepositoryPostgres.deleteReply(deleteReply);

      // Assert
      expect(deletedReply).toStrictEqual(new DeletedReply({
        id: 'reply-123',
        content: '**balasan telah dihapus**',
        owner: 'user-123',
        active: false,
      }));

      // Additional Assert: Check persistence in the database
      const reply = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(reply).toHaveLength(1);
      expect(reply[0].active).toBe(false);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Ensure the reply does not exist in the database
      // You might need to add a step here to delete the reply if it exists

      // Action & Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner('reply-456', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when owner does not match', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when owner matches', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      const reply = await repliesRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123');

      expect(reply).toEqual('reply-123');
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should return empty array when comment ids is empty', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Action
      const replies = await repliesRepositoryPostgres.getRepliesByCommentIds(['comment-54646']);

      // Assert
      expect(replies).toHaveLength(0);
      expect(replies).toEqual([]);
    });
    it('should return replies by comment ids correctly', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        content: 'Another Reply Body',
        owner: 'user-123',
        commentId: 'comment-456',
      });

      // Action
      const replies = await repliesRepositoryPostgres.getRepliesByCommentIds(['comment-123', 'comment-456']);

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: 'reply-123',
          content: 'Reply Body',
          username: 'testuser',
          commentId: 'comment-123',
          date: expect.any(String),
        }),
        expect.objectContaining({
          id: 'reply-456',
          content: 'Another Reply Body',
          username: 'testuser',
          commentId: 'comment-456',
          date: expect.any(String),
        }),
      ]));
    });
  });
});
