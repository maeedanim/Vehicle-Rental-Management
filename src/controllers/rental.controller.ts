import type { Request, Response } from 'express';

import {
  RentalConflictError,
  RentalNotFoundError,
  RentalService,
  VehicleNotFoundError,
} from '../services/rental.service.js';

import type {
  CreateRentalRequest,
  RentalQueryParams,
  UpdateRentalRequest,
} from '../types/rental.types.js';

export class RentalController {
  constructor(
    private readonly rentalService: RentalService,
  ) {}

  getRentals = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const query: RentalQueryParams = {
      vehicleId: req.query.vehicleId
        ? Number(req.query.vehicleId)
        : undefined,

      status:
        typeof req.query.status === 'string'
          ? (req.query.status as RentalQueryParams['status'])
          : undefined,

      startDate:
        typeof req.query.startDate === 'string'
          ? req.query.startDate
          : undefined,

      endDate:
        typeof req.query.endDate === 'string'
          ? req.query.endDate
          : undefined,
    };

    const rentals =
      await this.rentalService.getRentals(query);

    res.status(200).json({
      success: true,
      data: rentals,
    });
  };

  getRentalById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const rental = await this.rentalService.getRentalById(
        Number(req.params.id),
      );

      res.status(200).json({
        success: true,
        data: rental,
      });
    } catch (error) {
      if (error instanceof RentalNotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
        });

        return;
      }

      throw error;
    }
  };

  createRental = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const request =
        req.body as CreateRentalRequest;

      const rental =
        await this.rentalService.createRental(request);

      res.status(201).json({
        success: true,
        data: rental,
      });
    } catch (error) {
      if (error instanceof RentalConflictError) {
        res.status(409).json({
          success: false,
          message: error.message,
        });

        return;
      }

      if (error instanceof VehicleNotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
        });

        return;
      }

      throw error;
    }
  };

  updateRental = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const request =
        req.body as UpdateRentalRequest;

      const rental =
        await this.rentalService.updateRental(
          Number(req.params.id),
          request,
        );

      res.status(200).json({
        success: true,
        data: rental,
      });
    } catch (error) {
      if (error instanceof RentalNotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
        });

        return;
      }

      if (error instanceof VehicleNotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
        });

        return;
      }

      if (error instanceof RentalConflictError) {
        res.status(409).json({
          success: false,
          message: error.message,
        });

        return;
      }

      throw error;
    }
  };

  deleteRental = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const rental =
        await this.rentalService.cancelRental(
          Number(req.params.id),
        );

      res.status(200).json({
        success: true,
        message: 'Rental cancelled successfully.',
        data: rental,
      });
    } catch (error) {
      if (error instanceof RentalNotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
        });

        return;
      }

      throw error;
    }
  };
}