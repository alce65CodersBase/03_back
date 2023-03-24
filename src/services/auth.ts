import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import { HTTPError } from '../errors/errors.js';
import createDebug from 'debug';
import { PayloadToken } from '../interfaces/token.js';
const debug = createDebug('W6:services:auth');

debug('Loaded Static class');

const salt = 10;

export abstract class Auth {
  static createJWT(payload: PayloadToken) {
    return jwt.sign(payload, config.jwtSecret as string);
  }

  static verifyJWTGettingPayload(token: string) {
    const result = jwt.verify(token, config.jwtSecret as string);
    if (typeof result === 'string')
      throw new HTTPError(498, 'Invalid payload', result);
    return result as PayloadToken;
  }

  static hash(value: string): Promise<string> {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
