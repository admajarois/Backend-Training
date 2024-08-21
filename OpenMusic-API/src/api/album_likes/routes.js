const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.postLikeAlbumHandler,
        options: {
            auth: 'openmusic_jwt'
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handler.getLikeAlbumByIdHandler,
        options: {
            auth: 'openmusic_jwt'
        },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: handler.deleteLikeAlbumByIdHandler,
        options: {
            auth: 'openmusic_jwt'
        },
    },
];

module.exports = routes;
