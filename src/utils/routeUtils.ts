import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper function to make controller handlers compatible with Express
 * This converts any Promise<void> or Promise<void | Response> to the type Express expects
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
