class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new ThreadDetail({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT threads.*, users.username FROM threads LEFT JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreads() {
    const query = 'SELECT threads.*, users.username FROM threads LEFT JOIN users ON threads.owner = users.id';
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteThread(threadId) {
    const query = 'DELETE FROM threads WHERE id = $1';
    await this._pool.query(query, [threadId]);
  }

  async verifyThreadAccess(threadId, userId) {
    const query = 'SELECT threads.* FROM threads WHERE id = $1 AND owner = $2';
    const result = await this._pool.query(query, [threadId, userId]);
    return result.rowCount > 0;
  }
}

module.exports = ThreadRepositoryPostgres;
