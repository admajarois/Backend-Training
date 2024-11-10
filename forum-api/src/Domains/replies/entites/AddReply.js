const InvariantError = require('../../../Commons/exceptions/InvariantError');

class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, threadId, commentId, owner } = payload;

    this.content = content;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, commentId, owner }) {
    if (!content || !threadId || !commentId || !owner) {
      throw new InvariantError('tidak dapat membuat balasan');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('Reply tidak memenuhi spesifikasi tipe data');
    }
  }
}

module.exports = AddReply;
