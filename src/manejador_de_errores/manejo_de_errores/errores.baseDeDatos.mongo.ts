import { Response } from 'express';
import { MongoError } from 'mongodb';
import mongoose, { MongooseError } from 'mongoose';
import logger from '../../logger';

export interface mon {
  [fieldName: string]: mongoose.Error.ValidatorError | mongoose.Error.CastError;
}

const ManejadorErroresMongoose = (error: MongooseError, errores: mon, res: Response) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const mensajes: { [key: string]: string } = {};
    Object.keys(errores).forEach((val: string, indice: number) => {
      logger.error({val, mensaje: errores[val].message, valor: errores[val].value}, ' error del campo');
      if (typeof val === 'string') {
        mensajes[`error${indice + 1} - ${errores[val].path}`] = errores[val].message;
      }
    });
    return res.status(404).json({ message: mensajes });
  } else if (error instanceof mongoose.Error) {
    logger.error(error.message, "Error mongoose")
    return res.status(500).json({ error: true, message: 'Error en el servidor' });
  } else if (error instanceof mongoose.Error.MongooseServerSelectionError) {
    logger.error(error.message, "Error MongooseServerSelectionError ")
    return res
      .status(500)
      .json({ error: true, message: 'Error en la conexión a la base de datos' });
  } else if (error instanceof MongoError) {
    logger.error(error.message, "Error MongoError")
    if (error.code === 11000) {
      return res.status(400).json({ error: true, message: `Error en Base de Datos` });
    }
    return res.status(500).json({ error: true, message: `Error en Base de Datos}` });
  } else if (error instanceof mongoose.Error.CastError) {
    logger.error(error.message, " Error CastError")
    return res.status(400).json({ error: true, message: 'Error de tipo' });
  } else if (error instanceof Error && error.name === 'DisconnectedError') {
    logger.error(error.message, "Error DisconnectedError")
    return res.status(500).json({ error: true, message: 'Perdida de conexión con el servidor' });
  } else if (error instanceof Error && error.name === 'TimeoutError') {
    logger.error(error.message, "Error TimeoutError")
    return res
      .status(500)
      .json({ error: true, message: 'Tiempo de espera agotado en la base de datos' });
  } else if (error instanceof Error && error.name === 'MongoServerError') {
    logger.error(error.message, "Error MongoServerError")
    return res
      .status(500)
      .json({ error: true, message: `Error en el Servidor de la base de datos` });
  } else {
    logger.error(error.message, "Error general mongodb")
    return res.status(500).json({ error: true, message: 'Error en el servidor' });
  }
};

export default ManejadorErroresMongoose;
