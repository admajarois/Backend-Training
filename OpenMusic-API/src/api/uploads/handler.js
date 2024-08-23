const autoBind = require('auto-bind');



class UploadsHandler {
    constructor(storageService, albumsService, validator) {
        this._storageService = storageService;
        this._albumsService = albumsService;
        this._validator = validator;

        autoBind(this);
    }

    async postUploadCoverHandler(request, h) {
        const { data } = request.payload;
        
        const { id: albumId } = request.params
        const album = await this._albumsService.getAlbumById(albumId)
        if (album.cover) {
            await this._storageService.deleteFile(album.cover)
        }
        this._validator.validateAlbumCovers(data.hapi.headers);

        const filename = await this._storageService.writeFile(data, data.hapi);
        await this._albumsService.updateAlbumCover(albumId, filename);
        const response = h.response({
            status: 'success',
            data: {
                fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = UploadsHandler;