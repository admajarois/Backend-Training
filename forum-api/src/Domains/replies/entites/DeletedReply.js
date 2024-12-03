class DeletedReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, active } = payload;

    this.id = id;
    this.content = '**Balasan telah dihapus**';
    this.active = active;
  }

  _verifyPayload({ id, active }) {
    if (!id || active === undefined) {
      throw new Error('DELETED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof active !== 'boolean') {
      throw new Error('DELETED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeletedReply;
