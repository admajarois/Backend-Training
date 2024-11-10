const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');


class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyThreadAccess(threadId, userId) {
    const thread = await this.getThreadById(threadId);
    if (thread.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyThreadAvailability(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();  

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT threads.*, users.username FROM threads JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return new DetailThread({ thread: result.rows[0] });
  }

  async getThreads() {
    const query = 'SELECT threads.*, users.username FROM threads JOIN users ON threads.owner = users.id';
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteThread(threadId) {
    await this.getThreadById(threadId);
    const query = 'DELETE FROM threads WHERE id = $1';
    await this._pool.query(query, [threadId]);
  }

  async updateThread(threadId, updatedThread) {
    const { title, body } = updatedThread;
    await this.getThreadById(threadId);
    const query = {
      text: 'UPDATE threads SET title = $1, body = $2 WHERE id = $3 RETURNING id, title, body',
      values: [title, body, threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

}

module.exports = ThreadRepositoryPostgres;
