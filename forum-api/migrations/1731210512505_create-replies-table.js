/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    active: {
      type: 'boolean',
      notNull: true,
      default: true
    }
  });

  pgm.addConstraint('replies', 'fk_replies.commentId_comments.id', {
    foreignKeys: {
      columns: 'commentId',
      references: 'comments(id)',
      onDelete: 'CASCADE'
    }
  });

  pgm.addConstraint('replies', 'fk_replies.owner_users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE'
    }
  });
};

exports.down = pgm => {
  pgm.dropTable('replies');
};
