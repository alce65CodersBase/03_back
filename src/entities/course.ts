import { Joi } from 'express-validation';

export type Course = {
  id: string;
  title: string;
  description: string;
  percentComplete: number;
  favorite: boolean;
};

export type Lesson = {
  title: string;
};

export const courseJoiSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  percentComplete: Joi.number().required(),
  favorite: Joi.boolean().required(),
});
