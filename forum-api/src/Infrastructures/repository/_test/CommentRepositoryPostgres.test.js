const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
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
      const { content, id, owner, threadId } = addedComment;
      expect(content).toBe('New Comment Content');
      expect(id).toBe('comment-123');
      expect(owner).toBe('user-123');
      expect(threadId).toBe('thread-123');
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
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentsByThreadId('thread-1545')).rejects.toThrow(NotFoundError);
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
    });
  });

  describe('getCommentById function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ 
        id: 'comment-123', 
        content: 'Comment Content', 
        thread: 'thread-123', 
        owner: 'user-123' 
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(comment).toBeInstanceOf(DetailComment);

      const { date, username, content } = comment;
      expect(date).toEqual(expect.any(String));
      expect(username).toBe('testuser');
      expect(content).toBe('Comment Content');
    });
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentById('comment-1545')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentAccess function', () => {
    it('should return comment id correctly', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-789',
        content: 'Comment Content',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const commentId = await commentRepositoryPostgres.verifyCommentAccess('comment-789', 'user-123');

      // Assert
      expect(commentId).toEqual('comment-789');
    });
    it('should throw AuthorizationError when comment not found', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-789',
        content: 'Comment Content',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAccess('comment-1545', 'user-123')).rejects.toThrow(NotFoundError);
    }); 
    it('should throw AuthorizationError when user not match', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-789',
        content: 'Comment Content',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAccess('comment-789', 'user-456')).rejects.toThrow(AuthorizationError);
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should return comment id correctly', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-789',
        content: 'Comment Content',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const commentId = await commentRepositoryPostgres.verifyCommentAvailability('comment-789');

      // Assert
      expect(commentId).toEqual('comment-789');
    });
    it('should throw NotFoundError when comment not found', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-789',
        content: 'Comment Content',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-1545')).rejects.toThrow(NotFoundError);
    });
  });
  
});
