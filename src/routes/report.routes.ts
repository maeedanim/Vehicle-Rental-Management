import { Router } from 'express';

import { ReportController } from '../controllers/report.controller.js';
import { RentalRepository } from '../repositories/rental.repository.js';
import { ReportService } from '../services/report.service.js';

import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { rentalReportQuerySchema } from '../validators/report.validator.js';

const router = Router();

const rentalRepository = new RentalRepository();
const reportService = new ReportService(rentalRepository);
const reportController = new ReportController(reportService);

router.get(
  '/rentals',
  authMiddleware,
  validate(rentalReportQuerySchema, 'query'),
  reportController.getMonthlyRentalReport,
);

export default router;