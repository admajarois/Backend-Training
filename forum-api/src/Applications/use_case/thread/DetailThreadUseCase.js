class DetailThreadUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    if (threadId) {
      const thread = await this._threadRepository.getThreadById(threadId);
      const comments = await this._commentRepository.getCommentsByThreadId(threadId);
      thread.comments = comments;
      return thread;
    } else {
      const threads = await this._threadRepository.getThreads();
      return threads;
    }
  }
}

module.exports = DetailThreadUseCase;
