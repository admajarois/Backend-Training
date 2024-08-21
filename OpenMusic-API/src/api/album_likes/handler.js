class AlbumLikesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postLikeAlbumHandler = this.postLikeAlbumHandler.bind(this);
        this.getLikeAlbumByIdHandler = this.getLikeAlbumByIdHandler.bind(this);
        this.deleteLikeAlbumByIdHandler = this.deleteLikeAlbumByIdHandler.bind(this);
    }

    async postLikeAlbumHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        // Validate the album ID (optional, based on your implementation)
        await this._validator.validateAlbumId(albumId);

        // Service method to add a like to the album
        await this._service.addLikeToAlbum({ albumId, userId });

        const response = h.response({
            status: 'success',
            message: 'Album liked successfully',
        });
        response.code(201);
        return response;
    }

    async getLikeAlbumByIdHandler(request, h) {
        const { id: albumId } = request.params;

        // Validate the album ID (optional, based on your implementation)
        await this._validator.validateAlbumId(albumId);

        // Service method to get the number of likes for the album
        const { likes, isLiked } = await this._service.getAlbumLikes(albumId);

        const response = h.response({
            status: 'success',
            data: {
                likes,
            },
        });
        response.code(200);
        response.header('X-Album-Is-Liked', isLiked ? 'true' : 'false');
        return response;
    }

    async deleteLikeAlbumByIdHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        // Validate the album ID (optional, based on your implementation)
        await this._validator.validateAlbumId(albumId);

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
