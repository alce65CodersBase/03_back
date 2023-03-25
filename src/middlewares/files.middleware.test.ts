import { Request, Response } from 'express';
import { FilesMiddleware } from './files.middleware';
import { HTTPError } from '../errors/errors';
import multer from 'multer';

type MockMulter = jest.Mock & { diskStorage: jest.Mock };

jest.mock('multer', () => {
  const multer: MockMulter = jest.fn().mockImplementation(() => ({
    single: jest.fn(),
  })) as MockMulter;

  multer.diskStorage = jest
    .fn()
    .mockImplementation(
      (options: {
        destination: '';
        filename: (req: object, file: object, cb: () => void) => void;
      }) => {
        options.filename({}, { originalname: '' }, () => null);
      }
    );
  return multer;
});

describe('Given FilesMiddleware', () => {
  describe('When method singleFileStore is used', () => {
    test('Then it should ...', () => {
      const filesMiddleware = new FilesMiddleware();
      filesMiddleware.singleFileStore();
      expect(multer).toHaveBeenCalled();
      expect(multer.diskStorage).toHaveBeenCalled();
    });
  });

  describe('When method saveImage is used with valid data', () => {
    const req = {
      body: {},
      file: { filename: 'test' },
    } as Request;
    const resp = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    test('Then it should call next without parameters', () => {
      const filesMiddleware = new FilesMiddleware();
      filesMiddleware.saveImage(req, resp, next);
      expect(next).toHaveBeenLastCalledWith();
    });
  });

  describe('When method saveImage is used with NOT valid data', () => {
    const req = {} as Request;
    const resp = {} as unknown as Response;
    const next = jest.fn();

    test('Then it should  call next with the error', () => {
      const filesMiddleware = new FilesMiddleware();
      filesMiddleware.saveImage(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
  });
});
