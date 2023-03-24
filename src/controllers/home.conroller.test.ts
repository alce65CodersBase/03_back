import { HomeController } from './home.controller';
import { Response, Request } from 'express';

const req = {} as unknown as Request;
const resp = {
  json: jest.fn(),
} as unknown as Response;

describe('Given HomeController', () => {
  describe('When it is instantiated', () => {
    test('Then it should send data as JSON', () => {
      const homeController = new HomeController('');
      homeController.homeInfo(req, resp);
      expect(resp.json).toHaveBeenCalled();
    });
  });
});
