const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");



class AlbumLikesService {
    constructor(albumsService) {
        this._pool = new Pool();
        this._albumsService = albumsService;
    }
    async addLikeToAlbum({ albumId, userId }) {
        await this.verifyExistingAlbum(albumId, userId);
        const id = `like-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        }
        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError('Cannot add like this album')
        }
        return result.rows[0].id;
    }

    async getAlbumLikes(albumId) {
        await this.verifyExistingAlbum(albumId)
        const query = {
            text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
            values: [albumId],
        };
        const result = await this._pool.query(query);
        return result.rowCount;
    }

    async removeLikeFromAlbum({ albumId, userId }) {
        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 and album_id = $2 RETURNING id',
            values: [ userId, albumId],
        };
        const result = await this._pool.query(query);
        if (result.rowCount === 0) {
            throw new NotFoundError('Failed to delete like, id not found.')
        }
    }

    async verifyExistingAlbum(albumId, userId = null) {
        const album = await this._albumsService.getAlbumById(albumId);
        if (album.rowCount === 0) {
            throw new NotFoundError("Cannot find the album");
        }
    
        if (userId) {
            const query = {
                text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
                values: [userId, albumId],
            };
            const result = await this._pool.query(query);
            if (result.rowCount > 0) {
                throw new InvariantError('User has already liked this album');
            }
        }
    }
}

module.exports = AlbumLikesService;
