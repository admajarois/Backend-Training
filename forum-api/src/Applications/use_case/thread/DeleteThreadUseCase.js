const DeleteThread = require('../../../Domains/threads/entities/DeleteThread');

class DeleteThreadUseCase {
  constructor({ threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(useCasePayload.id);
    await this._threadRepository.verifyThreadAccess(useCasePayload.id, useCasePayload.owner);
    const deleteThread = new DeleteThread(useCasePayload);
    await this._threadRepository.deleteThread(deleteThread);
  }
}

module.exports = DeleteThreadUseCase;
