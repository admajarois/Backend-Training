const PlaylistSongActivitiesHandler = require('./handler');
const routes = require('./routes');


module.exports = {
    name: 'playlistSongActivities',
    version: '1.0.0',
    register: async (server, { playlistSongActivitiesService, playlistService, validator}) => {
        const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
            playlistSongActivitiesService, playlistService, validator,
        );
        server.route(routes(playlistSongActivitiesHandler));
    },
};