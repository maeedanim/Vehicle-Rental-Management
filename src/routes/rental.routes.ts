import { Router } from 'express';

import { RentalController } from '../controllers/rental.controller.js';
import { RentalRepository } from '../repositories/rental.repository.js';
import { RentalService } from '../services/rental.service.js';

import {
  createRentalSchema,
  updateRentalSchema,
} from '../validators/rental.validator.js';

import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

const rentalRepository = new RentalRepository();
const rentalService = new RentalService(rentalRepository);
const rentalController = new RentalController(rentalService);

router.use(authMiddleware);

/**
 * @swagger
 * /rentals:
 *   get:
 *     summary: Get all rentals
 *     tags:
 *       - Rentals
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rentals retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', rentalController.getRentals);

/**
 * @swagger
 * /rentals/{id}:
 *   get:
 *     summary: Get rental by ID
 *     tags:
 *       - Rentals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Rental retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rental not found
 */
router.get('/:id', rentalController.getRentalById);

/**
 * @swagger
 * /rentals:
 *   post:
 *     summary: Create a rental
 *     tags:
 *       - Rentals
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - customerName
 *               - customerPhone
 *               - startDate
 *               - endDate
 *             properties:
 *               vehicleId:
 *                 type: integer
 *                 example: 5
 *               customerName:
 *                 type: string
 *                 example: Rahim Ahmed
 *               customerPhone:
 *                 type: string
 *                 example: 01710000001
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-10
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-12
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 example: 10500
 *               status:
 *                 type: string
 *                 example: booked
 *     responses:
 *       201:
 *         description: Rental created successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation failed
 */
router.post(
  '/',
  validate(createRentalSchema, 'body'),
  rentalController.createRental,
);

/**
 * @swagger
 * /rentals/{id}:
 *   put:
 *     summary: Update a rental
 *     tags:
 *       - Rentals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Rahim Ahmed
 *               customerPhone:
 *                 type: string
 *                 example: 01710000001
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-10
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-12
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 example: 10500
 *               status:
 *                 type: string
 *                 example: booked
 *     responses:
 *       200:
 *         description: Rental updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rental not found
 *       422:
 *         description: Validation failed
 */
router.put(
  '/:id',
  validate(updateRentalSchema, 'body'),
  rentalController.updateRental,
);

/**
 * @swagger
 * /rentals/{id}:
 *   delete:
 *     summary: Delete a rental
 *     tags:
 *       - Rentals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Rental deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rental not found
 */
router.delete('/:id', rentalController.deleteRental);

export default router;