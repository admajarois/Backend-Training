const { nanoid } = require('nanoid');

class SongsHandler {
    constructor(service) {
        this._service = service;
        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    postSongHandler(request, h) {
        try {
            const  { title, year, genre, performer, duration, albumId } = request.payload;
            const songId = this._service.addSongs({title, year, genre, performer, duration, albumId});
            const id = nanoid(16);

            const response = h.response({
                status: 'success',
                message: 'Song has been added',
                data: {
                    songId,
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

    getSongsHandler() {
        const songs = this._service.getSongs();
        return {
          status: 'success',
          data: {
            songs,
          },
        };
    }

    getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = this._service.getSongById(id);
            return {
                status: 'success',
                data: {
                    song,
                },
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
              });
            response.code(404);
            return response;
        }
    }

    putSongByIdHandler(request, h) {
        try {
            const { id } = request.params;

            this._service.editSongById(id, request.payload);
            return {
                status: 'success',
                message: 'Song has updated successfuly.'
            }
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }

    deleteSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            this._service.deleteSongById(id);
            return {
                status: 'success',
                message: 'Song has been deleted.'
            }
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
              });
            response.code(404);
            return response;
        }
    }
}

module.exports = SongsHandler;
