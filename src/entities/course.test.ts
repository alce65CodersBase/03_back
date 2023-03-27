import { courseJoiSchema } from './course';

describe('Given Joi objects from express-validation', () => {
  describe('When courseJoiSchema is imported', () => {
    test('Then it should de courseJoiSchema ', () => {
      expect(typeof courseJoiSchema).toBe('object');
    });
  });
});
