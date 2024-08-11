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
    pgm.createTable('collaborations', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'varchar(50)',
            notNull: true,
        },
        user_id: {
            type: 'varchar(50)',
            notNull: true,
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
        },
    });

    // Menambahkan constraint foreign key
    pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id', {
        foreignKeys: {
            columns: 'playlist_id',
            references: 'playlists(id)',
            onDelete: 'CASCADE',
        },
    });

    pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('collaborations');
};
