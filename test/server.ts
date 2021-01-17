import * as express from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import { renameSync } from 'fs';

export function createServer(port?: number): Promise<Server> {
  return new Promise(resolve => {
    const app = express();

    const uploader = multer({
      dest: './uploads',
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());

    app.get('/simple/get', (req, res) => {
      res.json({
        status: 'ok',
      });
    });

    app.get('/param/:param/get', ({ params }, res) => {
      res.json({
        status: 'ok',
        param: params.param,
      });
    });

    app.get('/query/get', ({ query }, res) => {
      res.json({
        status: 'ok',
        query,
      });
    });

    app.post('/simple/post', ({ body }, res) => {
      res.json({
        body,
      });
    });

    app.post('/upload/post', uploader.fields([
      { name: 'first' },
      { name: 'second' },
    ]), ({ body, files }, res) => {
      res.json({
        body,
        files,
      });
    });

    const server = app.listen(0, '127.0.0.1', () => {
      const address = server.address() as AddressInfo;
      console.log(`Mock server start at http://${address.address}:${address.port}`);
      resolve(server);
    });
  });
}

// createServer(9060);
