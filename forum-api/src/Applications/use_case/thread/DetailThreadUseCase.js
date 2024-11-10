const DetailThread = require('../../../Domains/threads/entities/DetailThread');

class DetailThreadUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    if (threadId) {
      const thread = await this._threadRepository.getThreads(threadId);
      const user = await this._userRepository.getUserById(thread.owner);
      const comments = await this._commentRepository.getCommentsByThreadId(threadId);
      const detailComments = comments.map((comment) => new DetailComment(comment));
      return new DetailThread({ thread, user, comments });
    } else {
      const threads = await this._threadRepository.getThreads();
      console.log('masuk sini detail thread use case 2', threads);
      return threads;
    }
  }
}

module.exports = DetailThreadUseCase;
