import type { Request, Response, NextFunction } from 'express';
import type Joi from 'joi';

type ValidationTarget = 'body' | 'params' | 'query';

export function validate(
  schema: Joi.ObjectSchema,
  target: ValidationTarget = 'body',
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    req[target] = value;

    next();
  };
}