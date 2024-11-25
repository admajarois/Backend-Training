const DetailCommentUseCase = require('../DetailCommentUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
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
    // Mocking
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(mockCommentDetail));

    // Creating use case instance
    const detailCommentUseCase = new DetailCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const commentDetail = await detailCommentUseCase.execute(useCasePayload);

    // Assert
    expect(commentDetail).toStrictEqual(mockCommentDetail);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
  });

  it('should throw error when getting detail of non-existent comment', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-456',
    };

    const mockCommentDetail = new DetailComment({
      id: 'comment-123',
      content: 'Comment Content',
      username: 'user123',
      date: '2021-08-08T07:19:09.775Z',
    });

    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockCommentRepository.getCommentById = jest.fn().mockImplementation((commentId) => {
      if (commentId === 'comment-456') {
        return Promise.reject(new NotFoundError('Comment tidak ditemukan'));
      }
      return Promise.resolve(mockCommentDetail);
    });

    // Creating use case instance
    const detailCommentUseCase = new DetailCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(detailCommentUseCase.execute(useCasePayload)).rejects.toThrowError('Comment tidak ditemukan');
  });
});
