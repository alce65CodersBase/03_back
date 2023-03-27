import createDebug from 'debug';
import { Course } from '../entities/course';
import { Repo } from '../repositories/repo.interface';
import { BaseController } from './base.controller.js';
const debug = createDebug('Social:controller:courses');

export class CoursesController extends BaseController<Course> {
  constructor(public repo: Repo<Course>) {
    super(repo);
    debug('Instantiate');
  }
}
