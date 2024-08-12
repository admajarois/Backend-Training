const autoBind = require("auto-bind");

class PlaylistSongsHandler {
    constructor(playlistSongsService, activitiesService, validator) {
        this._playlistSongsService = playlistSongsService;
        this._activitiesService = activitiesService;
        this._validator = validator;

        autoBind(this);
    }

    async postPlaylistSongHandler(request, h) {
        console.log(request);
        
        this._validator.validatePlaylistSongPayload(request.payload);
        const { id } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistSongsService.verifyPlaylistAccess(id, credentialId);
        await this._playlistSongsService.verifySongs(songId);
        await this._playlistSongsService.addSongToPlaylist(id, songId);
        await this._playlistSongActivitiesService.addActivity(id, songId, credentialId, 'add');
        

        const response = h.response({
            status: 'success',
            message: 'Song added to playlist successfully',
        });
        response.code(201);
        return response;
    }

    async getPlaylistSongsHandler(request) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistSongsService.verifyPlaylistAccess(id, credentialId);
        const playlist = await this._playlistSongsService.getSongsFromPlaylist(id);
        

        return {
            status: 'success',
            data: {
                playlist,
            },
        };
    }

    async deletePlaylistSongHandler(request) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { id } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistSongsService.verifyPlaylistAccess(id, credentialId);
        await this._playlistSongsService.deleteSongFromPlaylist(id, songId);
        await this._playlistSongActivitiesService.addActivity(id, songId, credentialId, 'delete');

        return {
            status: 'success',
            message: 'Song removed from playlist successfully',
        };
    }
}

module.exports = PlaylistSongsHandler;