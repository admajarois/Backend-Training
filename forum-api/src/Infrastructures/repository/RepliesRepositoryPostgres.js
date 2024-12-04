const AddedReply = require('../../Domains/replies/entites/AddedReply');
const DeletedReply = require('../../Domains/replies/entites/DeletedReply');
const GetReply = require('../../Domains/replies/entites/GetReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class RepliesRepositoryPostgres {
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }


  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT id,owner FROM replies WHERE id = $1 AND active = true',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Gagal mengakses resource');
    }
    return result.rows[0].id;
  }

  async postReply(addReply) {
    const { content, owner, commentId } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies(id, "commentId", content, owner, date, active) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, commentId, content, owner, date, true],
    };
    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(deleteReply) {
    const { id } = deleteReply;
    const active = false;
    const query = {
      text: 'UPDATE replies SET active = $1 WHERE id = $2 RETURNING id, active',
      values: [active, id],
    };
    const result = await this._pool.query(query);
    return new DeletedReply({ ...result.rows[0] });
  }
  
  async getRepliesByCommentIds(commentIds) {
    const query = {
      text: 'SELECT replies.*, users.username FROM replies JOIN users ON users.id = replies.owner WHERE replies."commentId" = ANY($1) ORDER BY replies.date ASC',
      values: [commentIds],
    };
    const result = await this._pool.query(query);
    return result.rows.map(reply => {
      reply.date = reply.date.toISOString();
      return new GetReply({ ...reply });
    });
  }
}

module.exports = RepliesRepositoryPostgres;
