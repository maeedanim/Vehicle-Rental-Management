import Joi from 'joi';

export const createRentalSchema = Joi.object({
  vehicleId: Joi.number().integer().positive().required(),

  customerName: Joi.string().trim().min(2).max(100).required(),

  customerPhone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .required(),

  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),

  endDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
});

export const updateRentalSchema = Joi.object({
  vehicleId: Joi.number().integer().positive(),

  customerName: Joi.string().trim().min(2).max(100),

  customerPhone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]{7,20}$/),

  startDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),

  endDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),

  status: Joi.string().valid(
    'booked',
    'ongoing',
    'completed',
    'cancelled',
  ),
}).min(1);