import { Router } from 'express';
import createDebug from 'debug';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongoRepo } from '../repositories/users.mongo.repo.js';
import { AuthInterceptor } from '../interceptors/auth.interceptor.js';

const debug = createDebug('social:router:users');

// eslint-disable-next-line new-cap
export const usersRouter = Router();
debug('loaded');

const repo = UsersMongoRepo.getInstance();
const controller = new UsersController(repo);
const interceptor = new AuthInterceptor(repo);

usersRouter.get(
  '/',
  interceptor.logged.bind(interceptor),
  controller.getAll.bind(controller)
);

usersRouter.get('/all', controller.getAll.bind(controller));

usersRouter.get(
  '/:id',
  interceptor.logged.bind(interceptor),
  controller.get.bind(controller)
);
// Add user
usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));

usersRouter.patch(
  '/:id',
  interceptor.logged.bind(interceptor),
  interceptor.admin.bind(interceptor),
  controller.changeRole.bind(controller)
);

usersRouter.patch(
  '/role/:id:/:role',
  interceptor.logged.bind(interceptor),
  interceptor.admin.bind(interceptor),
  controller.changeRole.bind(controller)
);

usersRouter.delete('/:id', controller.delete.bind(controller));
