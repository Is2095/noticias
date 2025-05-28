import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { MongoError } from 'mongodb';
import mongoose, { MongooseError } from 'mongoose';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import { ErrorClienteError } from '../interfaces_types/errorClienteError.type';
import ManejadorErroresMongoose from '../manejador_de_errores/manejo_de_errores/errores.baseDeDatos.mongo';
import specs from '../swagger/swagger';
import RespuestaAlFrontend from '../utils/respuestaAlFrontend';
import routerNoticias from './noticias.routes';

export const configuracionRutas = (app: Application): void => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
      error: true,
      message: 'Exceso de peticiones',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request): string => req.ip || '',
  });

  app.set('trust proxy', true);
  app.use(limiter);
  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use((req, res, next) => {
    console.log('Petición permitida desde IP:', req.ip);
    next();
  });

  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.header('X-Total-Count', '1000');

    next();
  });

  app.use('/doc', swaggerUI.serve, swaggerUI.setup(specs));

  app.use('/', routerNoticias);
  app.use(
    (
      err: ErrorClienteError | MongoError | MongooseError,
      _req: Request,
      res: Response,
      _next: NextFunction
    ) => {
      if (err instanceof mongoose.Error.ValidationError) {
        ManejadorErroresMongoose(err, err.errors, res);
      }
      if (err instanceof MongooseError || err instanceof MongoError) {
        ManejadorErroresMongoose(err, {}, res);
      } else {
        const statusCode = err.statusCode != null ? err.statusCode : 500;
        RespuestaAlFrontend(res, statusCode, true, err.message, null);
      }
    }
  );
};
