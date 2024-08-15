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
    pgm.createTable('songs', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        title: {
            type: 'varchar(100)',
            notNull: true,
        },
        year: {
            type: "integer",
            notNull: true,
        },
        genre: {
            type: 'varchar(50)',
            notNull: true,
        },
        performer: {
            type: 'varchar(50)',
            notNull: true,
        },
        duration: {
           type: 'float(25)',
        },
        album_id: {
            type: 'varchar(50)',
            references: '"albums"',
            onDelete: 'CASCADE'
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    });
    pgm.createIndex('songs', 'album_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('songs');
};
