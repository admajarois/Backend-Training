const { Pool } = require("pg");
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const bcrypt = require('bcrypt');
const { nanoid } = require("nanoid");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async addUser({username, password, fullname}) {
        await this.verifyNewUsername(username);

        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, username, hashedPassword, fullname, createdAt, updatedAt],
        }

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('Failed add new user.');
        }
        return result.rows[0].id;
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username]
        };

        const result = await this._pool.query(query);

        if (result.rows.length > 0) {
            throw new InvariantError('Failed add new user, username already exists');
        }
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

    async verifyUserCredential(username, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new AuthenticationError('Username not found');
        }

        const { id, password: hashedPassword } = result.rows[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError('Wrong credentials')
        }

        return id;
    }
}


module.exports = UsersService;