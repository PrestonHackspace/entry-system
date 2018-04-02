import os = require('os');

const { username } = os.userInfo();

// Slightly hacky, the default username for PostgreSQL on Windows is 'postgres'.
// On macOS (HomeBrew) it runs under the current user. Linux may be different.
const devUserName = process.platform === 'darwin' ? username : 'postgres:preston';

// Key for this object is NODE_ENV and defaults to 'development'.
export = {

  development: {
    client: 'pg',
    connection: `postgres://${devUserName}@localhost:5432/entry_system_dev`,
    searchPath: 'knex,public',
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'pg',
    connection: 'postgres://postgres:preston@127.0.0.1:5432/entry_system_staging',
    searchPath: 'knex,public',
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'pg',
    connection: 'postgres://postgres:preston@127.0.0.1:5432/entry_system_production',
    searchPath: 'knex,public',
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
