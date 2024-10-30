const UpdateComment = require('../../../Domains/comments/entities/UpdateComment');

class UpdateCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const updateComment = new UpdateComment(useCasePayload);
    await this._commentRepository.updateComment(updateComment);
  }
}

module.exports = UpdateCommentUseCase;
