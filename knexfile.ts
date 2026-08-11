import type { Knex } from 'knex';

import env from './src/config/env.js';

const config: Record<string, Knex.Config> = {
  development: {
    client: 'pg',

    connection: {
      host: env.database.host,
      port: env.database.port,
      database: env.database.name,
      user: env.database.user,
      password: env.database.password,
    },

    pool: {
      min: env.database.pool.min,
      max: env.database.pool.max,
    },

    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },

    seeds: {
      directory: './src/database/seeds',
      extension: 'ts',
    },
  },
};

export default config;