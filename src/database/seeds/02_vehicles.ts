import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('vehicles').insert([
    {
      name: 'Toyota Corolla',
      plate_number: 'DHAKA-1234',
      category: 'Sedan',
      daily_rate: 3500.0,
    },
    {
      name: 'Toyota RAV4',
      plate_number: 'DHAKA-5678',
      category: 'SUV',
      daily_rate: 5000.0,
    },
    {
      name: 'Honda Civic',
      plate_number: 'DHAKA-9012',
      category: 'Sedan',
      daily_rate: 4200.0,
    },
    {
      name: 'Nissan X-Trail',
      plate_number: 'DHAKA-3456',
      category: 'SUV',
      daily_rate: 5500.0,
    },
  ]);
}