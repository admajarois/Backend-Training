const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class CollaborationsService {
    constructor() {
        this._pool = new Pool();
    }

    async addCollaboration(playlistId, userId) {
        const id = `collab-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Failed adding collaboration');
        }
        return result.rows[0].id;
    }

    async deleteCollaboration(playlistId) {
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 RETURNING id',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Failed to delete collaboration');
        }
    }

    async verifyCollaboratorDeletion(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM playlists  WHERE id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Cannot find playlist');
        }

        if (result.rows[0].owner !== userId) {
            throw new AuthorizationError('You do not have authorize to delete collaboration');
        }
    }


}

module.exports = CollaborationsService;