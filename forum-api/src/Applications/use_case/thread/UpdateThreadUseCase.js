const UpdateThread = require('../../../Domains/threads/entities/UpdateThread');

class UpdateThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    
    const updateThread = new UpdateThread(useCasePayload);
    return this._threadRepository.updateThread(updateThread);
  }
}

module.exports = UpdateThreadUseCase;
