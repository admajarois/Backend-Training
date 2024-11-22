const UpdateCommentUseCase = require('../UpdateCommentUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../../Domains/comments/entities/AddComment');


describe('UpdateCommentUseCase', () => {
  it('should orchestrating the update comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      content: 'Updated Comment Content',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentAccess = jest.fn().mockResolvedValue();
    mockCommentRepository.updateComment = jest.fn().mockResolvedValue();

    // Creating use case instance
    const updateCommentUseCase = new UpdateCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await updateCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentAccess).toHaveBeenCalledWith(useCasePayload.id, useCasePayload.owner);
    expect(mockCommentRepository.updateComment).toHaveBeenCalledWith({ content: useCasePayload.content, id: useCasePayload.id });
  });

  it('should throw error when updating comment from non-existent comment', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-456',
      content: 'Updated Comment Content',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockCommentRepository.verifyCommentAccess = jest.fn().mockRejectedValue(new NotFoundError('Comment tidak ditemukan'));
    mockCommentRepository.updateComment = jest.fn();

    // Creating use case instance
    const updateCommentUseCase = new UpdateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(updateCommentUseCase.execute(useCasePayload)).rejects.toThrowError('Comment tidak ditemukan');
  });

  it('should throw error when updating comment by non-owner', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      content: 'Updated Comment Content',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentAccess = jest.fn().mockRejectedValue(new AuthorizationError('FORBIDDEN'));
    mockCommentRepository.updateComment = jest.fn();

    // Creating use case instance
    const updateCommentUseCase = new UpdateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(updateCommentUseCase.execute(useCasePayload)).rejects.toThrowError('FORBIDDEN');
  });
});
