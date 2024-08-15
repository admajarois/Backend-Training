const autoBind = require("auto-bind");
const NotFoundError = require("../../exceptions/NotFoundError");

class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, usersService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._usersService = usersService;
        this._validator = validator;

        autoBind(this);
    }

    async postCollaborationHandler(request, h) {

        this._validator.validateCollaborationPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

        const user = await this._usersService.getUserById(userId);

        if (!user) {
            throw new NotFoundError('The user you are trying to add as a collaborator does not exist.');
        }

        const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

        const response = h.response({
            status: 'success',
            message: 'Collaboration has added successfuly',
            data: {
                collaborationId,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCollaborationHandler(request) {
        this._validator.validateCollaborationPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const  { playlistId, userId } = request.payload;

        await this._collaborationsService.verifyCollaboratorDeletion(playlistId, credentialId);
        await this._collaborationsService.deleteCollaboration(playlistId, userId);

        return {
            status: 'success',
            message: 'Collaboration deleted successfuly',
        };
    }
}

module.exports = CollaborationsHandler;