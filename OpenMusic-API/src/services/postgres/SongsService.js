const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToSongModel} = require('../../utils');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {

        const id = `song-${nanoid(16)}`;
        const createAt = new Date().toISOString();
        const updateAt = createAt;
        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId, createAt, updateAt],
        };
        
        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Failed to add new song");
            
        }
        return result.rows[0].id;
    }

    async getSongs({title, performer}) {
        let query = 'SELECT id, title, performer FROM songs';
        const conditions = [];
        const values = [];

        if (title) {
            conditions.push('title ILIKE $'+(values.length + 1));
            values.push(`%${title}%`);
        }

        if (performer) {
            conditions.push('performer ILIKE $' + (values.length + 1));
            values.push(`%${performer}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        const result = await this._pool.query({
            text: query,
            values,
        });

        return result.rows.map(mapDBToSongModel);
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError("Song not found");
        }

        return result.rows.map(mapDBToSongModel)[0];
    }

    async editSongById(id, { title, year, genre, performer, duration, albumId }) {
        const updatedAt = new Date().toISOString();
        const query = {
          text: 'UPDATE songs SET title = $1, year = $2, genre= $3, performer= $4, duration= $5, album_id= $6, updated_at = $7 WHERE id = $8 RETURNING id',
          values: [title, year, genre, performer, duration, albumId,  updatedAt, id],
        };
     
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Failed to update song. Id bot found');
        }
    }

    async deleteSongById(id) {
        const query = {
          text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
          values: [id],
        };
     
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Failed to delete song. Id not found');
        }
    }
}

module.exports = SongsService;