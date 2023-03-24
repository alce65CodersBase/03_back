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
      endpoints: [
        ['[Get]', `${this.urlBase}/users`],
        ['[Get]', `${this.urlBase}users/:id`],
        ['[Post]', `${this.urlBase}/users/register`],
        ['[Post]', `${this.urlBase}/users/login`],
        ['[Patch]', `${this.urlBase}users/:id`],
        ['[Delete]', `${this.urlBase}users/:id`],
      ],
    };
    res.json(info);
  };
}
