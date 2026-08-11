import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  const passwordHash = await bcrypt.hash('Admin@123', 12);

  await knex('staff').del();

  await knex('staff').insert({
    email: 'admin@vehiclerental.com',
    password_hash: passwordHash,
    name: 'System Administrator',
  });
}