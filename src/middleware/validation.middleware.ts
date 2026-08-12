import type { NextFunction, Request, Response } from 'express';
import type Joi from 'joi';

export type ValidationTarget = 'body' | 'params' | 'query';

export function validate(
  schema: Joi.ObjectSchema,
  target: ValidationTarget,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      allowUnknown: false,
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

    if (target === 'query') {
      res.locals.validatedQuery = value;
    } else if (target === 'body') {
      req.body = value;
    } else if (target === 'params') {
      req.params = value;
    }

    next();
  };
}