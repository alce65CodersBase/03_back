import createDebug from 'debug';
import { validate } from 'express-validation';
import { loginJoiSchema, registerUserJoiSchema } from '../entities/user.js';
const debug = createDebug('Social:middleware:validation');

export class ValidationMiddleware {
  constructor() {
    debug('Instantiated');
  }

  registerValidation() {
    debug('Called registerValidation');
    const registerUserValidation = {
      body: registerUserJoiSchema,
    };
    return validate(
      registerUserValidation,
      {
        statusCode: 406,
      },
      { abortEarly: false }
    );
  }

  loginValidation() {
    debug('Called loginValidation');
    const loginValidation = {
      body: loginJoiSchema,
    };
    return validate(loginValidation, {}, { abortEarly: false });
  }
}
