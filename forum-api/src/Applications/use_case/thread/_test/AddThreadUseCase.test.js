const AddThread = require('../../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const ThreadValidator = require('../../../validator/ThreadValidator');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };

    const mockAddedThread = new AddThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockThreadValidator = new ThreadValidator();
    // Mocking
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThread));

    // Creating use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      threadValidator: mockThreadValidator,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload); 

    // Assert
    expect(addedThread).toStrictEqual(mockAddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new AddThread(useCasePayload));
  });
});
