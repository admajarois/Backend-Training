const routes = require('./routes');
const CommentsHandler = require('./handler');


const commentsPlugin = {
  name: 'comments',
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler(container);
    server.route(routes(commentsHandler));
  },
};

module.exports = commentsPlugin;
