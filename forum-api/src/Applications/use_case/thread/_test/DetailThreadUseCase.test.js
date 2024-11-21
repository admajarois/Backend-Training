const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the get threads action correctly', async () => {
    // Arrange
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
    // Mocking
    mockThreadRepository.getThreads = jest.fn().mockImplementation(() => Promise.resolve(mockThreads));

    // Creating use case instance
    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threads = await detailThreadUseCase.execute();

    // Assert
    expect(threads).toStrictEqual(mockThreads);
    expect(mockThreadRepository.getThreads).toHaveBeenCalled();
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
