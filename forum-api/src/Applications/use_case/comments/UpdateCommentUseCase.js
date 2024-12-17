const UpdateComment = require('../../../Domains/comments/entities/UpdateComment');

class UpdateCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);
    await this._commentRepository.verifyCommentAccess(useCasePayload.id, useCasePayload.owner);
    const updateComment = new UpdateComment(useCasePayload);
    const updatedComment = await this._commentRepository.updateComment(updateComment);
    return updatedComment;
  }
}

module.exports = UpdateCommentUseCase;
