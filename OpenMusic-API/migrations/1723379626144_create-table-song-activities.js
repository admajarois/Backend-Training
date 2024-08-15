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
    pgm.createTable('playlist_song_activities', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'varchar(50)',
            notNull: true,
        },
        song_id: {
            type: 'varchar(50)',
            notNull: true,
        },
        user_id: {
            type: 'varchar(50)',
            notNull: true,
        },
        action: {
            type: 'text',
            notNull: true,
        },
        time: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
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

    // Menambahkan constraint foreign key
    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', {
        foreignKeys: {
            columns: 'playlist_id',
            references: 'playlists(id)',
            onDelete: 'CASCADE',
        },
    });

    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.song_id_songs.id', {
        foreignKeys: {
            columns: 'song_id',
            references: 'songs(id)',
        },
    });

    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.user_id_users.id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
        },
    });

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('playlist_song_activities')
};
