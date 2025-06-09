/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'UUID', primaryKey: true },
    email: { type: 'VARCHAR(255)', notNull: true, unique: true },
    username: { type: 'VARCHAR(255)', notNull: true, unique: true },
    password: { type: 'TEXT', notNull: true },
    consent: { type: 'BOOLEAN', notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
