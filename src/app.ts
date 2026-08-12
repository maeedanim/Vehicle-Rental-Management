import express, { type Express, type Request, type Response } from 'express';
import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import rentalRoutes from './routes/rental.routes.js';
import reportRoutes from './routes/report.routes.js';


const app: Express = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/rentals', rentalRoutes);
app.use('/reports', reportRoutes);

app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'Vehicle Rental Management API is running',
  });
});

export default app;
