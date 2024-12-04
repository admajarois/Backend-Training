class GetReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, commentId, active } = payload;

    this.id = id;
    this.content = active ? content : '**balasan telah dihapus**';
    this.date = date;
    this.username = username;
    this.commentId = commentId;
  }

  _verifyPayload({ id, content, date, username, commentId }) {
    if (!id || !content || !date || !username || !commentId) {
      throw new Error('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof commentId !== 'string') {
      throw new Error('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetReply;
