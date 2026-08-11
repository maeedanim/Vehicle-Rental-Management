import Joi from 'joi';

export const createVehicleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  plateNumber: Joi.string().trim().min(2).max(30).required(),

  category: Joi.string().trim().min(2).max(50).required(),

  dailyRate: Joi.number().positive().precision(2).required(),
});

export const updateVehicleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),

  plateNumber: Joi.string().trim().min(2).max(30),

  category: Joi.string().trim().min(2).max(50),

  dailyRate: Joi.number().positive().precision(2),
}).min(1);

export const vehicleIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const vehicleListQuerySchema = Joi.object({
  page: Joi.number().integer().positive().default(1),

  limit: Joi.number().integer().positive().max(100).default(10),

  category: Joi.string().trim().min(1).max(50).optional(),

  search: Joi.string().trim().max(100).optional(),
});