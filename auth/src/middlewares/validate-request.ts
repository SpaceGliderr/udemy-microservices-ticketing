import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // The validationResult applies the rules defined in the route handler for the incoming request body
  // It then appends error messages if any field in the request body does not meet the set requirements
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next(); // Moves onto executing the next piece of code
};
