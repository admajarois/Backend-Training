class DetailThread {
  constructor(payload) {
    const { thread, user } = payload;
    this._verifyPayload(thread);

    console.log('masuk sini detail thread', payload);
    const { id, title, body } = thread;
    const { username } = user;

    this.id = id;
    this.title = title;
    this.body = body;
    this.username = username;
  }

  _verifyPayload({ id, title, body, owner }) {
    if (!id || !title || !body || !owner) {
      console.log('masuk sini detail thread verify payload', payload);
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      console.log('masuk sini detail thread verify payload 2', payload);
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
