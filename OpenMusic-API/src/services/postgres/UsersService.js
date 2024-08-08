const { Pool } = require("pg");
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const bcrypt = require('bcrypt');
const { nanoid } = require("nanoid");

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async addUse({username, password, fullname}) {
        await this.verifyNewUsername(username);

        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        }

        const result = await this._pool.query(query);
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username]
        };

        const result = await this._pool.query(query);

        if (result.rows.length > 0) {
            throw new InvariantError('Failed add new user, user already exists');
        }

        return result.rows[0].id;
    }

    async getUserById(userId) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('User not found.')
        }

        return result.rows[0];
    }
}


module.exports = UsersService;