import { App } from './app';
import express from 'express';
import { HomeController } from './controllers/home.controller';

jest.mock('./helpers/files.js', () => ({
  dirNameGet: () => '__dirname result',
}));

const homeController: HomeController = {
  homeInfo: jest.fn(),
  urlBase: '',
};

describe('Given App class', () => {
  describe('When it is instantiated', () => {
    const { app } = new App(homeController);
    test('Then it should be a Express instance', () => {
      expect(typeof app).toBe('function');
      expect(app).toHaveProperty('use');
    });
  });
});
