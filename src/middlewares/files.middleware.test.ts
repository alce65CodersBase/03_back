import { Request, Response } from 'express';
import { FilesMiddleware } from './files.middleware';
import { HTTPError } from '../errors/errors';
import multer from 'multer';
import { FireBase } from '../services/firebase';
import sharp from 'sharp';

type MockMulter = jest.Mock & { diskStorage: jest.Mock };
type MockSharp = jest.Mock & { [key: string]: jest.Mock };

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

jest.mock('sharp', () => {
  const sharp: MockSharp = jest.fn() as MockSharp;
  sharp.mockReturnValue(sharp);
  sharp.resize = jest.fn().mockReturnValue(sharp);
  sharp.webp = jest.fn().mockReturnValue(sharp);
  sharp.toFormat = jest.fn().mockReturnValue(sharp);
  sharp.toFile = jest.fn().mockReturnValue(sharp);
  return sharp;
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

  describe('When method optimization is used with the data of a file', () => {
    const req = {
      path: '/register',
      body: {},
      file: { filename: 'test' },
    } as Request;
    const resp = {} as unknown as Response;
    const next = jest.fn();

    test('should be call sharp and next without parameters', async () => {
      const filesMiddleware = new FilesMiddleware();
      await filesMiddleware.optimization(req, resp, next);

      expect(sharp).toHaveBeenCalled();
      expect(next).toHaveBeenLastCalledWith();
    });
  });

  describe('When method optimization is used without data of a file', () => {
    const req = {
      path: '/register',
    } as Request;
    const resp = {} as unknown as Response;
    const next = jest.fn();
    test('Then it should call next with the error', async () => {
      const filesMiddleware = new FilesMiddleware();
      filesMiddleware.optimization(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
  });

  describe('When method saveImage is used with valid data', () => {
    const req = {
      body: {},
      file: { filename: 'test' },
    } as Request;
    const resp = {} as unknown as Response;
    const next = jest.fn();

    test('Then it should call next without parameters', async () => {
      FireBase.prototype.uploadFile = jest.fn();
      const filesMiddleware = new FilesMiddleware();
      await filesMiddleware.saveImage(req, resp, next);
      expect(FireBase.prototype.uploadFile).toHaveBeenCalled();
      expect(next).toHaveBeenLastCalledWith();
    });
  });

  describe('When method saveImage is used with NOT valid data', () => {
    const req = {} as Request;
    const resp = {} as unknown as Response;
    const next = jest.fn();

    test('Then it should call next with the error', () => {
      const filesMiddleware = new FilesMiddleware();
      filesMiddleware.saveImage(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
  });
});
