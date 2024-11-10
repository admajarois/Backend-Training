const AddReply = require('../../../Domains/replies/entites/AddReply');
const AddedReply = require('../../../Domains/replies/entites/AddedReply');

class AddReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    const addedReply = await this._replyRepository.postReply(addReply);
    return addedReply;
  }
}

module.exports = AddReplyUseCase;
