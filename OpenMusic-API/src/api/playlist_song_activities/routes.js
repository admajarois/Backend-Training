const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{id}/activities',
        handler: handler.postPlaylistSongActivitiesHandler,
        options: {
            auth: 'openmusic_jwt'
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/activities',
        handler: handler.getPlaylistSongActivitiesHandler,
        options: {
            auth: 'openmusic_jwt'
        },
    },
];

module.exports = routes;