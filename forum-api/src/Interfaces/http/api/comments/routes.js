const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.putCommentHandler,
  },
]);

module.exports = routes;
