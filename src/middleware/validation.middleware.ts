import type { NextFunction, Request, Response } from 'express';
import type Joi from 'joi';

type ValidationTarget = 'body' | 'params' | 'query';

export function validate(
  schema: Joi.ObjectSchema,
  target: ValidationTarget,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });

      return;
    }

    if (target === 'body') {
      req.body = value;
    } else if (target === 'params') {
      Object.assign(req.params, value);
    }

    next();
  };
}