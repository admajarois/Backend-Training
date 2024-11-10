const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');


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


  async verifyValidThread(newThread) {
    const { title, body } = newThread;
    if (!title || !body) {
      throw new InvariantError('Gagal menambahkan thread. Mohon isi semua field');
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
    console.log('masuk sini add thread result', result);
    return new AddedThread({ ...result.rows[0] });
  }

  async getThreads(threadId = null) {
    let query;
    if (threadId) {
      query = {
        text: 'SELECT * FROM threads WHERE threads.id = $1',
        values: [threadId],
      };
    } else {
      query = 'SELECT * FROM threads';
    }

    const result = await this._pool.query(query);
    if (threadId) {
      return result.rows[0];
    } else {
      return result.rows;
    }
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

  async verifyThreadAccess(threadId, userId) {
    const query = 'SELECT threads.* FROM threads WHERE id = $1 AND owner = $2';
    const result = await this._pool.query(query, [threadId, userId]);
    return result.rowCount > 0;
  }
}

module.exports = ThreadRepositoryPostgres;
