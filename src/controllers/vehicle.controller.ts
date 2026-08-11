import type { Request, Response, NextFunction } from 'express';

import { VehicleService } from '../services/vehicle.service.js';
import type {
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../types/vehicle.types.js';

export class VehicleController {
  private readonly vehicleService: VehicleService;

  constructor(vehicleService = new VehicleService()) {
    this.vehicleService = vehicleService;
  }

  getVehicles = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = req.query.page
        ? Number(req.query.page)
        : 1;

      const limit = req.query.limit
        ? Number(req.query.limit)
        : 10;

      const category =
        typeof req.query.category === 'string'
          ? req.query.category
          : undefined;

      const search =
        typeof req.query.search === 'string'
          ? req.query.search
          : undefined;

      const result = await this.vehicleService.getVehicles({
        page,
        limit,
        category,
        search,
      });

      res.status(200).json({
        success: true,
        data: result.vehicles,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getVehicleById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid vehicle ID.',
        });
        return;
      }

      const vehicle = await this.vehicleService.getVehicleById(id);

      res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  createVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = req.body as CreateVehicleRequest;

      const photoPath = req.file
        ? `${process.env.UPLOAD_PATH}/${req.file.filename}`
        : null;

      const vehicle = await this.vehicleService.createVehicle(
        body,
        photoPath,
      );

      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  updateVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid vehicle ID.',
        });
        return;
      }

      const body = req.body as UpdateVehicleRequest;

      const photoPath = req.file
        ? `${process.env.UPLOAD_PATH}/${req.file.filename}`
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
    } catch (error) {
      next(error);
    }
  };

  deleteVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid vehicle ID.',
        });
        return;
      }

      await this.vehicleService.deleteVehicle(id);

      res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };
}