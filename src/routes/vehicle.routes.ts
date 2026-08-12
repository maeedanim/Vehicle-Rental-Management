import { Router } from 'express';

import { VehicleController } from '../controllers/vehicle.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { uploadVehiclePhoto } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleIdSchema,
  vehicleListQuerySchema,
} from '../validators/vehicle.validator.js';

const router = Router();

const vehicleController = new VehicleController();

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles
 *     description: Retrieve a paginated list of vehicles.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter vehicles by category
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation failed
 */
router.get(
  '/',
  authMiddleware,
  validate(vehicleListQuerySchema, 'query'),
  vehicleController.getVehicles,
);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 */
router.get(
  '/:id',
  authMiddleware,
  validate(vehicleIdSchema, 'params'),
  vehicleController.getVehicleById,
);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Create a vehicle
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - plateNumber
 *               - category
 *               - dailyRate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Toyota Corolla
 *               plateNumber:
 *                 type: string
 *                 example: DHAKA-1234
 *               category:
 *                 type: string
 *                 example: Sedan
 *               dailyRate:
 *                 type: number
 *                 format: float
 *                 example: 3500
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation failed
 */
router.post(
  '/',
  authMiddleware,
  uploadVehiclePhoto,
  validate(createVehicleSchema, 'body'),
  vehicleController.createVehicle,
);

/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Toyota Corolla
 *               plateNumber:
 *                 type: string
 *                 example: DHAKA-1234
 *               category:
 *                 type: string
 *                 example: Sedan
 *               dailyRate:
 *                 type: number
 *                 format: float
 *                 example: 3500
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 *       422:
 *         description: Validation failed
 */
router.put(
  '/:id',
  authMiddleware,
  uploadVehiclePhoto,
  validate(vehicleIdSchema, 'params'),
  validate(updateVehicleSchema, 'body'),
  vehicleController.updateVehicle,
);

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     description: Soft-delete a vehicle.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 */
router.delete(
  '/:id',
  authMiddleware,
  validate(vehicleIdSchema, 'params'),
  vehicleController.deleteVehicle,
);

export default router;