const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");


class PlaylistSongActivitiesService {
    constructor() {
        this._pool = new Pool();
    }

    async addActivity(playlistId, songId, userId, action) {
        const id = `activity-${nanoid(16)}`;
        const time = new Date().toISOString();
        const created_at = new Date().toISOString();
        const updated_at = created_at;
        const query = {
            text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: [id, playlistId, songId, userId, action, time, created_at, updated_at],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Failed to add activity');
        }

        return result.rows[0].id;
    }

    async getActivities(playlistId) {
        const query = {
            text: `
                SELECT users.username, songs.title, psa.action, psa.time
                FROM playlist_song_activities psa
                LEFT JOIN users ON psa.user_id = users.id
                LEFT JOIN songs ON psa.song_id = songs.id
                WHERE psa.playlist_id = $1
                ORDER BY psa.time ASC
            `,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        return {
            playlistId,
            activities: result.rows
        };
    }
}

module.exports = PlaylistSongActivitiesService;