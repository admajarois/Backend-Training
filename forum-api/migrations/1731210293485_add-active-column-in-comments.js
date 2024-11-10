/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumn('comments', {
    active: {
      type: 'boolean',
      notNull: true,
      default: true
    }
  });
};

exports.down = pgm => {
  pgm.dropColumn('comments', 'active');
};
