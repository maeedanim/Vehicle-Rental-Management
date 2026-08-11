import knex from 'knex';

import env from './env.js';

const database = knex({
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
});

export default database;
