const UpdateComment = require('../../../Domains/comments/entities/UpdateComment');

class UpdateCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.verifyCommentAccess(useCasePayload.id, useCasePayload.owner);
    const updateComment = new UpdateComment(useCasePayload);
    await this._commentRepository.updateComment(updateComment);
  }
}

module.exports = UpdateCommentUseCase;
