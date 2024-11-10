const AddComment = require('../../../Domains/comments/entities/AddComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload.threadId);
    if (!thread) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    const addComment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
