import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import { dirNameGet } from './helpers/files.js';
import { usersRouter } from './routers/users.router.js';
import { errorsMiddleware } from './middlewares/errors.middleware.js';
import { HomeController } from './controllers/home.controller.js';

const debug = createDebug('Social:app');
const dirname = dirNameGet();

export class App {
  app: express.Express;

  constructor(private homeController: HomeController) {
    this.app = express();

    this.app.disable('x-powered-by');

    const corsOptions = {
      origin: '*',
    };
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(cors(corsOptions));

    debug({ __dirname: dirname });
    this.app.use(express.static(path.resolve(dirname, 'public')));

    this.app.get('/', homeController.homeInfo.bind(homeController));

    this.app.use('/users', usersRouter);
    this.app.use(errorsMiddleware);
  }
}
