const DeleteThread = require('../../../Domains/threads/entities/DeleteThread');

class DeleteThreadUseCase {
  constructor({ threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deleteThread = new DeleteThread(useCasePayload);
    return this._threadRepository.deleteThread(deleteThread);
  }
}

module.exports = DeleteThreadUseCase;
