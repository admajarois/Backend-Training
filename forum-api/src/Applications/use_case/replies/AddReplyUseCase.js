const AddReply = require('../../../Domains/replies/entites/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(addReply.threadId);
    await this._commentRepository.verifyCommentAvailability(addReply.commentId);
    const addedReply = await this._replyRepository.postReply(addReply);
    return addedReply;
  }
}

module.exports = AddReplyUseCase;
