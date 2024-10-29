const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');


describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'testuser', password: 'password', fullname: 'Test User' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body', owner: 'user-123' });    
  });
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist a new comment and return the comment correctly', async () => {
      // Arrange
      const newComment = new AddComment({
        content: 'New Comment Content',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.getCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual({
        id: 'comment-123',
        content: 'New Comment Content',
        owner: 'user-123',
        thread: 'thread-123',
      });
    }); 
    describe('findCommentByThreadId function', () => {
      it('should return all comments correctly', async () => {
        // Arrange
        await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'Comment Content', thread: 'thread-123', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({ id: 'comment-456', content: 'Comment Content 2', thread: 'thread-123', owner: 'user-123' });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});  

        // Action
        const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');   

        // Assert
        expect(comments).toHaveLength(2);
        expect(comments).toEqual([
          { id: 'comment-123', content: 'Comment Content', thread: 'thread-123', owner: 'user-123' },
          { id: 'comment-456', content: 'Comment Content 2', thread: 'thread-123', owner: 'user-123' },
        ]);
      });
    });

    describe('updateCommentById function', () => {
      it('should update a comment correctly', async () => {
        // Arrange
        await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'Comment Content', threadId: 'thread-123', owner: 'user-123' });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const updatedComment = {
          content: 'Updated Comment Content',
        };

        // Action
        await commentRepositoryPostgres.updateCommentById('comment-123', updatedComment);

        // Assert
        const comments = await CommentsTableTestHelper.getCommentById('comment-123');
        expect(comments).toHaveLength(1);
      });
    });

    describe('deleteCommentById function', () => {
      it('should delete a comment correctly', async () => {
        // Arrange
        await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'Comment Content', thread: 'thread-123', owner: 'user-123' });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action
        await commentRepositoryPostgres.deleteCommentById('comment-123');

        // Assert
        const comments = await CommentsTableTestHelper.getCommentById('comment-123');
        expect(comments).toHaveLength(0);
      });
    });

    describe('verifyCommentOwner function', () => {
      it('should throw InvariantError when comment not found', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrow(InvariantError);
      });
    });

    describe('getCommentById function', () => {
      it('should return comment correctly', async () => {
        // Arrange
        await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'Comment Content', thread: 'thread-123', owner: 'user-123' });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action
        const comment = await commentRepositoryPostgres.getCommentById('comment-123');

        // Assert
        expect(comment).toEqual({
          id: 'comment-123', content: 'Comment Content', thread: 'thread-123', owner: 'user-123'
        });
      });
    });
    describe('getComments function', () => {
      it('should return all comments correctly', async () => {
        // Arrange
        await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'Comment Content', thread: 'thread-123', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({ id: 'comment-456', content: 'Comment Content 2', thread: 'thread-123', owner: 'user-123' });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action
        const comments = await commentRepositoryPostgres.getComments();

        // Assert
        expect(comments).toHaveLength(2);
        expect(comments).toEqual([
          { id: 'comment-123', content: 'Comment Content', thread: 'thread-123', owner: 'user-123' },
          { id: 'comment-456', content: 'Comment Content 2', thread: 'thread-123', owner: 'user-123' },
        ]);
      });
    });
  });
}); 
