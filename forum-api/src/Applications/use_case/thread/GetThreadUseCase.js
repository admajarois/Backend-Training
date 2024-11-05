class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute() {
    const threads = await this._threadRepository.getThreads();
    return threads;
  }
}

module.exports = GetThreadUseCase;
