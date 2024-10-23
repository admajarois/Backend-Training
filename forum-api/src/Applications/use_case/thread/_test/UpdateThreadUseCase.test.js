const UpdateThread = require('../../../../Domains/threads/entities/UpdateThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const ThreadValidator = require('../../../validator/ThreadValidator');
const UpdateThreadUseCase = require('../UpdateThreadUseCase');

describe('UpdateThreadUseCase', () => {
  it('should orchestrating the update thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
      title: 'Updated Thread Title',
      body: 'Updated Thread Body',
    };

    const mockUpdatedThread = new UpdateThread({
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
    expect(updatedThread).toStrictEqual(new UpdateThread({
      id: useCasePayload.id,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
    expect(mockThreadRepository.updateThread).toBeCalledWith(new UpdateThread({
      id: useCasePayload.id,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
