const UpdateComment = require('../../../Domains/comments/entities/UpdateComment');

class UpdateCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);
    console.log("threadId", useCasePayload.threadId);
    await this._commentRepository.verifyCommentAccess(useCasePayload.id, useCasePayload.owner);
    console.log("id", useCasePayload.id);
    console.log("owner", useCasePayload.owner);
    const updateComment = new UpdateComment(useCasePayload);
    await this._commentRepository.updateComment(updateComment);
  }
}

module.exports = UpdateCommentUseCase;
