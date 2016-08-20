import config from '../config';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';

export function createHttpServer() {
  const app = express();

  app.use(express.static(config.publicDir));

  return app.listen(config.api.port, function () {
    console.log('HTTP server is running on ' + config.api.port);
  });
}