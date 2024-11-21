const DetailCommentUseCase = require('../DetailCommentUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('DetailCommentUseCase', () => {
  it('should orchestrating the detail comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockCommentDetail = {
      id: 'comment-123',
      content: 'Comment Content',
      threadId: 'thread-123',
      owner: 'user-123',
      date: '2021-08-08T07:19:09.775Z',
    };

    const mockThreadRepository = {
      verifyThreadAccess: jest.fn().mockResolvedValue(true),
      // ... other methods
    };
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(mockCommentDetail));

    // Creating use case instance
    const detailCommentUseCase = new DetailCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const commentDetail = await detailCommentUseCase.execute(useCasePayload);

    // Assert
    expect(commentDetail).toStrictEqual(mockCommentDetail);
    expect(mockThreadRepository.verifyThreadAccess).toHaveBeenCalledWith(useCasePayload.threadId, useCasePayload.owner);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
  });

  it('should throw error when getting detail of comment from non-existent thread', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockThreadRepository = {
      verifyThreadAccess: jest.fn().mockResolvedValue(true),
      // ... other methods
    };
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadAccess = jest.fn().mockImplementation(() => Promise.reject(new NotFoundError('THREAD_NOT_FOUND')));

    // Creating use case instance
    const detailCommentUseCase = new DetailCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(detailCommentUseCase.execute(useCasePayload)).rejects.toThrowError('THREAD_NOT_FOUND');
  });

  it('should throw error when getting detail of non-existent comment', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockThreadRepository = {
      verifyThreadAccess: jest.fn().mockResolvedValue(true),
      // ... other methods
    };
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.reject(new NotFoundError('COMMENT_NOT_FOUND')));

    // Creating use case instance
    const detailCommentUseCase = new DetailCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(detailCommentUseCase.execute(useCasePayload)).rejects.toThrowError('COMMENT_NOT_FOUND');
  });
});
