import type {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  Vehicle,
  VehicleListQuery,
  VehicleListResponse,
} from '../types/vehicle.types.js';

import { VehicleRepository } from '../repositories/vehicle.repository.js';

export class VehicleService {
  private readonly vehicleRepository: VehicleRepository;

  constructor(vehicleRepository = new VehicleRepository()) {
    this.vehicleRepository = vehicleRepository;
  }

  async getVehicles(
    query: VehicleListQuery,
  ): Promise<VehicleListResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    if (page < 1) {
      throw new Error('Page must be greater than or equal to 1.');
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100.');
    }

    const result = await this.vehicleRepository.findAll({
      ...query,
      page,
      limit,
    });

    return {
      vehicles: result.vehicles,
      pagination: {
        page,
        limit,
        totalItems: result.totalItems,
        totalPages: Math.ceil(result.totalItems / limit),
      },
    };
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }

    return vehicle;
  }

  async createVehicle(
    data: CreateVehicleRequest,
    photoPath: string | null,
  ): Promise<Vehicle> {
    return this.vehicleRepository.create(data, photoPath);
  }

  async updateVehicle(
    id: number,
    data: UpdateVehicleRequest,
    photoPath?: string,
  ): Promise<Vehicle> {
    const existingVehicle =
      await this.vehicleRepository.findById(id);

    if (!existingVehicle) {
      throw new Error('Vehicle not found.');
    }

    const vehicle = await this.vehicleRepository.update(
      id,
      data,
      photoPath,
    );

    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }

    return vehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    const deleted =
      await this.vehicleRepository.softDelete(id);

    if (!deleted) {
      throw new Error('Vehicle not found.');
    }
  }
}