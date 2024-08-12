const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');


module.exports = {
    name: 'playlistsSongs',
    version: '1.0.0',
    register: async (server, {playlistSongsService, activitiesService,validator }) => {
        const playlistSongsHandler = new PlaylistSongsHandler(playlistSongsService, activitiesService, validator);
        server.route(routes(playlistSongsHandler));
    }
}