import { UsersMongoRepo } from './users.mongo.repo';
import { UserModel } from './users.mongo.model';

jest.mock('./users.mongo.model');

describe('Given UsersMongoRepo', () => {
  // Arrange
  const repo = UsersMongoRepo.getInstance();
  const exec = jest.fn();

  test('Then it could be instantiated', () => {
    expect(repo).toBeInstanceOf(UsersMongoRepo);
  });

  describe('When I use query', () => {
    beforeEach(() => {
      exec.mockResolvedValue([]);
      UserModel.find = jest.fn().mockReturnValue({
        exec,
      });
    });
    test('Then should return the data', async () => {
      // Act
      const result = await repo.query();
      // Assert
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When I use queryID in Users repo', () => {
    beforeEach(() => {
      exec.mockResolvedValue({ id: '21' });
      UserModel.findById = jest.fn().mockReturnValue({
        exec,
      });
    });
    test('Then it should return an User if it has a valid id', async () => {
      const id = '21';
      const user = await repo.queryId(id);
      expect(exec).toHaveBeenCalled();
      expect(user).toEqual({ id: '21' });
    });
    test('Then it should throw an error if it has a NO valid id', () => {
      exec.mockResolvedValue(null);
      const id = '22';
      expect(async () => repo.queryId(id)).rejects.toThrow();
    });
  });

  describe('When I use search in Users repo', () => {
    beforeEach(() => {
      exec.mockResolvedValue([{ id: '1' }]);
      UserModel.find = jest.fn().mockReturnValue({
        exec,
      });
    });
    test('Then it should return an array empty or with the results', async () => {
      const id = '1';
      const result = await repo.search({ id });
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('When I use create', () => {
    beforeEach(() => {
      UserModel.create = jest.fn().mockReturnValue({
        id: '1',
      });
    });
    test('Then it should return an object with the created item', async () => {
      const id = '1';
      const result = await repo.create({ id });
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When I use update', () => {
    beforeEach(() => {
      exec.mockResolvedValue({ id: '20' });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
    });
    test('Then it should return an user with the updated item if it has a valid id', async () => {
      const id = '10';
      const user = await repo.update({ id });
      expect(exec).toHaveBeenCalled();
      expect(user).toEqual({ id: '20' });
    });
    test('Then it should throw an error if it has a NO valid id', () => {
      exec.mockResolvedValue(null);
      const id = '20';
      expect(async () => repo.update({ id })).rejects.toThrow();
    });
  });

  describe('When I use destroy', () => {
    beforeEach(() => {
      UserModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });
    });

    test('Then it should return void if it has a valid id', async () => {
      exec.mockResolvedValue({ id: 1 });
      const id = '1';
      await repo.destroy(id);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
    test('Then it should throw an error if it has a NO valid id', () => {
      exec.mockReturnValue(null);
      const id = '2';
      expect(async () => repo.destroy(id)).rejects.toThrow();
    });
  });

  describe('When I use destroyAll', () => {
    beforeEach(() => {
      UserModel.deleteMany = jest.fn().mockReturnValue({
        exec,
      });
    });

    test('Then it should return void after it has delete all data', async () => {
      exec.mockResolvedValue({});
      await repo.destroyAll();
      expect(UserModel.deleteMany).toHaveBeenCalled();
    });
  });
});
