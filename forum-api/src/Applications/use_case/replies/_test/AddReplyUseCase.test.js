const AddReplyUseCase = require('../AddReplyUseCase');
const AddedReply = require('../../../../Domains/replies/entites/AddedReply');
const AddReply = require('../../../../Domains/replies/entites/AddReply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'a reply',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.postReply = jest.fn().mockImplementation(() => Promise.resolve(mockAddedReply));

    // Creating use case instance
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(mockAddedReply);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.postReply).toHaveBeenCalledWith(new AddReply(useCasePayload));
  });

  it('should throw error when adding reply to non-existent thread', async () => {
    // Arrange
    const useCasePayload = {
      content: 'a reply',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.reject(new NotFoundError('THREAD_NOT_FOUND')));

    // Creating use case instance
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError('THREAD_NOT_FOUND');
  });

  it('should throw error when adding reply to non-existent comment', async () => {
    // Arrange
    const useCasePayload = {
      content: 'a reply',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockImplementation(() => Promise.reject(new NotFoundError('COMMENT_NOT_FOUND')));

    // Creating use case instance
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError('COMMENT_NOT_FOUND');
  });
});
