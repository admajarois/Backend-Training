const AddThread = require('../../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository, threadValidator }) {
    this._threadRepository = threadRepository;
    this._threadValidator = threadValidator;
  }

  async execute(useCasePayload) {
    const addThread = new AddThread(useCasePayload);
    this._threadValidator.validateAddThreadPayload(addThread);
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;