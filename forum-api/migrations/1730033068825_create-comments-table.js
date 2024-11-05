/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'varchar(255)',
      primaryKey: true
    },
    content: {
      type: 'text',
      notNull: true
    },
    threadId: {
      type: 'varchar(255)',
      notNull: true
    },
    owner: {
      type: 'varchar(255)',
      notNull: true
    }
  });

  pgm.addConstraint('comments', 'fk_comments.threadId_threads.id', {
    foreignKeys: {
      columns: 'threadId',
      references: 'threads(id)',
      onDelete: 'CASCADE'
    }
  });

  pgm.addConstraint('comments', 'fk_comments.owner_users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE'
    }
  });
};

exports.down = pgm => {
  pgm.dropConstraint('comments', 'fk_comments.threadId_threads.id');
  pgm.dropConstraint('comments', 'fk_comments.owner_users.id');
  pgm.dropTable('comments');
};
