/* eslint-disable new-cap */
import { Router } from 'express';
import createDebug from 'debug';
import { CoursesMongoRepo } from '../repositories/courses.mongo.repo.js';
import { CoursesController } from '../controllers/courses.controller.js';

const debug = createDebug('social:router:courses');
export const coursesRouter = Router();
debug('loaded');

const repo = CoursesMongoRepo.getInstance();
const controller = new CoursesController(repo);

coursesRouter.get('/', controller.getAll.bind(controller));

coursesRouter.get('/:id', controller.get.bind(controller));

coursesRouter.post('/', controller.post.bind(controller));

coursesRouter.patch('/:id', controller.patch.bind(controller));

coursesRouter.delete('/all', controller.deleteAll.bind(controller));

coursesRouter.delete('/:id', controller.delete.bind(controller));
