import type { Knex } from 'knex';

export interface StaffRecord {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export class StaffRepository {
  constructor(private readonly db: Knex) {}

  async findByEmail(email: string): Promise<StaffRecord | undefined> {
    return this.db<StaffRecord>('staff')
      .where({ email })
      .first();
  }
}