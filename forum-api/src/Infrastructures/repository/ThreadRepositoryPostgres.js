const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3) RETURNING id, title',
      values: [id, title, body],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE threads.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Thread tidak ditemukan');
    }

    return result.rows[0];
  }

  async getThreads() {
    const query = 'SELECT * FROM threads';
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

  async verifyThreadAccess(threadId, userId) {
    const query = 'SELECT threads.* FROM threads WHERE id = $1 AND owner = $2';
    const result = await this._pool.query(query, [threadId, userId]);
    return result.rowCount > 0;
  }
}

module.exports = ThreadRepositoryPostgres;
