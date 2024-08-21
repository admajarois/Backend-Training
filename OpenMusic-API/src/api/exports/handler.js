const autoBind = require("auto-bind");


class ExportsHandler {
    constructor(producerService, playlistsService, validator) {
        this._producerService = producerService;
        this._playlistsService = playlistsService
        this._validator = validator;   

        autoBind(this);
    }

    async postExportPlaylistsHandler(request, h) {
        this._validator.validateExportPlaylistsPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;


        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)

        const message = {
            userId: credentialId,
            targetEmail: request.payload.targetEmail,
        }

        await this._service.sendMessage('export:playlists', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Your request is on queue',
        });

        response.code(201);
        return response;
    }
}


module.exports = ExportsHandler;