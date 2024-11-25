class DeletedComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, active } = payload;

    this.id = id;
    this.content = content;
    this.active = active;
  }

  _verifyPayload({ id, content, active }) {
    if (!id || !content || active === undefined) {
      throw new Error('DELETED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof active !== 'boolean') {
      throw new Error('DELETED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeletedComment;
