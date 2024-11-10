class GetReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const retrievedReply = await this._replyRepository.getRepliesByCommentId(useCasePayload);
    return retrievedReply;
  }
}

module.exports = GetReplyUseCase;
