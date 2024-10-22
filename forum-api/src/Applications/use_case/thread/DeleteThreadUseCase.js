const DeleteThread = require('../../../Domains/threads/entities/DeleteThread');

class DeleteThreadUseCase {
  constructor({ threadRepository, threadValidator }) {
    this._threadRepository = threadRepository;
    this._threadValidator = threadValidator;
  }

  async execute(useCasePayload) {
    const deleteThread = new DeleteThread(useCasePayload);
    this._threadValidator.validateDeleteThreadPayload(deleteThread);
    return this._threadRepository.deleteThreadById(deleteThread);
  }
}

module.exports = DeleteThreadUseCase;
