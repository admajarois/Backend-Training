const AddThread = require('../../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyValidThread(useCasePayload);
    console.log('masuk sini execute add thread verify valid thread', useCasePayload);
    const addThread = new AddThread(useCasePayload);
    console.log('masuk sini execute add thread add thread', addThread);
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;