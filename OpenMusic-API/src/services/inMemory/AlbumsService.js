const { nanoid }  = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
    constructor() {
        this._albums = [];
    }

    addAlbum({ name, year }) {
        const id = nanoid(16);
        const createAt = new Date().toISOString();
        const updatedAt = createAt;

        const newAlbum = {
            id,
            name,
            year,
            createAt,
            updatedAt,
        };

        this._albums.push(newAlbum);
        
        const isSuccess = this._albums.filter((album) => album.id === id).length > 0;
        if (!isSuccess) {
            throw new InvariantError('Fail to add new album.');
        }
        return id;
    }

    getAlbums() {
        return this._albums;
    }

    getAlbumById(id) {
        const album = this._albums.find(album => album.id === id);
        if (!album) {
            throw new NotFoundError('Album not found');
        }
        return album;
    }

    editAlbumById(id, { name, year }) {
        const index = this._albums.findIndex(album => album.id === id);

        if (index === -1) {
            throw new NotFoundError('Album not found');
        }

        const updatedAt = new Date().toISOString();

        this._albums[index] = {
            ...this._albums[index],
            name,
            year,
            updatedAt,
        };
    }

    deleteAlbumById(id) {
        const index = this._albums.findIndex(album => album.id === id);

        if (index === -1) {
            throw new NotFoundError('Album not found');
        }

        this._albums.splice(index, 1);
    }
}

module.exports = AlbumsService;
