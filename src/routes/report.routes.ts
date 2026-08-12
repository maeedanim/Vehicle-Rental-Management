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

/**
 * @swagger
 * /reports/rentals:
 *   get:
 *     summary: Get monthly rental report
 *     description: Retrieve rental statistics for a specific month.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *         description: Report year
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 8
 *         description: Report month (1-12)
 *     responses:
 *       200:
 *         description: Monthly rental report retrieved successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation failed
 */
router.get(
  '/rentals',
  authMiddleware,
  validate(rentalReportQuerySchema, 'query'),
  reportController.getMonthlyRentalReport,
);

export default router;