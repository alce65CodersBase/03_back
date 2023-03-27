import { Response, Request } from 'express';
import createDebug from 'debug';
const debug = createDebug('Social:controller:home');

export class HomeController {
  constructor(public urlBase: string) {
    debug('Instantiate');
  }

  homeInfo = (_req: Request, res: Response) => {
    const info = {
      info: 'Bootcamp API',
      dataBase: 'Coders_2023_back',
      endpoints: {
        users: [
          ['[Get]', `${this.urlBase}/users`],
          ['[Get]', `${this.urlBase}/users/all`],
          ['[Get]', `${this.urlBase}users/:id`],
          ['[Post]', `${this.urlBase}/users/register`],
          ['[Post]', `${this.urlBase}/users/login`],
          ['[Patch]', `${this.urlBase}/users/login`],
          ['[Patch]', `${this.urlBase}users`],
          ['[Patch]', `${this.urlBase}users/:role:/:id`],
          ['[Patch]', `${this.urlBase}users/:id`],
          ['[Delete]', `${this.urlBase}users`],
          ['[Delete]', `${this.urlBase}users/all`],
          ['[Delete]', `${this.urlBase}users/:id`],
        ],
        courses: [
          ['[Get]', `${this.urlBase}/courses`],
          ['[Get]', `${this.urlBase}courses/:id`],
          ['[Post]', `${this.urlBase}/courses/`],
          ['[Patch]', `${this.urlBase}courses/:id`],
          ['[Delete]', `${this.urlBase}/courses/all`],
          ['[Delete]', `${this.urlBase}courses/:id`],
        ],
      },
    };
    res.json(info);
  };
}
