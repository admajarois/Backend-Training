class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    if (threadId) {
      const thread = await this._threadRepository.getThreadById(threadId);
      const comments = await this._commentRepository.getCommentsByThreadId(threadId);
      console.log(comments);
      const commentThread = await this._attachRepliesToComments(comments);
      thread.comments = commentThread;
      return thread;
    } else {
      const threads = await this._threadRepository.getThreads();
      return threads;
    }
  }

  async _attachRepliesToComments(comments) {
    const commentMap = comments.map(comment => comment.id);
    const replies = await this._replyRepository.getRepliesByCommentIds(commentMap);
    return comments.map(comment => ({
      ...comment,
      replies: replies.filter(reply => reply.commentId === comment.id),
    }));
  }
}

module.exports = DetailThreadUseCase;
