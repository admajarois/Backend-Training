const autoBind = require("auto-bind");

class AlbumLikesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postLikeAlbumHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        // this._validator.validateAlbumLikePayload(request.auth.credentials);

        const like = await this._service.addLikeToAlbum({ albumId, userId });

        const response = h.response({
            status: 'success',
            message: 'Album liked successfully',
            data: {
                like
            }
        });
        response.code(201);
        return response;
    }

    async getLikeAlbumByIdHandler(request, h) {
        const { id: albumId } = request.params;
        const { data: likes, source } = await this._service.getAlbumLikes(albumId);

        // Service method to get the number of likes for the album

        const response = h.response({
            status: 'success',
            data: {
                likes,
            },
        });
        response.header('X-Data-Source', source);
        response.code(200);
        return response;
    }

    async deleteLikeAlbumByIdHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        // Validate the album ID (optional, based on your implementation)

        // Service method to remove a like from the album
        await this._service.removeLikeFromAlbum({ albumId, userId });

        const response = h.response({
            status: 'success',
            message: 'Like removed successfully',
        });
        response.code(200);
        return response;
    }
}

module.exports = AlbumLikesHandler;
