class AlbumsHandler {
    constructor(service) {
        this._service = service;
        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    postAlbumHandler(request, h) {
        try {
            const { name, year } = request.payload;
            const albumId = this._service.addAlbum({ name, year });

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
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
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

            if (!album) {
                const response = h.response({
                    status: 'fail',
                    message: 'Album not found',
                });
                response.code(404);
                return response;
            }

            return {
                status: 'success',
                data: {
                    album,
                },
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
            return response;
        }
    }

    putAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { name, year } = request.payload;
            this._service.editAlbumById(id, { name, year });

            return {
                status: 'success',
                message: 'Album has been updated',
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
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
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
            return response;
        }
    }
}


module.exports = AlbumsHandler;