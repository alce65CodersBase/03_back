import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { User } from '../entities/user';
import { Repo } from '../repositories/repo.interface';
import { HTTPError } from '../errors/errors.js';
import { Auth } from '../services/auth.js';
import { BaseController } from './base.controller.js';
import { PayloadToken } from '../interfaces/token';
import { RequestPlus } from '../interfaces/request';
const debug = createDebug('Social:controller:users');
export class UsersController extends BaseController<User> {
  constructor(public repo: Repo<User>) {
    super(repo);
    debug('Instantiate');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.friends = [];
      req.body.enemies = [];
      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      console.log({ data });
      this.finalLogin(data[0], resp);
    } catch (error) {
      next(error);
    }
  }

  private async finalLogin(user: User, resp: Response) {
    const payload: PayloadToken = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = Auth.createJWT(payload);
    resp.status(202);
    resp.json({
      token,
      results: [user],
    });
  }

  async reLogin(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Called');
      if (!req.info)
        throw new HTTPError(401, 'Not authorized', 'Not info about user');
      // Tengo el id de usuario del token (req.info.id)
      const user = await this.repo.queryId(req.info.id);
      this.finalLogin(user, resp);
    } catch (error) {
      next(error);
    }
  }

  async changeRole(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      if (!req.params.id || !req.params.role)
        throw new HTTPError(
          400,
          'Bad request',
          'Not valid id or role in the url'
        );
      const user = await this.repo.queryId(req.params.id);
      user.role = req.params.role;
      const actualUser = await this.repo.update(user);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }
}
