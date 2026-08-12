import Joi from 'joi';

export const rentalReportQuerySchema = Joi.object({
  month: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
    .required()
    .messages({
      'string.pattern.base':
        'month must be in YYYY-MM format, for example 2026-08',
      'any.required': 'month is required',
    }),

  vehicle_id: Joi.number().integer().positive().optional().messages({
    'number.base': 'vehicle_id must be a number',
    'number.integer': 'vehicle_id must be an integer',
    'number.positive': 'vehicle_id must be a positive number',
  }),
});