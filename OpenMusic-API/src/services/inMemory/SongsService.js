const { nanoid } = require('nanoid');

class SongsService {
    constructor() {
        this._songs = [];
    }

    addSong({ title, year, genre, performer, duration, albumId }) {
        const id = nanoid(16);
        const createAt = new Date().toISOString();
        const updatedAt = createAt;
        const newSong = {
            id, title, year, genre, performer, duration, albumId, createAt, updatedAt
        };

        this._songs.push(newSong);

        const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

        if (!isSuccess) {
            throw new Error('Failed to add song.')
        }

        return id;
    }

    getSongs() {
        return this._songs;
    }

    getSongById(id) {
        const song = this._songs.find((s) => s.id === id);
        if (!song) {
            throw new Error('Song not found');
        }
        return song;
    }

    editSongById(id, { title, year, genre, performer, duration, albumId }) {
        const index = this._songs.findIndex((s) => s.id === id);

        if (index === -1) {
            throw new Error('Song not found');
        }

        if (!title || !year || !genre || !performer) {
            throw new Error('Required properties are missing');
        }

        const updatedAt = new Date().toISOString();

        this._songs[index] = {
            ...this._songs[index],
            title,
            year,
            genre,
            performer,
            duration,
            albumId,
            updatedAt,
        };
    }

    deleteSongById(id) {
        const index = this._songs.findIndex((s) => s.id === id);

        if (index === -1) {
            throw new Error('Song not found');
        }

        this._songs.splice(index, 1);
    }
}

module.exports = SongsService;