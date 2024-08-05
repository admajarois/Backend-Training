const ClientError = require("../../exceptions/ClientError");

class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    postAlbumHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const { name, year } = request.payload;
            const albumId = this._service.addAlbum({ name, year });
            console.log(albumId);
            

            const response = h.response({
                status: 'success',
                message: "Album has been added",
                data: {
                    albumId
                },
            });

            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;  
            }
            const response = h.response({
                status: 'error',
                message: 'Sorry, fail server error.'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    getAlbumsHandler() {
        const albums = this._service.getAlbums();
        return {
            status: 'success',
            data: {
                albums,
            },
        };
    }

    getAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const album = this._service.getAlbumById(id);
            return {
                status: 'success',
                data: {
                    album,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;  
            }
            const response = h.response({
                status: 'error',
                message: 'Sorry, fail server error.'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    putAlbumByIdHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);

            const { id } = request.params;
            const { name, year } = request.payload;
            this._service.editAlbumById(id, { name, year });

            return {
                status: 'success',
                message: 'Album has been updated',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;  
            }
            const response = h.response({
                status: 'error',
                message: 'Sorry, fail server error.'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    deleteAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            this._service.deleteAlbumById(id);

            return {
                status: 'success',
                message: 'Album has been deleted',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;  
            }
            const response = h.response({
                status: 'error',
                message: 'Sorry, fail server error.'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}


module.exports = AlbumsHandler;