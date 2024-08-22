const { Pool } = require('pg');


class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylists(userId) {
        const query = {
            text: `SEELCT playlists.* FROM playlists
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            WHERE playlists.owner = $1 OR collborations.user_id = $1 GROUP BY playlists.id`,
            values: [userId],
        };
        const result = await this._pool.query(query);
        return result.rows
    }
}

module.exports = PlaylistsService;