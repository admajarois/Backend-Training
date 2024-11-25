const AddThread = require('../../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Thread Body',
      owner: 'user-123',
    };

    const mockReturnedThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      owner: 'user-123'
    };

    const expectedAddedThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      owner: 'user-123'
    };

    const mockThreadRepository = new ThreadRepository();
    // Mocking
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturnedThread));

    // Creating use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(new AddThread(useCasePayload)); 

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new AddThread(useCasePayload));
  });

  it('should throw error when adding thread with incomplete payload', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread Title',
      // body is missing
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    // Creating use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(addThreadUseCase.execute(useCasePayload)).rejects.toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when adding thread with invalid data type', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread Title',
      body: 123, // body should be a string
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    // Creating use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(addThreadUseCase.execute(useCasePayload)).rejects.toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
