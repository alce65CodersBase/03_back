import { Router } from 'express';
import createDebug from 'debug';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongoRepo } from '../repositories/users.mongo.repo.js';
import { AuthInterceptor } from '../interceptors/auth.interceptor.js';
import { FilesMiddleware } from '../middlewares/files.middleware.js';

const debug = createDebug('social:router:users');

// eslint-disable-next-line new-cap
export const usersRouter = Router();
debug('loaded');

const repo = UsersMongoRepo.getInstance();
const fileStore = new FilesMiddleware();
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
usersRouter.post(
  '/register',
  fileStore.singleFileStore('image', 10_000_000).bind(fileStore),
  fileStore.optimization.bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.register.bind(controller)
);

// Login user
usersRouter.post('/login', controller.login.bind(controller));

usersRouter.patch(
  '/login',
  interceptor.logged.bind(interceptor),
  controller.reLogin.bind(controller)
);

usersRouter.patch(
  '/',
  interceptor.logged.bind(interceptor),
  interceptor.fromToken.bind(interceptor),
  controller.patch.bind(controller)
);

usersRouter.patch(
  '/:id',
  interceptor.logged.bind(interceptor),
  interceptor.admin.bind(interceptor),
  controller.patch.bind(controller)
);

usersRouter.patch(
  '/role/:id:/:role',
  interceptor.logged.bind(interceptor),
  interceptor.admin.bind(interceptor),
  controller.changeRole.bind(controller)
);

usersRouter.delete(
  '/',
  interceptor.logged.bind(interceptor),
  interceptor.fromToken.bind(interceptor),
  controller.delete.bind(controller)
);

usersRouter.delete('/all', controller.deleteAll.bind(controller));

usersRouter.delete(
  '/:id',
  interceptor.logged.bind(interceptor),
  interceptor.admin.bind(interceptor),
  controller.delete.bind(controller)
);
