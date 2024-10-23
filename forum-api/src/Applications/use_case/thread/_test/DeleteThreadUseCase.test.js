const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DeleteThread = require('../../../../Domains/threads/entities/DeleteThread');
const DeleteThreadUseCase = require('../DeleteThreadUseCase');

describe('DeleteThreadUseCase', () => {
  it('should orchestrating the delete thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };

    const mockDeletedThread = new DeleteThread({
      id: useCasePayload.id,
    });

    const mockThreadRepository = new ThreadRepository()

    // Mocking
    mockThreadRepository.deleteThread = jest.fn().mockImplementation(() => Promise.resolve(mockDeletedThread));

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
});
