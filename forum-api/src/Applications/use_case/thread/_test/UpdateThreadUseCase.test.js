const UpdateThread = require('../../../Domains/threads/entities/UpdateThread');
const UpdatedThread = require('../../../Domains/threads/entities/UpdatedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadValidator = require('../../../Applications/validator/ThreadValidator');
const UpdateThreadUseCase = require('../UpdateThreadUseCase');

describe('UpdateThreadUseCase', () => {
  it('should orchestrating the update thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      title: 'Updated Thread Title',
      body: 'Updated Thread Body',
    };

    const mockUpdatedThread = new UpdatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockThreadValidator = new ThreadValidator();

    // Mocking
    mockThreadRepository.updateThread = jest.fn().mockImplementation(() => Promise.resolve(mockUpdatedThread));

    // Creating use case instance
    const updateThreadUseCase = new UpdateThreadUseCase({
      threadRepository: mockThreadRepository,
      threadValidator: mockThreadValidator,
    });

    // Action
    const updatedThread = await updateThreadUseCase.execute(useCasePayload);

    // Assert
    expect(updatedThread).toStrictEqual(mockUpdatedThread);
    expect(mockThreadRepository.updateThread).toHaveBeenCalledWith(new UpdateThread(useCasePayload));
  });
});
