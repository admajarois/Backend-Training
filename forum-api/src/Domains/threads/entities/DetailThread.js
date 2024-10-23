class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
  }

  _verifyPayload({ id, title, body }) {
    if (!id || !title || !body) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
