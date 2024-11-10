const InvariantError = require('../../../Commons/exceptions/InvariantError');

class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, owner } = payload;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new InvariantError('Thread tidak memiliki properti yang diperlukan');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('Thread tidak memenuhi spesifikasi tipe data');
    }
  }
}

module.exports = AddThread;