import { Course } from '../entities/course';
import { Repo } from './repo.interface';
import createDebug from 'debug';
import { CourseModel } from './courses.mongo.model.js';
import { HTTPError } from '../types/errors.js';
const debug = createDebug('Social:repo:courses');
export class CoursesMongoRepo implements Repo<Course> {
  private static instance: CoursesMongoRepo;

  public static getInstance(): CoursesMongoRepo {
    if (!CoursesMongoRepo.instance) {
      CoursesMongoRepo.instance = new CoursesMongoRepo();
    }

    return CoursesMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiate');
  }

  async query(): Promise<Course[]> {
    debug('query');
    const data = await CourseModel.find().exec();
    return data;
  }

  async queryId(id: string): Promise<Course> {
    debug('queryId');
    const data = await CourseModel.findById(id).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }

  async search(query: { [key: string]: unknown }): Promise<Course[]> {
    debug('search');
    const data = await CourseModel.find({
      [query.key as string]: query.value,
    }).exec();
    return data;
  }

  async create(info: Partial<Course>): Promise<Course> {
    debug('create');
    const data = await CourseModel.create(info);
    return data;
  }

  async update(info: Partial<Course>): Promise<Course> {
    debug('update');
    const data = await CourseModel.findByIdAndUpdate(info.id, info, {
      new: true,
    }).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug('destroy');
    const data = await CourseModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HTTPError(404, 'Not found', 'Delete not posible: id not found');
  }

  async destroyAll(): Promise<void> {
    debug('destroy all');
    await CourseModel.deleteMany().exec();
  }
}
