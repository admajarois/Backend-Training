const UpdateThread = require('../../../Domains/threads/entities/UpdateThread');

class UpdateThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { id, title, body, owner } = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(id);
    await this._threadRepository.verifyThreadAccess(id, owner);
    const updateThread = new UpdateThread({ id, title, body, owner });
    return this._threadRepository.updateThread(updateThread);
  }
}

module.exports = UpdateThreadUseCase;
