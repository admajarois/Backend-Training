const UpdateCommentUseCase = require('../UpdateCommentUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError');

describe('UpdateCommentUseCase', () => {
  it('should orchestrating the update comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      content: 'Updated Comment Content',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.updateComment = jest.fn().mockImplementation(() => Promise.resolve());

    // Creating use case instance
    const updateCommentUseCase = new UpdateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await updateCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.updateComment).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.content);
  });

  it('should throw error when updating comment from non-existent thread', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      content: 'Updated Comment Content',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.reject(new NotFoundError('THREAD_NOT_FOUND')));

    // Creating use case instance
    const updateCommentUseCase = new UpdateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(updateCommentUseCase.execute(useCasePayload)).rejects.toThrowError('THREAD_NOT_FOUND');
  });

  it('should throw error when updating comment by non-owner', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'Updated Comment Content',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.reject(new AuthorizationError('FORBIDDEN')));

    // Creating use case instance
    const updateCommentUseCase = new UpdateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(updateCommentUseCase.execute(useCasePayload)).rejects.toThrowError('FORBIDDEN');
  });
});
