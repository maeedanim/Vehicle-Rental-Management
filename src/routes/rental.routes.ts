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

router.get('/', rentalController.getRentals);

router.get('/:id', rentalController.getRentalById);

router.post(
  '/',
  validate(createRentalSchema),
  rentalController.createRental,
);

router.put(
  '/:id',
  validate(updateRentalSchema),
  rentalController.updateRental,
);

router.delete(
  '/:id',
  rentalController.deleteRental,
);

export default router;