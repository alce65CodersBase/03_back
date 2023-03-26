import { Request } from 'express';
import { PayloadToken } from './token.js';

export interface RequestPlus extends Request {
  info?: PayloadToken;
  file?: Express.Multer.File;
}
