import type { Request, Response } from 'express';

import { VehicleService } from '../services/vehicle.service.js';
import type {
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../types/vehicle.types.js';

export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService = new VehicleService(),
  ) {}

  getVehicles = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const query = {
      page: Number.isNaN(page) ? 1 : page,
      limit: Number.isNaN(limit) ? 10 : limit,
      category:
        typeof req.query.category === 'string'
          ? req.query.category
          : undefined,
      search:
        typeof req.query.search === 'string' ? req.query.search : undefined,
    };

    const result = await this.vehicleService.getVehicles(query);

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  getVehicleById = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    const vehicle = await this.vehicleService.getVehicleById(id);

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  };

  createVehicle = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateVehicleRequest;

    const photoPath = req.file
      ? `${envUploadPath()}/${req.file.filename}`
      : null;

    const vehicle = await this.vehicleService.createVehicle(
      body,
      photoPath,
    );

    res.status(201).json({
      success: true,
      data: vehicle,
    });
  };

  updateVehicle = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    const body = req.body as UpdateVehicleRequest;

    const photoPath = req.file
      ? `${envUploadPath()}/${req.file.filename}`
      : undefined;

    const vehicle = await this.vehicleService.updateVehicle(
      id,
      body,
      photoPath,
    );

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  };

  deleteVehicle = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    await this.vehicleService.deleteVehicle(id);

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  };
}

function envUploadPath(): string {
  return 'uploads';
}