const routes = require('./routes');
const CommentsHandler = require('./handler');
const CommentsService = require('../../../../services/CommentsService');
const CommentsValidator = require('../../../../validator/comments');

const commentsPlugin = {
  name: 'comments',
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler(container);
    server.route(routes(commentsHandler));
  },
};

module.exports = commentsPlugin;
