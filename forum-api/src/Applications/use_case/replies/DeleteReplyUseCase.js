const DeleteReply = require('../../../Domains/replies/entites/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, replyId, owner } = useCasePayload;
    const deleteReply = new DeleteReply({ id: replyId, owner });
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);

    const deletedReply = await this._replyRepository.deleteReply(deleteReply);
    return deletedReply;
  }
}

module.exports = DeleteReplyUseCase;
