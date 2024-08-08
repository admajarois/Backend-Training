const { password } = require('pg/lib/defaults');

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        usernamae: {
            type: 'varchar(50)',
            unique: true,
            notNull: true,
        },
        password: {
            type: 'text',
            notNull: true,
        },
        fullname: {
            type: 'text',
            notNull: true,
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('users');
};
