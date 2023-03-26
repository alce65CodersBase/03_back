import { ValidationMiddleware } from './validation.middleware';
import { validate } from 'express-validation';

jest.mock('express-validation');
jest.mock('../entities/user.js', () => ({
  loginJoiSchema: {},
  registerUserJoiSchema: {},
}));

describe('Given ValidationMiddleware class', () => {
  describe('When it is instantiated', () => {
    const validation = new ValidationMiddleware();
    test('Then loginValidation should be used', () => {
      validation.loginValidation();
      expect(validate).toHaveBeenCalled();
    });
    test('Then registerValidation should be used', () => {
      validation.registerValidation();
      expect(validate).toHaveBeenCalled();
    });
  });
});
