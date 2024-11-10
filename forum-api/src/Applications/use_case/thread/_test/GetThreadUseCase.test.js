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
});
