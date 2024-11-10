const DeleteReply = require('../../../Domains/replies/entites/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    const deletedReply = await this._replyRepository.deleteReply(deleteReply);
    return deletedReply;
  }
}

module.exports = DeleteReplyUseCase;
