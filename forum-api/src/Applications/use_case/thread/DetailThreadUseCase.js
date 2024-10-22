const DetailThread = require('../../../Domains/threads/entities/DetailThread');

class DetailThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    return new DetailThread(thread);
  }
}

module.exports = DetailThreadUseCase;
