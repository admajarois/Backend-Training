const AddComment = require('../../../Domains/comments/entities/AddComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadAccess(useCasePayload.threadId, useCasePayload.owner);
    const addComment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
