const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');


describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ 
      id: 'user-123', 
      username: 'testuser', 
      password: 'password', 
      fullname: 'Test User' 
    });
    await ThreadsTableTestHelper.addThread({ 
      id: 'thread-123', 
      title: 'Thread Title', 
      body: 'Thread Body', 
      owner: 'user-123' 
    });    
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
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toBeInstanceOf(AddedComment);
      expect(addedComment).toEqual(expect.objectContaining({
        content: 'New Comment Content',
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      }));
    }); 
  });

  describe('getCommentsByThreadId function', () => {
    it('should return all comments correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ 
        id: 'comment-123', 
        content: 'Comment Content', 
        threadId: 'thread-123', 
        owner: 'user-123' 
      });
      await CommentsTableTestHelper.addComment({ 
        id: 'comment-456', 
        content: 'Comment Content 2', 
        threadId: 'thread-123', 
        owner: 'user-123' 
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});  

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');   

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'comment-123',
            content: 'Comment Content',
            username: 'testuser',
            date: expect.any(String),
          }),
          expect.objectContaining({
            id: 'comment-456',
            content: 'Comment Content 2',
            username: 'testuser',
            date: expect.any(String),
          }),
        ])
      );
    });
  });

  describe('updateCommentById function', () => {
    it('should update a comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ 
        id: 'comment-123', 
        content: 'Comment Content', 
        thread: 'thread-123', 
        owner: 'user-123' 
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const updatedComment = {
        content: 'Updated Comment Content',
      };

      // Action
      await commentRepositoryPostgres.updateComment('comment-123', updatedComment);

      // Assert
      const comments = await CommentsTableTestHelper.getCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].content).toBe('Updated Comment Content');
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete a comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ 
        id: 'comment-123', 
        content: 'Comment Content', 
        thread: 'thread-123', 
        owner: 'user-123' 
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.getCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].active).toBe(false);
      expect(comments[0].content).toBe('**komentar telah dihapus**');
    });
  });

  describe('getCommentById function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      const testDate = new Date().toISOString();
      await CommentsTableTestHelper.addComment({ 
        id: 'comment-123', 
        content: 'Comment Content', 
        thread: 'thread-123', 
        owner: 'user-123', 
        date: testDate 
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(comment).toEqual({
        id: 'comment-123', 
        content: 'Comment Content', 
        username: 'testuser',
        date: expect.any(String),
      });
    });
  });
});
