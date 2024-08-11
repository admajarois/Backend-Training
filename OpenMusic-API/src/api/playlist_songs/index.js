const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');


module.exports = {
    name: 'playlistsSongs',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const playlistSongsHandler = new PlaylistSongsHandler(service, validator);
        server.route(routes(playlistSongsHandler));
    }
}