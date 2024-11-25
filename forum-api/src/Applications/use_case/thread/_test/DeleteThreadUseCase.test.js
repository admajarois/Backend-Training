const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DeleteThread = require('../../../../Domains/threads/entities/DeleteThread');
const DeleteThreadUseCase = require('../DeleteThreadUseCase');

describe('DeleteThreadUseCase', () => {
  it('should orchestrating the delete thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
      owner: 'user-123',
    };

    const mockDeletedThread = new DeleteThread({
      id: useCasePayload.id,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository()

    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteThread = jest.fn().mockImplementation(() => Promise.resolve(new DeleteThread({
      id: useCasePayload.id,
      owner: useCasePayload.owner,
    })));

    // Creating use case instance
    const deleteThreadUseCase = new DeleteThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const deletedThread = await deleteThreadUseCase.execute(useCasePayload);

    // Assert
    expect(deletedThread).toStrictEqual(mockDeletedThread);
    expect(mockThreadRepository.deleteThread).toHaveBeenCalledWith(new DeleteThread(useCasePayload));
  });
  
  it('should throw error when deleting thread with incomplete payload', async () => {
    // Arrange
    const useCasePayload = {
      // id is missing
    };

    const mockThreadRepository = new ThreadRepository();
    // Creating use case instance
    const deleteThreadUseCase = new DeleteThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.reject(new Error('DELETE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')));
    mockThreadRepository.verifyThreadAccess = jest.fn().mockImplementation(() => Promise.reject(new Error('DELETE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')));
    await expect(deleteThreadUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when deleting thread with invalid data type', async () => {
    // Arrange
    const useCasePayload = {
      id: 123, // id should be a string
    };
    
    const mockThreadRepository = new ThreadRepository();
    // Creating use case instance
    const deleteThreadUseCase = new DeleteThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.reject(new Error('DELETE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')));
    mockThreadRepository.verifyThreadAccess = jest.fn().mockImplementation(() => Promise.reject(new Error('DELETE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')));
    await expect(deleteThreadUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
