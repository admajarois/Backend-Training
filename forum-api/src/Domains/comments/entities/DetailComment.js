class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, username, date, active } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = active ? content : '**komentar telah dihapus**';
  }

  _verifyPayload({ id, content, username, date }) {
    if (!id || !content || !username || !date ) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof username !== 'string') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
