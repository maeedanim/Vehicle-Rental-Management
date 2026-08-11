import type {
  CreateVehicleRequest,
  Vehicle,
  VehicleListQuery,
  VehicleListResponse,
  UpdateVehicleRequest,
} from '../types/vehicle.types.js';
import { VehicleRepository } from '../repositories/vehicle.repository.js';

export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository = new VehicleRepository(),
  ) {}

  async getVehicles(query: VehicleListQuery): Promise<VehicleListResponse> {
    const { vehicles, totalItems } =
      await this.vehicleRepository.findAll(query);

    const totalPages =
      totalItems === 0 ? 0 : Math.ceil(totalItems / query.limit);

    return {
      vehicles,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalItems,
        totalPages,
      },
    };
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    return vehicle;
  }

  async createVehicle(
    data: CreateVehicleRequest,
    photoPath: string | null,
  ): Promise<Vehicle> {
    const existingVehicle =
      await this.vehicleRepository.findByPlateNumber(data.plateNumber);

    if (existingVehicle) {
      throw new Error('A vehicle with this plate number already exists');
    }

    return this.vehicleRepository.create(data, photoPath);
  }

  async updateVehicle(
    id: number,
    data: UpdateVehicleRequest,
    photoPath?: string,
  ): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findById(id);

    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }

    if (data.plateNumber !== undefined) {
      const vehicleWithSamePlate =
        await this.vehicleRepository.findByPlateNumber(data.plateNumber, id);

      if (vehicleWithSamePlate) {
        throw new Error('A vehicle with this plate number already exists');
      }
    }

    const updatedVehicle = await this.vehicleRepository.update(
      id,
      data,
      photoPath,
    );

    if (!updatedVehicle) {
      throw new Error('Vehicle not found');
    }

    return updatedVehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    const deleted = await this.vehicleRepository.softDelete(id);

    if (!deleted) {
      throw new Error('Vehicle could not be deleted');
    }
  }
}