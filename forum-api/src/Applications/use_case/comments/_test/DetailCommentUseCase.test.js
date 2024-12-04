const DetailCommentUseCase = require('../DetailCommentUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DetailComment = require('../../../../Domains/comments/entities/DetailComment');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('DetailCommentUseCase', () => {
  it('should orchestrating the detail comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      username: 'user123',
    };

    const mockCommentDetail = new DetailComment({
      id: 'comment-123',
      content: 'Comment Content',
      username: 'user123',
      date: '2021-08-08T07:19:09.775Z',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
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
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
  });
  it('should throw error when thread not found', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-456',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.reject(new NotFoundError('Thread tidak ditemukan')));
  });

  it('should throw error when getting detail of non-existent comment', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-456',
      threadId: 'thread-123',
    };

    const mockCommentDetail = new DetailComment({
      id: 'comment-123',
      content: 'Comment Content',
      username: 'user123',
      date: '2021-08-08T07:19:09.775Z',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn().mockImplementation((commentId) => {
      if (commentId === 'comment-456') {
        return Promise.reject(new NotFoundError('Comment tidak ditemukan'));
      }
      return Promise.resolve(mockCommentDetail);
    });

    // Creating use case instance
    const detailCommentUseCase = new DetailCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(detailCommentUseCase.execute(useCasePayload)).rejects.toThrowError('Comment tidak ditemukan');
  });
});
