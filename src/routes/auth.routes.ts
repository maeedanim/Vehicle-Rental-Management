import { Router } from 'express';

import db from '../config/database.js';
import { AuthController } from '../controllers/auth.controller.js';
import { StaffRepository } from '../repositories/staff.repository.js';
import { AuthService } from '../services/auth.service.js';

const router = Router();

const staffRepository = new StaffRepository(db);
const authService = new AuthService(staffRepository);
const authController = new AuthController(authService);

router.post('/login', authController.login);

export default router;