const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSongToPlaylist(playlistId, songId) {
        const id = `ps-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query)

        return result.rows[0].id;
    }

    async getSongsFromPlaylist(playlistId) {
        const playlistQuery = {
            text: `SELECT playlists.id, playlists.name, users.username 
                   FROM playlists 
                   JOIN users ON users.id = playlists.owner
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
        const playlistQuery = {
            text: 'SELECT owner FROM playlists WHERE id = $1',
            values: [playlistId],
        };
    
        const playlistResult = await this._pool.query(playlistQuery);
    
        if (!playlistResult.rows.length) {
            throw new NotFoundError('Playlist not found!');
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
            values: [playlistId, owner],
        };
    
        const accessResult = await this._pool.query(accessQuery);
    
        const hasAccess = (playlist.owner === owner) || accessResult.rows[0].is_collaborator;
    
        if (!hasAccess) {
            throw new AuthorizationError("You don't have authorization to access this resource!");
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        // Assuming that only the owner has access for now
        await this.verifyPlaylistOwner(playlistId, userId);
    }

    async verifySongs(playlistId, songId) {
        const songExistsQuery = {
            text: 'SELECT 1 FROM songs WHERE id = $1',
            values: [songId],
        };
    
        const songResult = await this._pool.query(songExistsQuery);
    
        if (!songResult.rows.length) {
            throw new NotFoundError('Song not found!');
        }
    
        // Then, check if the song is already in the playlist
        const songInPlaylistQuery = {
            text: 'SELECT 1 FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
            values: [playlistId, songId],
        };
    
        const playlistResult = await this._pool.query(songInPlaylistQuery);
    
        if (playlistResult.rows.length > 0) {
            throw new InvariantError('Song already exists in this playlist, you cannot add twice')
        }
    
    }
}

module.exports = PlaylistSongsService;