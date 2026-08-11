import database from '../config/database.js';
import { calculateRentalDays } from '../utils/date.js';
import {
  RentalRepository,
  type RentalDatabaseRow,
} from '../repositories/rental.repository.js';
import type {
  CreateRentalRequest,
  RentalQueryParams,
  UpdateRentalRequest,
} from '../types/rental.types.js';

export class RentalConflictError extends Error {
  constructor() {
    super('Vehicle is already booked for the requested period.');
    this.name = 'RentalConflictError';
  }
}

export class RentalNotFoundError extends Error {
  constructor() {
    super('Rental not found.');
    this.name = 'RentalNotFoundError';
  }
}

export class VehicleNotFoundError extends Error {
  constructor() {
    super('Vehicle not found.');
    this.name = 'VehicleNotFoundError';
  }
}

export class RentalService {
  constructor(
    private readonly rentalRepository: RentalRepository,
  ) {}

  async getRentals(
    query: RentalQueryParams,
  ): Promise<RentalDatabaseRow[]> {
    return this.rentalRepository.findAll(query);
  }

  async getRentalById(id: number): Promise<RentalDatabaseRow> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new RentalNotFoundError();
    }

    return rental;
  }

  async createRental(
    request: CreateRentalRequest,
  ): Promise<RentalDatabaseRow> {
    if (request.endDate < request.startDate) {
      throw new Error('endDate cannot be before startDate.');
    }

    return database.transaction(async (trx) => {
      const dailyRate = await this.rentalRepository.findVehicleRate(
        request.vehicleId,
        trx,
      );

      if (dailyRate === undefined) {
        throw new VehicleNotFoundError();
      }

      const conflictingRental =
        await this.rentalRepository.findOverlappingActiveRental(
          request.vehicleId,
          request.startDate,
          request.endDate,
          undefined,
          trx,
        );

      if (conflictingRental) {
        throw new RentalConflictError();
      }

      const rentalDays = calculateRentalDays(
        request.startDate,
        request.endDate,
      );

      const totalAmount = dailyRate * rentalDays;

      return this.rentalRepository.create(
        {
          vehicleId: request.vehicleId,
          customerName: request.customerName,
          customerPhone: request.customerPhone,
          startDate: request.startDate,
          endDate: request.endDate,
          totalAmount,
        },
        trx,
      );
    });
  }

  async updateRental(
    id: number,
    request: UpdateRentalRequest,
  ): Promise<RentalDatabaseRow> {
    return database.transaction(async (trx) => {
      const existingRental =
        await this.rentalRepository.findById(id, trx);

      if (!existingRental) {
        throw new RentalNotFoundError();
      }

      const vehicleId =
        request.vehicleId ?? existingRental.vehicle_id;

      const startDate =
        request.startDate ?? existingRental.start_date;

      const endDate =
        request.endDate ?? existingRental.end_date;

      const resultingStatus =
        request.status ?? existingRental.status;

      if (endDate < startDate) {
        throw new Error('endDate cannot be before startDate.');
      }

      const vehicleRate =
        await this.rentalRepository.findVehicleRate(
          vehicleId,
          trx,
        );

      if (vehicleRate === undefined) {
        throw new VehicleNotFoundError();
      }

      const isActiveRental =
        resultingStatus === 'booked' ||
        resultingStatus === 'ongoing';

      if (isActiveRental) {
        const conflictingRental =
          await this.rentalRepository.findOverlappingActiveRental(
            vehicleId,
            startDate,
            endDate,
            id,
            trx,
          );

        if (conflictingRental) {
          throw new RentalConflictError();
        }
      }

      const rentalDays = calculateRentalDays(
        startDate,
        endDate,
      );

      const totalAmount = vehicleRate * rentalDays;

      return this.rentalRepository.update(
        id,
        {
          vehicleId,
          customerName: request.customerName,
          customerPhone: request.customerPhone,
          startDate,
          endDate,
          totalAmount,
          status: resultingStatus,
        },
        trx,
      );
    });
  }

  async cancelRental(id: number): Promise<RentalDatabaseRow> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new RentalNotFoundError();
    }

    return this.rentalRepository.update(id, {
      status: 'cancelled',
    });
  }
}