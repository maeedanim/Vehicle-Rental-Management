import { Router } from 'express';

import db from '../config/database.js';
import { AuthController } from '../controllers/auth.controller.js';
import { StaffRepository } from '../repositories/staff.repository.js';
import { AuthService } from '../services/auth.service.js';

const router = Router();

const staffRepository = new StaffRepository(db);
const authService = new AuthService(staffRepository);
const authController = new AuthController(authService);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Staff login
 *     description: Authenticate a staff member and receive a JWT access token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', authController.login);

export default router;