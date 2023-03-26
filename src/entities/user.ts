import { Joi } from 'express-validation';
import { ImageInfo } from '../types/image';

export type Role = 'admin' | 'user';

export type User = {
  id: string;
  email: string;
  passwd: string;
  firstName: string;
  surname: string;
  role: string;
  image: ImageInfo;
};

export const registerUserJoiSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': `"email" debe ser tipo 'texto'`,
    'string.email': `El "email"  no es válido`,
    'string.empty': `El "email" no puede faltar`,
  }),

  passwd: Joi.string()
    .regex(/[a-zA-Z0-9]{5,16}/)
    .required(),
  firstName: Joi.string().required(),
  surname: Joi.string().required(),
  // Server generated role: Joi.string().valid('user', 'admin'),
  // Server generated: image: ImageInfo;
});

export const loginJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/[a-zA-Z0-9]{3,30}/)
    .required(),
});
