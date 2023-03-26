import { Error } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../types/errors.js';
import createDebug from 'debug';
import { ValidationError } from 'express-validation';
const debug = createDebug('Social:app:errors');

export const errorsMiddleware = (
  error: CustomError | Error,
  _req: Request,
  resp: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  debug('Call');

  let status = 500;
  let statusMessage = 'Internal server error';

  if (error instanceof HTTPError) {
    status = error.statusCode;
    statusMessage = error.statusMessage;
  }

  if (error instanceof Error.CastError) {
    status = 400;
    statusMessage = 'Bad formatted data in the request';
  }

  if (error instanceof Error.ValidationError) {
    status = 406;
    statusMessage = 'Validation error in the request';
  }

  if (error instanceof ValidationError) {
    let messages = '';
    if (error.details.body) {
      messages = error.details.body.map((item) => item.message).join('; ');
    }

    status = error.statusCode;
    statusMessage = 'Validation error in the request. ' + messages;
  }

  resp.status(status);
  resp.json({
    error: [
      {
        status,
        statusMessage,
      },
    ],
  });
  debug(status, statusMessage, '|', error.message);
};
