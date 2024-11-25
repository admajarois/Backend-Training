const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the get threads action correctly', async () => {
    const mockThreads = [
      {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        owner: 'user-123',
      },
      {
        id: 'thread-124',
        title: 'Another Thread Title',
        body: 'Another Thread Body',
        owner: 'user-124',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreads = jest.fn().mockImplementation(() => Promise.resolve(
      [
        {
          id: 'thread-123',
          title: 'Thread Title',
          body: 'Thread Body',
          owner: 'user-123',
        },
        {
          id: 'thread-124',
          title: 'Another Thread Title',
          body: 'Another Thread Body',
          owner: 'user-124',
        },
      ]
    ));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const threads = await detailThreadUseCase.execute();

    expect(threads).toStrictEqual(mockThreads);
    expect(mockThreadRepository.getThreads).toHaveBeenCalled();
  });

  it('should orchestrating the get thread by id action correctly', async () => {
    const mockThreadId = 'thread-123';
    const mockThreadDetail = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      owner: 'user-123',
      comments: [
        {
          id: 'comment-123',
          content: 'Comment Content',
          owner: 'user-456',
          threadId: 'thread-123',
          replies: [
            {
              id: 'reply-123',
              content: 'Reply Content',
              owner: 'user-789',
              commentId: 'comment-123',
            },
          ],
        },
      ],
    };

    const mockComments = [
      {
        id: 'comment-123',
        content: 'Comment Content',
        owner: 'user-456',
        threadId: 'thread-123',
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        content: 'Reply Content',
        owner: 'user-789',
        commentId: 'comment-123',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      owner: 'user-123',
    }));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve([
      {
        id: 'comment-123',  
        content: 'Comment Content',
        owner: 'user-456',
        threadId: 'thread-123',
      },
    ]));

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getRepliesByCommentIds = jest.fn().mockImplementation(() => Promise.resolve([
      {
        id: 'reply-123',
        content: 'Reply Content',
        owner: 'user-789',
        commentId: 'comment-123',
      },
    ]));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await detailThreadUseCase.execute(mockThreadId);
    
    expect(thread).toStrictEqual(mockThreadDetail);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(mockThreadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toHaveBeenCalledWith(mockComments.map(comment => comment.id));
  });

  it('should throw error when getting threads with invalid data type', async () => {
    // Arrange
    const mockThreadId = {
      id: 123, // id should be a string
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.reject(new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')));
    // Creating use case instance
    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(detailThreadUseCase.execute(mockThreadId)).rejects.toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when getting threads with incomplete payload', async () => {
    // Arrange
    const mockThreadId = {
      // id is missing
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.reject(new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')));
    // Creating use case instance
    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(detailThreadUseCase.execute(mockThreadId)).rejects.toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});
