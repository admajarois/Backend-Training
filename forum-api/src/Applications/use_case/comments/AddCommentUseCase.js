const AddComment = require('../../../Domains/comments/entities/AddComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    console.log('masuk sini add comment use case', useCasePayload);
    console.log('masuk sini add comment use case 1', useCasePayload.threadId);
    const thread = await this._threadRepository.getThreadById(useCasePayload.threadId);
    if (!thread) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    console.log('masuk sini add comment use case 2');
    const addComment = new AddComment(useCasePayload);
    console.log('masuk sini add comment use case 3');
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
