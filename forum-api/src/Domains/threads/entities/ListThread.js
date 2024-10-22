class ListThread {
  constructor(payload) {
    this._verifyPayload(payload);
  }

  _verifyPayload({ threadId }) {
    if (!threadId) {
      throw new Error('LIST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = ListThread;