const routes = (handler) => [
    {
        method: 'POST',
        path: '/threads',
        handler: handler.postThreadHandler,
        options: {
            auth: 'forum_api_jwt',
        },
    },
    {
        method: 'GET',
        path: '/threads/{id}',
        handler: handler.detailThreadHandler,
    },
    {
        method: 'PUT',
        path: '/threads/{id}',
        handler: handler.updateThreadHandler,
        options: {
            auth: 'forum_api_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/threads/{id}',
        handler: handler.deleteThreadHandler,
        options: {
            auth: 'forum_api_jwt',
        },
    },
    {
        method: 'GET',
        path: '/threads',
        handler: handler.getThreadsHandler,
    },
];

module.exports = routes;
