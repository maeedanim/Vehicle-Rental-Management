import type { Knex } from 'knex';

import database from '../config/database.js';

import type {
  RentalQueryParams,
  RentalStatus,
} from '../types/rental.types.js';

export interface RentalDatabaseRow {
  id: number;
  vehicle_id: number;
  customer_name: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: RentalStatus;
  created_at: Date;
  updated_at: Date;
}

export interface RentalReportRow {
  id: number;
  name: string;
  total_bookings: string;
  days_rented: string;
  revenue: string;
}



export class RentalRepository {
  async findAll(
    query: RentalQueryParams,
  ): Promise<RentalDatabaseRow[]> {
    const builder = database<RentalDatabaseRow>('rentals')
      .select(
        'id',
        'vehicle_id',
        'customer_name',
        'customer_phone',
        'start_date',
        'end_date',
        'total_amount',
        'status',
        'created_at',
        'updated_at',
      )
      .orderBy('id', 'desc');

    if (query.vehicleId !== undefined) {
      builder.where('vehicle_id', query.vehicleId);
    }

    if (query.status !== undefined) {
      builder.where('status', query.status);
    }

    if (query.startDate !== undefined) {
      builder.where('end_date', '>=', query.startDate);
    }

    if (query.endDate !== undefined) {
      builder.where('start_date', '<=', query.endDate);
    }

    return builder;
  }

  async findById(
    id: number,
    trx?: Knex.Transaction,
  ): Promise<RentalDatabaseRow | undefined> {
    const connection = trx ?? database;

    return connection<RentalDatabaseRow>('rentals')
      .select(
        'id',
        'vehicle_id',
        'customer_name',
        'customer_phone',
        'start_date',
        'end_date',
        'total_amount',
        'status',
        'created_at',
        'updated_at',
      )
      .where('id', id)
      .first();
  }

  async findVehicleRate(
    vehicleId: number,
    trx?: Knex.Transaction,
  ): Promise<number | undefined> {
    const connection = trx ?? database;

    const vehicle = await connection('vehicles')
      .select('daily_rate')
      .where('id', vehicleId)
      .whereNull('deleted_at')
      .first<{ daily_rate: number }>();

    return vehicle?.daily_rate;
  }

  async findOverlappingActiveRental(
    vehicleId: number,
    startDate: string,
    endDate: string,
    excludeRentalId?: number,
    trx?: Knex.Transaction,
  ): Promise<RentalDatabaseRow | undefined> {
    const connection = trx ?? database;

    const query = connection<RentalDatabaseRow>('rentals')
      .select(
        'id',
        'vehicle_id',
        'customer_name',
        'customer_phone',
        'start_date',
        'end_date',
        'total_amount',
        'status',
        'created_at',
        'updated_at',
      )
      .where('vehicle_id', vehicleId)
      .whereIn('status', ['booked', 'ongoing'])
      .where('start_date', '<=', endDate)
      .where('end_date', '>=', startDate);

    if (excludeRentalId !== undefined) {
      query.whereNot('id', excludeRentalId);
    }

    return query.first();
  }

  async create(
    data: {
      vehicleId: number;
      customerName: string;
      customerPhone: string;
      startDate: string;
      endDate: string;
      totalAmount: number;
    },
    trx?: Knex.Transaction,
  ): Promise<RentalDatabaseRow> {
    const connection = trx ?? database;

    const [rental] = await connection<RentalDatabaseRow>('rentals')
      .insert({
        vehicle_id: data.vehicleId,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        start_date: data.startDate,
        end_date: data.endDate,
        total_amount: data.totalAmount,
        status: 'booked',
      })
      .returning([
        'id',
        'vehicle_id',
        'customer_name',
        'customer_phone',
        'start_date',
        'end_date',
        'total_amount',
        'status',
        'created_at',
        'updated_at',
      ]);

    return rental;
  }

  async update(
    id: number,
    data: {
      vehicleId?: number;
      customerName?: string;
      customerPhone?: string;
      startDate?: string;
      endDate?: string;
      totalAmount?: number;
      status?: RentalStatus;
    },
    trx?: Knex.Transaction,
  ): Promise<RentalDatabaseRow> {
    const connection = trx ?? database;

    const updateData: Record<string, unknown> = {
      updated_at: database.fn.now(),
    };

    if (data.vehicleId !== undefined) {
      updateData.vehicle_id = data.vehicleId;
    }

    if (data.customerName !== undefined) {
      updateData.customer_name = data.customerName;
    }

    if (data.customerPhone !== undefined) {
      updateData.customer_phone = data.customerPhone;
    }

    if (data.startDate !== undefined) {
      updateData.start_date = data.startDate;
    }

    if (data.endDate !== undefined) {
      updateData.end_date = data.endDate;
    }

    if (data.totalAmount !== undefined) {
      updateData.total_amount = data.totalAmount;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const [rental] = await connection<RentalDatabaseRow>('rentals')
      .where('id', id)
      .update(updateData)
      .returning([
        'id',
        'vehicle_id',
        'customer_name',
        'customer_phone',
        'start_date',
        'end_date',
        'total_amount',
        'status',
        'created_at',
        'updated_at',
      ]);

    return rental;
  }

  async getMonthlyRentalReport(
  month: string,
  vehicleId?: number,
): Promise<RentalReportRow[]> {
  let query = `
    WITH report_period AS (
      SELECT
        TO_DATE(? || '-01', 'YYYY-MM-DD') AS month_start,
        (
          TO_DATE(? || '-01', 'YYYY-MM-DD')
          + INTERVAL '1 month'
          - INTERVAL '1 day'
        )::date AS month_end
    )

    SELECT
      v.id,
      v.name,

      COUNT(r.id)::text AS total_bookings,

      COALESCE(
        SUM(
          CASE
            WHEN r.id IS NOT NULL THEN
              LEAST(r.end_date, rp.month_end)
              -
              GREATEST(r.start_date, rp.month_start)
              + 1
            ELSE 0
          END
        ),
        0
      )::text AS days_rented,

      COALESCE(
        SUM(
          CASE
            WHEN r.id IS NOT NULL THEN
              v.daily_rate *
              (
                LEAST(r.end_date, rp.month_end)
                -
                GREATEST(r.start_date, rp.month_start)
                + 1
              )
            ELSE 0
          END
        ),
        0
      )::text AS revenue

    FROM vehicles v

    CROSS JOIN report_period rp

    LEFT JOIN rentals r
      ON r.vehicle_id = v.id

      AND r.status IN ('booked', 'ongoing', 'completed')

      AND r.start_date <= rp.month_end
      AND r.end_date >= rp.month_start

    WHERE v.deleted_at IS NULL
  `;

  const bindings: (string | number)[] = [month, month];

  if (vehicleId !== undefined) {
    query += `
      AND v.id = ?
    `;

    bindings.push(vehicleId);
  }

  query += `
    GROUP BY
      v.id,
      v.name,
      v.daily_rate

    ORDER BY
      revenue DESC,
      v.id ASC
  `;

  const result = await database.raw(query, bindings);

  return result.rows as RentalReportRow[];
}


}