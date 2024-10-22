/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'Thread Title', body = 'Thread Body',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3)',
      values: [id, title, body],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async updateThreadById(id, { title, body }) {
    const query = {
      text: 'UPDATE threads SET title = $2, body = $3 WHERE id = $1',
      values: [id, title, body],
    };

    await pool.query(query);
  },

  async deleteThreadById(id) {
    const query = {
      text: 'DELETE FROM threads WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;

