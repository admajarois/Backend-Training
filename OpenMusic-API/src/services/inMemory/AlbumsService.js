const { nanoid }  = require('nanoid');

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
            throw new Error('Fail to add new album.');
        }
        return albumId;
    }

    getAlbums() {
        return this._albums;
    }

    getAlbumById(id) {
        const album = this._albums.find(album => album.id === id);
        if (!album) {
            throw new Error('Album not found');
        }
        return album;
    }

    editAlbumById(id, { name, year }) {
        const index = this._albums.findIndex(album => album.id === id);

        if (index === -1) {
            throw new Error('Album not found');
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
            throw new Error('Album not found');
        }

        this._albums.splice(index, 1);
    }
}

module.exports = AlbumsService;
