const { Pool } = require('pg');


class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylists(playlistId) {
        const playlistQuery = {
            text: `SELECT playlists.id, playlists.name FROM playlists
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            WHERE playlists.id = $1`,
            values: [playlistId],
        };
        const playlistResult = await this._pool.query(playlistQuery);

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
}

module.exports = PlaylistsService;