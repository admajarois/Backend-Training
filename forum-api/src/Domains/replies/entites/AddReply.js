const InvariantError = require('../../../Commons/exceptions/InvariantError');

class AddReply {
  constructor(payload) {
    console.log('masuk sini add reply constructor', payload);
    this._verifyPayload(payload);

    const { content, threadId, commentId, owner } = payload;

    this.content = content;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, commentId, owner }) {
    console.log('masuk sini verify payload', content, threadId, commentId, owner);
    if (!content || !threadId || !commentId || !owner) {
      throw new InvariantError('Reply tidak memiliki properti yang diperlukan');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      console.log('masuk sini not meet data type specification', content, threadId, commentId, owner);
      throw new InvariantError('Reply tidak memenuhi spesifikasi tipe data');
    }
  }
}

module.exports = AddReply;
