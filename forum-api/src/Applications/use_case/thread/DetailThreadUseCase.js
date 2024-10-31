const DetailThread = require('../../../Domains/threads/entities/DetailThread');

class DetailThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    if (threadId) {
      const thread = await this._threadRepository.getThreadById(threadId);
      return new DetailThread(thread);
    } else {
      const threads = await this._threadRepository.getAllThreads();
      return threads;
    }
  }
}

module.exports = DetailThreadUseCase;
