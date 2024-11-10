const InvariantError = require('../../../Commons/exceptions/InvariantError');

class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, threadId, owner } = payload;

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new InvariantError('tidak dapat membuat komentar');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('tidak dapat membuat komentar');
    }
  }
}

module.exports = AddComment;
