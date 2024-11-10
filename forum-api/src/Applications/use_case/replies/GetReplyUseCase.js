const GetReply = require('../../../Domains/replies/entites/GetReply');

class GetReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const getReply = new GetReply(useCasePayload);
    const retrievedReply = await this._replyRepository.getReply(getReply);
    return retrievedReply;
  }
}

module.exports = GetReplyUseCase;
