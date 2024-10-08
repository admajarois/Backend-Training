const autoBind = require("auto-bind");

class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        autoBind(this);
    }

    async postAlbumHandler(request, h) {
            this._validator.validateAlbumPayload(request.payload);
            const { name, year } = request.payload;
            const albumId = await this._service.addAlbum({ name, year });            

            const response = h.response({
                status: 'success',
                message: "Album has been added",
                data: {
                    albumId
                },
            });

            response.code(201);
            return response;
    }

    async getAlbumsHandler() {
        const albums = await this._service.getAlbums();
        return {
            status: 'success',
            data: {
                albums,
            },
        };
    }

    async getAlbumByIdHandler(request) {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        return {
            status: 'success',
            data: {
                album,
            },
        };
    }

    async putAlbumByIdHandler(request) {
        this._validator.validateAlbumPayload(request.payload);

        const { id } = request.params;
        const { name, year } = request.payload;
        await this._service.editAlbumById(id, { name, year });

        return {
            status: 'success',
            message: 'Album has been updated',
        };
    }

    async deleteAlbumByIdHandler(request) {
        const { id } = request.params;
        await this._service.deleteAlbumById(id);

        return {
            status: 'success',
            message: 'Album has been deleted',
        };
    }
}


module.exports = AlbumsHandler;