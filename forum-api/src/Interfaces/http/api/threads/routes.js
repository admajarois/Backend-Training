const routes = (handler) => [
    {
        method: 'POST',
        path: '/threads',
        handler: handler.postThreadHandler,
    },
    {
        method: 'GET',
        path: '/threads/{id}',
        handler: handler.getThreadByIdHandler,
    },
    {
        method: 'PUT',
        path: '/threads/{id}',
        handler: handler.putThreadByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/threads/{id}',
        handler: handler.deleteThreadByIdHandler,
    },
    {
        method: 'GET',
        path: '/threads',
        handler: handler.getThreadsHandler,
    },
];

module.exports = routes;
