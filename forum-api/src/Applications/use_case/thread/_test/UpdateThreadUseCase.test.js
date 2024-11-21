const UpdateThread = require('../../../../Domains/threads/entities/UpdateThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UpdateThreadUseCase = require('../UpdateThreadUseCase');

describe('UpdateThreadUseCase', () => {
  it('should orchestrating the update thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
      title: 'Updated Thread Title',
      body: 'Updated Thread Body',
      owner: 'user-123',
    };

    const mockUpdatedThread = new UpdateThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.updateThread = jest.fn().mockImplementation(() => Promise.resolve(mockUpdatedThread));
    
    // Creating use case instance
    const updateThreadUseCase = new UpdateThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    

    // Action
    const updatedThread = await updateThreadUseCase.execute(useCasePayload);
    // Assert
    expect(updatedThread).toStrictEqual(new UpdateThread({
      id: useCasePayload.id,
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.updateThread).toBeCalledWith(new UpdateThread({
      id: useCasePayload.id,
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
  });
  it('should throw error when updating thread with incomplete payload', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Updated Thread Title',
      // body is missing
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    // Creating use case instance
    const updateThreadUseCase = new UpdateThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(updateThreadUseCase.execute(useCasePayload)).rejects.toThrowError('UPDATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when updating thread with invalid data type', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
      title: 'Updated Thread Title',
      body: 123, // body should be a string
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    // Creating use case instance
    const updateThreadUseCase = new UpdateThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(updateThreadUseCase.execute(useCasePayload)).rejects.toThrowError('UPDATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
