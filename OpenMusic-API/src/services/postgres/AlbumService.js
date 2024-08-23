const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToAlbumModel} = require('../../utils');

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        const createAt = new Date().toISOString();
        const updateAt = createAt;
        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, year, createAt, updateAt],
        };
        
        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Failed to add new album");
            
        }
        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool.query('SELECT * FROM albums');
        return result.rows.map(mapDBToAlbumModel);
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError("Album not found");
        }
        const album = result.rows.map(mapDBToAlbumModel)[0];
        if (album.cover) {
            album.coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${album.cover}`;
        }else {
            album.coverUrl = null;
        }
        delete album.cover;
        const songsQuery = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [id],
        };    
        const songsResult = await this._pool.query(songsQuery);
        
        const songs = songsResult.rows;
        
        album.songs = songs;
        
        return album;
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();
        const query = {
          text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
          values: [name, year, updatedAt, id],
        };
     
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Failed to update album. Id not found');
        }
    }

    async deleteAlbumById(id) {
        const query = {
          text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
          values: [id],
        };
     
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Failed to delete album. Id not found');
        }
    }

    async updateAlbumCover(albumId, filename) {
        // Update the album record in the database with the new cover filename
        const query = 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id';
        const result = await this._database.query(query, [filename, albumId]);
    
        if (!result.rows.length) {
          throw new NotFoundError('Failed to update album cover, album not found');
        }
    
        return result.rows[0].id;
    }
}

module.exports = AlbumsService;