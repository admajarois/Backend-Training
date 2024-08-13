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
            text: ` SELECT DISTINCT p.id, p.name, u.username
            FROM playlists p
            JOIN users u ON u.id = p.owner
            LEFT JOIN collaborations c ON p.id = c.playlist_id AND c.user_id = $1
            WHERE p.owner = $1 OR c.user_id IS NOT NULL`,
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

    async verifyDeletePlaylist(playlistId, userId) {
        const playlistQuery = {
            text: 'SELECT owner FROM playlists WHERE id = $1',
            values: [playlistId],
        };
    
        const playlistResult = await this._pool.query(playlistQuery);
    
        if (!playlistResult.rows.length) {
            throw new NotFoundError('Playlist not found!');
        }
    
        const playlist = playlistResult.rows[0];

        if (playlist.owner !== userId) {
            throw new AuthorizationError("You don't have authorization to delete this playlist!");
        }
    }

    async verifyPlaylistOwner(playlistId, userId) {
        const playlistQuery = {
            text: 'SELECT id, owner FROM playlists WHERE id = $1',
            values: [playlistId],
        };
    
        const playlistResult = await this._pool.query(playlistQuery);
    
        if (playlistResult.rowCount === 0) {
            throw new NotFoundError('Playlist not found');
        }
    
        const playlist = playlistResult.rows[0];
    
        // Check if the user is the owner or a collaborator
        const accessQuery = {
            text: `
                SELECT EXISTS (
                    SELECT 1
                    FROM collaborations
                    WHERE playlist_id = $1 AND user_id = $2
                ) AS is_collaborator
            `,
            values: [playlistId, userId],
        };
    
        const accessResult = await this._pool.query(accessQuery);
    
        const hasAccess = (playlist.owner === userId) || accessResult.rows[0].is_collaborator;
    
        if (!hasAccess) {
            throw new AuthorizationError("You don't have authorization to access this resource!");
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        // Assuming that only the owner has access for now
        await this.verifyPlaylistOwner(playlistId, userId);
    }
}

module.exports = PlaylistsService;
