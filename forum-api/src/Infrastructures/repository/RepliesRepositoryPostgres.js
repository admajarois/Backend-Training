const AddedReply = require('../../Domains/replies/entites/AddedReply');
const DeletedReply = require('../../Domains/replies/entites/DeletedReply');

class RepliesRepositoryPostgres {
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }


  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1 AND active = true',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].owner === owner;
  }

  async postReply(addReply) {
    const { content, owner, threadId, commentId } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, threadId, commentId, date],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(deleteReply) {
    const { id } = deleteReply;
    const query = {
      text: 'UPDATE replies SET active = false WHERE id = $1 RETURNING id, content, owner, active',
      values: [id],
    };

    const result = await this._pool.query(query);
    return new DeletedReply({ ...result.rows[0] });
  }
  
  async getRepliesByCommentId(commentId) {
    const query = {
      text: 'SELECT id, content, date, username FROM replies WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(row => new GetReply({ ...row }));
  }
}

module.exports = RepliesRepositoryPostgres;
