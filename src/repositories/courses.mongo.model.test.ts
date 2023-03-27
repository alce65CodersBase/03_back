import mongoose, { Document } from 'mongoose';
import { CourseModel } from './courses.mongo.model';
import { dbConnect } from '../db/db.connect';
import { Course } from '../entities/course';

describe('Given Courses Mongoose Schema and Model', () => {
  const mockCourse: Partial<Course> = {
    description: 'test',
    title: 'test',
    percentComplete: 10,
    favorite: true,
  };

  describe('When Model is created', () => {
    beforeEach(async () => {
      await dbConnect();
      await CourseModel.create(mockCourse);
    });
    test('Then it should be used for obtain a Mongoose Document', async () => {
      const [document] = await CourseModel.find().exec();
      if (document) {
        document.toJSON();
        expect(document).toBeInstanceOf(Document);
      }
    });
    afterEach(async () => {
      await CourseModel.deleteMany();
      mongoose.disconnect();
    });
  });
});
