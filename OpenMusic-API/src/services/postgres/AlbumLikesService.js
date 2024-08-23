const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");



class AlbumLikesService {
    constructor(albumsService, cacheService) {
        this._pool = new Pool();
        this._albumsService = albumsService;
        this._cacheService = cacheService;
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
        await this._cacheService.delete(`likes:${userId}`);
        return result.rows[0].id;
    }

    async getAlbumLikes(albumId) {
        try {
            const result = await this._cacheService.get(`likes:${albumId}`);
            return JSON.parse(result);
        } catch (error) {
            await this.verifyExistingAlbum(albumId)
            const query = {
                text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
                values: [albumId],
            };
            const result = await this._pool.query(query);
            await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result))
            return result.rowCount;
        }
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

        await this._cacheService.delete(`likes:${userId}`);
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
