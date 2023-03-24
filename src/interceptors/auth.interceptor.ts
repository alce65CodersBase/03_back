import createDebug from 'debug';
import { User } from '../entities/user';
import { Repo } from '../repositories/repo.interface';
import { RequestPlus } from '../interfaces/request';
import { Response, NextFunction } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth } from '../services/auth.js';

const debug = createDebug('w6:interceptor');

export class AuthInterceptor {
  constructor(public repoUsers: Repo<User>) {
    debug('Instantiate');
  }

  logged(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Called');
      const authHeader = req.get('Authorization');
      if (!authHeader)
        throw new HTTPError(498, 'Token invalid', 'Not value in auth header');
      if (!authHeader.startsWith('Bearer'))
        throw new HTTPError(498, 'Token invalid', 'Not Bearer in auth header');
      const token = authHeader.slice(7);
      const payload = Auth.verifyJWTGettingPayload(token);
      req.info = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  admin(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Called');
      if (!req.info)
        throw new HTTPError(401, 'Not autorithed', 'Not info about user');
      if (req.info.role !== 'admin')
        throw new HTTPError(401, 'Not autorithed', 'Not admin role');
      next();
    } catch (error) {
      next(error);
    }
  }

  async fromToken(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Called');
      if (!req.info)
        throw new HTTPError(401, 'Not authorized', 'Not info about user');
      // Tengo el id de usuario del token (req.info.id)
      const userId = req.info.id;
      // Se pasa el valor a parámetros (req.params.id)
      req.params.id = userId;
      // Busco la cosa
      next();
    } catch (error) {
      next(error);
    }
  }
}

// TEMP;
// export class AuthThingsInterceptor {
//   constructor(public repoUsers: Repo<User>, private repoThings: Repo<Thing>) {
//     debug('Instantiate');
//   }

//   async authorized(req: RequestPlus, resp: Response, next: NextFunction) {
//     try {
//       debug('Called');
//       if (!req.info)
//         throw new HTTPError(401, 'Not authorized', 'Not info about user');
//       // Tengo el id de usuario (req.info.id)
//       const userId = req.info.id;
//       // Tengo el id de la cosa (req.params.id)
//       const thingId = req.params.id;
//       // Busco la cosa

//       const thing = await this.repoThings.queryId(thingId);
//       // Comparo cosa.owner.id con userId (req.info.id)
//       debug('Thing', thing.owner);
//       debug('User', userId);
//       if (thing.owner.id !== userId)
//         throw new HTTPError(401, 'Not authorized', 'Not authorized');
//       next();
//     } catch (error) {
//       next(error);
//     }
//   }
// }
