const UpdateThread = require('../../../Domains/threads/entities/UpdateThread');

class UpdateThreadUseCase {
  constructor({ threadRepository, threadValidator }) {
    this._threadRepository = threadRepository;
    this._threadValidator = threadValidator;
  }

  async execute(useCasePayload) {
    
    const updateThread = new UpdateThread(useCasePayload);
    this._threadValidator.validateUpdateThreadPayload(updateThread);
    return this._threadRepository.updateThread(updateThread);
  }
}

module.exports = UpdateThreadUseCase;
