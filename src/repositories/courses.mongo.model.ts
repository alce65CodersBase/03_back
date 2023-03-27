import { Schema, model } from 'mongoose';
import { Course } from '../entities/course';

const course = new Schema<Course>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  percentComplete: {
    type: Number,
    default: 0,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
    required: true,
  },
});

course.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const CourseModel = model('Course', course, 'courses');
