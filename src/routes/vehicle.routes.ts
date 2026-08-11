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

router.get(
  '/',
  authMiddleware,
  validate(vehicleListQuerySchema, 'query'),
  vehicleController.getVehicles,
);

router.get(
  '/:id',
  authMiddleware,
  validate(vehicleIdSchema, 'params'),
  vehicleController.getVehicleById,
);

router.post(
  '/',
  authMiddleware,
  uploadVehiclePhoto,
  validate(createVehicleSchema, 'body'),
  vehicleController.createVehicle,
);

router.put(
  '/:id',
  authMiddleware,
  uploadVehiclePhoto,
  validate(vehicleIdSchema, 'params'),
  validate(updateVehicleSchema, 'body'),
  vehicleController.updateVehicle,
);

router.delete(
  '/:id',
  authMiddleware,
  validate(vehicleIdSchema, 'params'),
  vehicleController.deleteVehicle,
);

export default router;