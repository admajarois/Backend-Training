const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddComment = require('../../../../Domains/comments/entities/AddComment');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Comment Content',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockAddedComment = new AddComment({
      id: 'comment-123',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = {
      verifyThreadAccess: jest.fn().mockResolvedValue(true),
      // ... other methods
    };
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddedComment));

    // Creating use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(mockAddedComment);
    expect(mockThreadRepository.verifyThreadAccess).toHaveBeenCalledWith(useCasePayload.threadId, useCasePayload.owner);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(new AddComment(useCasePayload));
  });

  it('should throw error when adding comment to non-existent thread', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Comment Content',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockThreadRepository = {
      verifyThreadAccess: jest.fn().mockResolvedValue(true),
      // ... other methods
    };
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadAccess = jest.fn().mockImplementation(() => Promise.reject(new NotFoundError('THREAD_NOT_FOUND')));

    // Creating use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError('THREAD_NOT_FOUND');
  });

  it('should throw error when adding comment with incomplete payload', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Comment Content',
      // threadId is missing
      owner: 'user-123',
    };

    const mockThreadRepository = {
      verifyThreadAccess: jest.fn().mockResolvedValue(true),
      // ... other methods
    };
    const mockCommentRepository = new CommentRepository();

    // Creating use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when adding comment with invalid data type', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Comment Content',
      threadId: 123, // threadId should be a string
      owner: 'user-123',
    };

    const mockThreadRepository = {
      verifyThreadAccess: jest.fn().mockResolvedValue(true),
      // ... other methods
    };
    const mockCommentRepository = new CommentRepository();

    // Creating use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
