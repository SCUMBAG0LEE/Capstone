require('dotenv').config();

module.exports = {
    migrationFolder: 'migrations',
    databaseUrl: process.env.PGDBURL || {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      ssl: { rejectUnauthorized: false },
    },
  };
  