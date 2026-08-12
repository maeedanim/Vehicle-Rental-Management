import express, {
  type Express,
  type Request,
  type Response,
} from 'express';

import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import rentalRoutes from './routes/rental.routes.js';
import reportRoutes from './routes/report.routes.js';

import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/not-found.middleware.js';

import swaggerDocument from './config/swagger.js';

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.json());

/*
 * API routes
 */
app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/rentals', rentalRoutes);
app.use('/reports', reportRoutes);

/*
 * Swagger documentation
 */
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

/*
 * Health check
 */
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'Vehicle Rental Management API is running',
  });
});

/*
 * Error handling must come last
 */
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;