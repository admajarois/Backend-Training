const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSongToPlaylist(playlistId, songId) {
        const id = `ps-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
            values: [id, playlistId, songId],
        };

        await this._pool.query(query);
    }

    async getSongsFromPlaylist(playlistId) {
        const playlistQuery = {
            text: `SELECT playlists.id, playlists.name, users.username 
                   FROM playlists 
                   JOIN users ON users.id = playlists.user_id
                   WHERE playlists.id = $1`,
            values: [playlistId],
        };

        const playlistResult = await this._pool.query(playlistQuery);

        if (!playlistResult.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const songsQuery = {
            text: `SELECT songs.id, songs.title, songs.performer 
                   FROM songs 
                   JOIN playlist_songs ON songs.id = playlist_songs.song_id 
                   WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        };

        const songsResult = await this._pool.query(songsQuery);

        return {
            ...playlistResult.rows[0],
            songs: songsResult.rows,
        };
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan dalam playlist');
        }
    }

    async verifyPlaylistOwner(playlistId, owner) {
        const query = {
            text: 'SELECT user_id FROM playlists WHERE id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist not found!');
        }

        const playlist = result.rows[0];

        if (playlist.user_id !== owner) {
            throw new AuthorizationError("You don't have authorize of this resource!");
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        // Assuming that only the owner has access for now
        await this.verifyPlaylistOwner(playlistId, userId);
    }

    async verifySongs(songId) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [songId]
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Songs not found!');
        }
    }
}

module.exports = PlaylistSongsService;