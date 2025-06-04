import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Helper function to apply validation rules and handle validation results
 * @param validations Array of validation chains to apply
 * @returns Express middleware function
 */
export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await Promise.all(validations.map(validation => validation.run(req)));
      
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        next();
        return;
      }
      
      res.status(400).json({ errors: errors.array() });
    } catch (error) {
      next(error);
    }
  };
};
