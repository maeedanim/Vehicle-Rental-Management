import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import { ReportService } from '../services/report.service.js';

export class ReportController {
  constructor(
    private readonly reportService: ReportService,
  ) {}

  getMonthlyRentalReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const report = await this.reportService.getMonthlyRentalReport({
        month: String(req.query.month),
        vehicleId: req.query.vehicle_id
          ? Number(req.query.vehicle_id)
          : undefined,
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };
}