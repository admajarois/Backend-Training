class GetReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);
    await this._commentRepository.verifyCommentAvailability(useCasePayload.commentId);
    const retrievedReply = await this._replyRepository.getRepliesByCommentId(useCasePayload);
    return retrievedReply;
  }
}

module.exports = GetReplyUseCase;
