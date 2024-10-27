/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumn('threads', {
    owner: {
      type: 'varchar(255)',
      notNull: true
    }
  });

  pgm.addConstraint('threads', 'fk_threads.owner_users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE'
    }
  });
};

exports.down = pgm => {
  pgm.dropConstraint('threads', 'fk_threads.owner_users.id');
  pgm.dropColumn('threads', 'owner');
};
