import mongoose, { Schema, Document } from 'mongoose';
import { UserModel } from './users.mongo.model';
import { dbConnect } from '../db/db.connect';

describe('Given Users Mongoose Schema and Model', () => {
  Schema.prototype.set = jest.fn();
  const spyModel = jest.spyOn(mongoose, 'model');
  describe('When Model is created', () => {
    test('Then it should be used for obtain a Mongoose Document', async () => {
      await dbConnect('dev');
      expect(spyModel).not.toHaveBeenCalled();
      const [document] = await UserModel.find().exec();
      document.toJSON();
      expect(document).toBeInstanceOf(Document);
      expect(Schema.prototype.set).not.toHaveBeenCalled();
      mongoose.disconnect();
    });
  });
});
