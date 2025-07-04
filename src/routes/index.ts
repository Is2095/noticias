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
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';


// Recibo server app y configuro las seguridades, límites, parámetros, manejadores de errores, entrada al backend, swagger
export const configuracionRutas = (app: Application): void => {

  // Se limita número de peticiones 50 cada 10 minutos
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request): string => req.ip || '',
    handler: (req, res, next) => {
      next(new ClienteError('Exceso de peticiones'))
    }

  });

  // Le dice a express que confíe en el primer proxy (para obtener la ip real del cliente)
  app.set('trust proxy', 1);
  // usa rateLimit
  app.use(limiter);
  // oculta el encabezado 'x-powered-by: express', sirve para no dar info de la tecnología usada en el backend
  app.disable('x-powered-by');
  // habilitar cors
  app.use(cors());
  // para el manejo de archivos json
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

  // Habilita documentación con swagger
  app.use('/doc', swaggerUI.serve, swaggerUI.setup(specs));

  app.use('/api/v1/news', routerNoticias);
  // Error si la ruta con coincide con las que están programadas
  app.use((_req, _res, next) => {
    next(new ClienteError("ruta no encontrada"))
  })
  // Manejo de errores.
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
