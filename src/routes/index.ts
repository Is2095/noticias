import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';

export const configuracionRutas = (app: Application): void => {
  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.header('X-Total-Count', '1000');

    next();
  });

  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'funciona' });
  });
};
