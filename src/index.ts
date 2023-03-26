import http from 'http';
import { App } from './app/app.js';
import { dbConnect } from './db/db.connect.js';
import createDebug from 'debug';
import { HomeController } from './controllers/home.controller.js';
const debug = createDebug('Social');

const PORT = process.env.PORT || 4500;
const homeController = new HomeController('');
const { app } = new App(homeController);
const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));

server.on('error', (error) => {
  debug('Server error:', error.message);
});

server.on('listening', () => {
  const addr = server.address();
  if (addr === null) return;
  let bind: string;
  if (typeof addr === 'string') {
    bind = 'pipe ' + addr;
  } else {
    bind =
      addr.address === '::'
        ? `http://localhost:${addr?.port}`
        : `port ${addr?.port}`;
  }

  homeController.urlBase = bind;
  debug(`Listening on ${bind}`);
});
