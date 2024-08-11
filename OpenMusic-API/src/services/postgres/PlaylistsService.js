const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, owner, createdAt, updatedAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username 
                   FROM playlists 
                   JOIN users ON users.id = playlists.user_id 
                   WHERE playlists.user_id = $1`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
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
}

module.exports = PlaylistsService;
