import Joi from 'joi';

export const createVehicleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  plate_number: Joi.string().trim().min(2).max(30).required(),

  category: Joi.string().trim().min(2).max(50).required(),

  daily_rate: Joi.number().positive().precision(2).required(),
});

export const updateVehicleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),

  plate_number: Joi.string().trim().min(2).max(30),

  category: Joi.string().trim().min(2).max(50),

  daily_rate: Joi.number().positive().precision(2),
}).min(1);

/**
 * GET /vehicles/:id
 */
export const vehicleIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

/**
 * GET /vehicles
 */
export const vehicleListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),

  category: Joi.string().trim().max(50).optional(),

  search: Joi.string().trim().max(100).optional(),
});