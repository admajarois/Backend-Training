class UpdateThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body } = payload;
    this.title = title;
    this.body = body;
  }

  _verifyPayload({ id, title, body }) {
    if ( !title || !body) {
      throw new Error('UPDATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('UPDATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}   

module.exports = UpdateThread;
