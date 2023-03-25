import { Request, Response } from 'express';
import { User } from '../entities/user';
import { Repo } from '../repositories/repo.interface';
import { UsersController } from './users.controller';
import { Auth } from '../services/auth.js';
import { RequestPlus } from '../interfaces/request';
import { PayloadToken } from '../interfaces/token';

jest.mock('../services/auth.js');
const mockPasswd = 'test';

const mockRepo = {
  create: jest.fn(),
  search: jest.fn(),
  queryId: jest.fn(),
  update: jest.fn(),
  destroyAll: jest.fn(),
} as unknown as Repo<User>;

const resp = {
  status: jest.fn(),
  json: jest.fn(),
} as unknown as Response;
const next = jest.fn();

describe('Given register method from UsersController', () => {
  const controller = new UsersController(mockRepo);
  describe('When there are NOT password in th body', () => {
    const req = {
      body: {
        email: 'test',
      },
    } as Request;
    test('Then next should been called', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When there are NOT email in th body', () => {
    const req = {
      body: {
        passwd: mockPasswd,
      },
    } as Request;
    test('Then next should been called', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When there are NOT email and NOT passwd in th body', () => {
    const req = {
      body: {},
    } as Request;
    test('Then next should been called', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When all is OK ', () => {
    const req = {
      body: {
        email: 'test',
        passwd: mockPasswd,
      },
    } as Request;
    test('Then json should been called', async () => {
      await controller.register(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
  });
});

describe('Given login method from UsersController', () => {
  const controller = new UsersController(mockRepo);

  const req = {
    body: {
      email: '',
      passwd: '',
    },
  } as Request;

  Auth.compare = jest.fn().mockResolvedValue(true);

  describe('When there are not email in the incoming data', () => {
    test('Then next should be called', async () => {
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the  email is NOT from a register user', () => {
    test('Then next should be called', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValue([]);
      req.body = {
        email: 'test',
        passwd: mockPasswd,
      };
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the  password is NOT valid for the user', () => {
    test('Then next should be called', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
      req.body = {
        email: 'test',
        passwd: mockPasswd,
      };
      Auth.compare = jest.fn().mockResolvedValue(false);
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When ALL is OK', () => {
    test('Then json should be called', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
      req.body = {
        email: 'test',
        passwd: mockPasswd,
      };
      Auth.compare = jest.fn().mockResolvedValue(true);
      await controller.login(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
  });
});

describe('Given reLogin method from UsersController', () => {
  const controller = new UsersController(mockRepo);

  const req = {
    body: {
      email: '',
      passwd: '',
    },
  } as RequestPlus;

  describe('When there are not token with date', () => {
    test('Then next should be called', async () => {
      delete req.info;
      await controller.reLogin(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When ALL is OK', () => {
    test('Then json should be called', async () => {
      req.info = {
        id: '1',
      } as unknown as PayloadToken;

      await controller.reLogin(req, resp, next);
      expect(mockRepo.queryId).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });
});

describe('Given changeRole method from UsersController', () => {
  (mockRepo.queryId as jest.Mock).mockResolvedValue({});
  const controller = new UsersController(mockRepo);

  const req = {
    params: {},
  } as Request;

  describe('When there are NOT errors', () => {
    test('Then it should send json data', async () => {
      req.params.id = '1';
      req.params.role = 'any';

      await controller.changeRole(req, resp, next);
      expect(mockRepo.queryId).toHaveBeenCalled();
      expect(mockRepo.update).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });
  describe('When there are errors', () => {
    test('Then it should call next() if there are NOT id in the params', async () => {
      req.params.role = 'any';
      delete req.params.id;
      await controller.changeRole(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then it should call next() if there are NOT role in the params', async () => {
      req.params.id = '1';
      delete req.params.role;
      (mockRepo.update as jest.Mock).mockRejectedValue(new Error());
      await controller.changeRole(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then it should call next() if there area repo error', async () => {
      (mockRepo.update as jest.Mock).mockRejectedValue(new Error());
      await controller.changeRole(req, resp, next);
      expect(mockRepo.update).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});

describe('Given deleteAll method from UsersController', () => {
  (mockRepo.destroyAll as jest.Mock).mockResolvedValue({});
  const controller = new UsersController(mockRepo);

  const req = {
    body: {
      email: '',
      passwd: '',
    },
  } as Request;

  describe('When there are NOT errors', () => {
    test('Then it should send json with an empty array', async () => {
      await controller.deleteAll(req, resp, next);
      expect(mockRepo.destroyAll).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When there are any error', () => {
    test('Then it call next() with the error', async () => {
      (mockRepo.destroyAll as jest.Mock).mockRejectedValue(new Error());
      await controller.deleteAll(req, resp, next);
      expect(mockRepo.destroyAll).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
