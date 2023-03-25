import path from 'path';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { RequestPlus } from '../interfaces/request.js';
import multer from 'multer';
import sharp from 'sharp';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors.js';
import { FireBase } from '../services/firebase.js';
const debug = createDebug('Social:middleware:files');

const optionsSets: {
  [key: string]: {
    width: number;
    height: number;
    fit: keyof sharp.FitEnum;
    position: string;
    quality: number;
  };
} = {
  register: {
    width: 300,
    height: 300,
    fit: 'cover',
    position: 'top',
    quality: 100,
  },
};

export class FilesMiddleware {
  constructor() {
    debug('Instantiated');
  }

  singleFileStore(fileName = 'image', maxSize = 8_000_000) {
    const multerConfig = {
      storage: multer.diskStorage({
        destination: 'uploads',
        filename(req, file, callback) {
          const suffix = crypto.randomUUID();
          const extension = path.extname(file.originalname);
          const basename = path.basename(file.originalname, extension);
          const filename = `${basename}-${suffix}${extension}`;
          debug('Called Multer');
          callback(null, filename);
        },
      }),
      limits: { fileSize: maxSize },
    };
    const upload = multer(multerConfig);
    const middleware = upload.single(fileName);
    // Save as req.file is the `fileName` file
    // req.body will hold the text fields, if there were any
    return middleware;
  }

  async optimization(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      const reqPath = req.path.split('/')[1];
      debug('Called for path: ' + reqPath);
      const options = optionsSets[reqPath];
      if (!req.file)
        throw new HTTPError(406, 'Not Acceptable', 'Not valid image file');

      const filename = req.file?.filename;
      const baseFileName = `${path.basename(filename, path.extname(filename))}`;
      const imageData = await sharp(path.join('uploads', filename))
        .resize(options.width, options.height, {
          fit: options.fit,
          position: options.position,
        })
        .webp({ quality: options.quality })
        .toFormat('webp')
        .toFile(path.join('uploads', `${baseFileName}.webp`));
      req.file.originalname = req.file.path;
      req.file.filename = `${baseFileName}.${imageData.format}`;
      req.file.mimetype = `image/${imageData.format}`;
      req.file.path = path.join('uploads', req.file.filename);
      req.file.size = imageData.size;
      next();
    } catch (error) {
      next(error);
    }
  }

  async saveImage(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Called saveImage');
      if (!req.file)
        throw new HTTPError(406, 'Not Acceptable', 'Not valid image file');
      const userImage = req.file.filename;
      const imagePath = path.join('uploads', userImage);
      const firebase = new FireBase();
      const fileBackup = await firebase.uploadFile(userImage);
      req.body[req.file.fieldname] = {
        urlOriginal: req.file.originalname,
        url: imagePath,
        urlOut: fileBackup,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
      next();
    } catch (error) {
      next(error);
    }
  }
}
