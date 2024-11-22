const UpdateThread = require('../../../Domains/threads/entities/UpdateThread');

class UpdateThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(useCasePayload.id);
    await this._threadRepository.verifyThreadAccess(useCasePayload.id, useCasePayload.owner);
    const updateThread = new UpdateThread(useCasePayload);
    return this._threadRepository.updateThread(updateThread);
  }
}

module.exports = UpdateThreadUseCase;
