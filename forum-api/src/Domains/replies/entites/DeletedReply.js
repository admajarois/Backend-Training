class DeletedReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner, active } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
    this.active = active;
  }

  _verifyPayload({ id, content, owner, active }) {
    if (!id || !content || !owner || active === undefined) {
      throw new Error('DELETED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string' || typeof active !== 'boolean') {
      throw new Error('DELETED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeletedReply;
