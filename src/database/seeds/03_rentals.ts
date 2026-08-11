import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('rentals').del();

  const vehicles = await knex('vehicles')
    .select('id', 'plate_number', 'daily_rate')
    .whereNull('deleted_at')
    .orderBy('id', 'asc');

  if (vehicles.length < 4) {
    throw new Error(
      'At least 4 vehicles are required before running the rental seed.',
    );
  }

  const [
    toyotaCorolla,
    toyotaRav4,
    hondaCivic,
    nissanXTrail,
  ] = vehicles;

  await knex('rentals').insert([
    {
      vehicle_id: toyotaCorolla.id,
      customer_name: 'Rahim Ahmed',
      customer_phone: '01710000001',
      start_date: '2026-07-29',
      end_date: '2026-08-03',
      total_amount: 21000.0,
      status: 'completed',
    },
    {
      vehicle_id: toyotaCorolla.id,
      customer_name: 'Karim Hasan',
      customer_phone: '01710000002',
      start_date: '2026-08-10',
      end_date: '2026-08-12',
      total_amount: 10500.0,
      status: 'booked',
    },
    {
      vehicle_id: toyotaRav4.id,
      customer_name: 'Nusrat Jahan',
      customer_phone: '01710000003',
      start_date: '2026-08-05',
      end_date: '2026-08-07',
      total_amount: 15000.0,
      status: 'completed',
    },
    {
      vehicle_id: hondaCivic.id,
      customer_name: 'Tanvir Hossain',
      customer_phone: '01710000004',
      start_date: '2026-08-15',
      end_date: '2026-08-15',
      total_amount: 4200.0,
      status: 'ongoing',
    },
    {
      vehicle_id: nissanXTrail.id,
      customer_name: 'Sadia Rahman',
      customer_phone: '01710000005',
      start_date: '2026-08-20',
      end_date: '2026-08-22',
      total_amount: 16500.0,
      status: 'cancelled',
    },
  ]);
}