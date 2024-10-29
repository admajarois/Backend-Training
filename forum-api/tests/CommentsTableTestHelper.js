const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123', content = 'Comment Content', threadId = 'thread-123', owner = 'user-123',
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, content, threadId, owner],
    };

    await pool.query(query);    
  },

  async getComments() {
    const result = await pool.query('SELECT * FROM comments');
    return result.rows;
  },

  async getCommentByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread = $1',
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },


  async updateCommentById(id, { content }) {
    const query = {
      text: 'UPDATE comments SET content = $2 WHERE id = $1',
      values: [id, content],
    };

    await pool.query(query);
  },

  async deleteCommentById(id) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
