import { CoursesMongoRepo } from './courses.mongo.repo';
import { CourseModel } from './courses.mongo.model';

jest.mock('./courses.mongo.model');

describe('Given CoursesMongoRepo', () => {
  // Arrange
  const repo = CoursesMongoRepo.getInstance();
  const exec = jest.fn();

  test('Then it could be instantiated', () => {
    expect(repo).toBeInstanceOf(CoursesMongoRepo);
  });

  describe('When I use query', () => {
    beforeEach(() => {
      exec.mockResolvedValue([]);
      CourseModel.find = jest.fn().mockReturnValue({
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

  describe('When I use queryID', () => {
    beforeEach(() => {
      exec.mockResolvedValue({ id: '1' });
      CourseModel.findById = jest.fn().mockReturnValue({
        exec,
      });
    });
    test('Then it should return an object if it has a valid id', async () => {
      const id = '1';
      const result = await repo.queryId(id);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
    test('Then it should throw an error if it has a NO valid id', () => {
      exec.mockResolvedValue(null);
      const id = '2';
      expect(async () => repo.queryId(id)).rejects.toThrow();
    });
  });

  describe('When I use search', () => {
    beforeEach(() => {
      exec.mockResolvedValue([{ id: '1' }]);
      CourseModel.find = jest.fn().mockReturnValue({
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
      CourseModel.create = jest.fn().mockReturnValue({
        id: '1',
      });
    });
    test('Then it should return an object with the created item', async () => {
      const id = '1';
      const result = await repo.create({ id });
      expect(CourseModel.create).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When I use update', () => {
    beforeEach(() => {
      exec.mockResolvedValue({ id: '2' });
      CourseModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
    });
    test('Then it should return an object with the updated item if it has a valid id', async () => {
      const id = '1';
      const result = await repo.update({ id });
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual({ id: '2' });
    });
    test('Then it should throw an error if it has a NO valid id', () => {
      exec.mockResolvedValue(null);
      const id = '2';
      expect(async () => repo.update({ id })).rejects.toThrow();
    });
  });

  describe('When I use destroy', () => {
    beforeEach(() => {
      CourseModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });
    });

    test('Then it should return void if it has a valid id', async () => {
      exec.mockResolvedValue({ id: 1 });
      const id = '1';
      await repo.destroy(id);
      expect(CourseModel.findByIdAndDelete).toHaveBeenCalled();
    });
    test('Then it should throw an error if it has a NO valid id', () => {
      exec.mockReturnValue(null);
      const id = '2';
      expect(async () => repo.destroy(id)).rejects.toThrow();
    });
  });

  describe('When I use destroyAll', () => {
    beforeEach(() => {
      CourseModel.deleteMany = jest.fn().mockReturnValue({
        exec,
      });
    });

    test('Then it should return void after it has delete all data', async () => {
      exec.mockResolvedValue({});
      await repo.destroyAll();
      expect(CourseModel.deleteMany).toHaveBeenCalled();
    });
  });
});
