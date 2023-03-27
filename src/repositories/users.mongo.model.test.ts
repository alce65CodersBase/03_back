import mongoose, { Schema, Document } from 'mongoose';
import { UserModel } from './users.mongo.model';
import { dbConnect } from '../db/db.connect';
import { User } from '../entities/user';

describe('Given Users Mongoose Schema and Model', () => {
  const PWD = '12345';
  const mockUser: Partial<User> = {
    firstName: 'test',
    surname: 'test',
    email: 'sample@sample.com',
    passwd: PWD,
  };
  Schema.prototype.set = jest.fn();
  const spyModel = jest.spyOn(mongoose, 'model');
  describe('When Model is created', () => {
    beforeEach(async () => {
      await dbConnect();
      await UserModel.create(mockUser);
    });
    test('Then it should be used for obtain a Mongoose Document', async () => {
      expect(spyModel).not.toHaveBeenCalled();
      const [document] = await UserModel.find().exec();
      document.toJSON();
      expect(document).toBeInstanceOf(Document);
      expect(Schema.prototype.set).not.toHaveBeenCalled();
    });
    afterEach(async () => {
      UserModel.deleteMany();
      mongoose.disconnect();
    });
  });
});
