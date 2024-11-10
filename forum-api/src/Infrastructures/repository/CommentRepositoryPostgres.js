const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DeletedComment = require('../../Domains/comments/entities/DeletedComment.js');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments(id, content, "threadId", owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, "threadId", owner',
      values: [id, content, threadId, owner, date],
    };
    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const content = '**komentar telah dihapus**';
    const active = false;
    const query = {
      text: 'UPDATE comments SET content = $1, active = $2 WHERE id = $3 RETURNING id, content, active',
      values: [content, active, commentId],
    };

    const result = await this._pool.query(query);
    return new DeletedComment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.*, users.username FROM comments JOIN users ON comments.owner = users.id WHERE "threadId" = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const comments = result.rows.map((comment) => new DetailComment({ ...comment }));
    return comments;
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1 AND active = true',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async updateComment(commentId, updateComment) {
    const { content } = updateComment;

    const query = {
      text: 'UPDATE comments SET content = $1 WHERE id = $2 RETURNING id, content, owner',
      values: [content, commentId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getCommentById(commentId) {
    const query = {
      text: 'SELECT comments.*, users.username FROM comments JOIN users ON comments.owner = users.id WHERE comments.id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
    return new DetailComment({ ...result.rows[0] });
  }

}

module.exports = CommentRepositoryPostgres;
