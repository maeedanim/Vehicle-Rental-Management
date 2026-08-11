import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('rentals', (table) => {
    table.increments('id').primary();

    table
      .integer('vehicle_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('vehicles')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');

    table.string('customer_name', 150).notNullable();

    table.string('customer_phone', 30).notNullable();

    table.date('start_date').notNullable();

    table.date('end_date').notNullable();

    table.decimal('total_amount', 12, 2).notNullable();

    table
      .string('status', 20)
      .notNullable()
      .defaultTo('booked');

    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.check(
      "status IN ('booked', 'ongoing', 'completed', 'cancelled')",
      [],
      'rentals_status_check',
    );

    table.index(['vehicle_id'], 'rentals_vehicle_id_idx');
    table.index(['status'], 'rentals_status_idx');
    table.index(['start_date'], 'rentals_start_date_idx');
    table.index(['end_date'], 'rentals_end_date_idx');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('rentals');
}