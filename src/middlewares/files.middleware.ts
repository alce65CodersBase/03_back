import { NextFunction, Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors.js';
const debug = createDebug('Social:middleware:files');

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

  saveImage(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Called saveImage');
      const userImage = req.file?.filename;
      if (!userImage)
        throw new HTTPError(406, 'Not Acceptable', 'Not valid image file');
      const imagePath = path.join('uploads', userImage);
      req.body.image = imagePath;
      next();
    } catch (error) {
      next(error);
    }
  }
}
