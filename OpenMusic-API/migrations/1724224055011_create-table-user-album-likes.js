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
    pgm.createTable('user_album_likes', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'varchar(50)',
            notNull: true,
        },
        album_id: {
            type: 'varchar(50)',
            notNull: true,
        },
    });

    // Adding a UNIQUE constraint to ensure the combination of user_id and album_id is unique
    pgm.addConstraint('user_album_likes', 'unique_user_id_album_id', {
        unique: ['user_id', 'album_id'],
    });

    // Adding a FOREIGN KEY constraint on user_id referencing the users table
    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'CASCADE'
        },
    });

    // Adding a FOREIGN KEY constraint on album_id referencing the albums table
    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id', {
        foreignKeys: {
            columns: 'album_id',
            references: 'albums(id)',
            onDelete: 'CASCADE'
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('user_album_likes');
};
