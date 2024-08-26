const autoBind = require('auto-bind');
const path = require('path');



class UploadsHandler {
    constructor(storageService, albumsService, validator) {
        this._storageService = storageService;
        this._albumsService = albumsService;
        this._validator = validator;

        autoBind(this);
    }

    async postUploadCoverHandler(request, h) {
        console.log('Received payload:', request.payload);
        const { cover } = request.payload;
        
        const { id: albumId } = request.params
        const album = await this._albumsService.getAlbumById(albumId)
        if (album.coverUrl) {
            const filename = path.basename(album.coverUrl);
            await this._storageService.deleteFile(filename)
        }
        this._validator.validateAlbumCovers(cover.hapi.headers);

        const filename = await this._storageService.writeFile(cover, cover.hapi);
        await this._albumsService.updateAlbumCover(albumId, filename);
        const response = h.response({
            status: 'success',
            message: 'Cover has uploaded successfuly',
        });
        response.code(201);
        return response;
    }
}

module.exports = UploadsHandler;