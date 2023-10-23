// Core
import { Response } from 'express';
import { Result, ValidationError } from 'express-validator';

export const validatorHandler = (errorsArray: Result<ValidationError>, response: Response, proceedFunction: Function) => {
  if (errorsArray.isEmpty()) {
    return proceedFunction();
  } else {
    return response.status(400).json({ errors: errorsArray.array() });
  }
};
