const autoBind = require("auto-bind");

class PlaylistSongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postPlaylistSongHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { id } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(id, credentialId);
        await this._service.verifySongs(songId);
        await this._service.addSongToPlaylist(id, songId);

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

        await this._service.verifyPlaylistAccess(id, credentialId);
        const playlist = await this._service.getSongsFromPlaylist(id);

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

        await this._service.verifyPlaylistAccess(id, credentialId);
        await this._service.deleteSongFromPlaylist(id, songId);

        return {
            status: 'success',
            message: 'Song removed from playlist successfully',
        };
    }
}

module.exports = PlaylistSongsHandler;