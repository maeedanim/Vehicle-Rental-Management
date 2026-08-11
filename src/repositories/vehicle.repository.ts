import type { Knex } from 'knex';

import db from '../config/database.js';
import type {
  CreateVehicleRequest,
  Vehicle,
  VehicleDatabaseRow,
  VehicleListQuery,
  UpdateVehicleRequest,
} from '../types/vehicle.types.js';

export class VehicleRepository {
  private readonly database: Knex;

  constructor(database: Knex = db) {
    this.database = database;
  }

  private mapRowToVehicle(row: VehicleDatabaseRow): Vehicle {
    return {
      id: row.id,
      name: row.name,
      plateNumber: row.plate_number,
      category: row.category,
      dailyRate: Number(row.daily_rate),
      photoPath: row.photo_path,
      deletedAt: row.deleted_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll(
    query: VehicleListQuery,
  ): Promise<{ vehicles: Vehicle[]; totalItems: number }> {
    const { page, limit, category, search } = query;

    const offset = (page - 1) * limit;

    const baseQuery = this.database('vehicles')
      .whereNull('deleted_at')
      .modify((builder) => {
        if (category) {
          builder.where('category', category);
        }

        if (search) {
          builder.whereILike('name', `%${search}%`);
        }
      });

    const countResult = await baseQuery
      .clone()
      .count<{ count: string }[]>({ count: '*' });

    const totalItems = Number(countResult[0]?.count ?? 0);

    const rows = (await baseQuery
  .clone()
  .select(
    'id',
    'name',
    'plate_number',
    'category',
    'daily_rate',
    'photo_path',
    'deleted_at',
    'created_at',
    'updated_at',
  )
  .orderBy('id', 'asc')
  .limit(limit)
  .offset(offset)) as VehicleDatabaseRow[];

return {
  vehicles: rows.map((row) => this.mapRowToVehicle(row)),
  totalItems,
};
  }

  async findById(id: number): Promise<Vehicle | null> {
    const row = await this.database('vehicles')
      .select(
        'id',
        'name',
        'plate_number',
        'category',
        'daily_rate',
        'photo_path',
        'deleted_at',
        'created_at',
        'updated_at',
      )
      .where('id', id)
      .whereNull('deleted_at')
      .first();

    if (!row) {
      return null;
    }

    return this.mapRowToVehicle(row as VehicleDatabaseRow);
  }

  async findByPlateNumber(
    plateNumber: string,
    excludeId?: number,
  ): Promise<Vehicle | null> {
    const query = this.database('vehicles')
      .select(
        'id',
        'name',
        'plate_number',
        'category',
        'daily_rate',
        'photo_path',
        'deleted_at',
        'created_at',
        'updated_at',
      )
      .where('plate_number', plateNumber)
      .whereNull('deleted_at');

    if (excludeId !== undefined) {
      query.whereNot('id', excludeId);
    }

    const row = await query.first();

    if (!row) {
      return null;
    }

    return this.mapRowToVehicle(row as VehicleDatabaseRow);
  }

  async create(
    data: CreateVehicleRequest,
    photoPath: string | null,
  ): Promise<Vehicle> {
    const [row] = await this.database('vehicles')
      .insert({
        name: data.name,
        plate_number: data.plateNumber,
        category: data.category,
        daily_rate: data.dailyRate,
        photo_path: photoPath,
      })
      .returning([
        'id',
        'name',
        'plate_number',
        'category',
        'daily_rate',
        'photo_path',
        'deleted_at',
        'created_at',
        'updated_at',
      ]);

    return this.mapRowToVehicle(row as VehicleDatabaseRow);
  }

  async update(
    id: number,
    data: UpdateVehicleRequest,
    photoPath?: string,
  ): Promise<Vehicle | null> {
    const updateData: Record<string, unknown> = {
      updated_at: this.database.fn.now(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.plateNumber !== undefined) {
      updateData.plate_number = data.plateNumber;
    }

    if (data.category !== undefined) {
      updateData.category = data.category;
    }

    if (data.dailyRate !== undefined) {
      updateData.daily_rate = data.dailyRate;
    }

    if (photoPath !== undefined) {
      updateData.photo_path = photoPath;
    }

    const [row] = await this.database('vehicles')
      .where('id', id)
      .whereNull('deleted_at')
      .update(updateData)
      .returning([
        'id',
        'name',
        'plate_number',
        'category',
        'daily_rate',
        'photo_path',
        'deleted_at',
        'created_at',
        'updated_at',
      ]);

    if (!row) {
      return null;
    }

    return this.mapRowToVehicle(row as VehicleDatabaseRow);
  }

  async softDelete(id: number): Promise<boolean> {
    const affectedRows = await this.database('vehicles')
      .where('id', id)
      .whereNull('deleted_at')
      .update({
        deleted_at: this.database.fn.now(),
        updated_at: this.database.fn.now(),
      });

    return affectedRows > 0;
  }
}