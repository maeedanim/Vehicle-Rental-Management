import type { Request, Response, NextFunction } from 'express';

import type { AuthService } from '../services/auth.service.js';
import type { LoginRequest } from '../types/auth.types.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const credentials = req.body as LoginRequest;

      const result = await this.authService.login(credentials);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}