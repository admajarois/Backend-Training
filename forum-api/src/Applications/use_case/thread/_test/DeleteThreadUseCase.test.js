const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadValidator = require('../../../Applications/validator/ThreadValidator');
const DeleteThreadUseCase = require('../DeleteThreadUseCase');

describe('DeleteThreadUseCase', () => {
  it('should orchestrating the delete thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadValidator = new ThreadValidator();

    // Mocking
    mockThreadRepository.checkAvailabilityThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteThreadById = jest.fn().mockImplementation(() => Promise.resolve());

    // Creating use case instance
    const deleteThreadUseCase = new DeleteThreadUseCase({
      threadRepository: mockThreadRepository,
      threadValidator: mockThreadValidator,
    });

    // Action
    await deleteThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.deleteThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
