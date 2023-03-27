import mongoose, { Document } from 'mongoose';
import { CourseModel } from './courses.mongo.model';
import { dbConnect } from '../db/db.connect';

describe('Given Courses Mongoose Schema and Model', () => {

  describe('When Model is created', () => {
    test('Then it should be used for obtain a Mongoose Document', async () => {
      await dbConnect('dev');
      const [document] = await CourseModel.find().exec();
      document.toJSON();
      expect(document).toBeInstanceOf(Document);
      mongoose.disconnect();
    });
  });
});
