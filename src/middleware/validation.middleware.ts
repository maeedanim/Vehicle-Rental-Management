import type {
  NextFunction,
  Request,
  Response,
} from 'express';
import type { ObjectSchema } from 'joi';

type ValidationSource = 'body' | 'query' | 'params';

export function validate(
  schema: ObjectSchema,
  source: ValidationSource,
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const { error, value } = schema.validate(req[source], {
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

    res.locals.validated = res.locals.validated ?? {};
    res.locals.validated[source] = value;

    next();
  };
}