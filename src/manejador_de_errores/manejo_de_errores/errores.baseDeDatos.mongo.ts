import { Response } from 'express';
import { MongoError } from 'mongodb';
import mongoose, { MongooseError } from 'mongoose';
export interface mon {
  [fieldName: string]: mongoose.Error.ValidatorError | mongoose.Error.CastError;
  // [fieldName: string]: MongooseError |;
}

const ManejadorErroresMongoose = (error: MongooseError, errores: mon, res: Response) => {
  console.error('Errores: ');
  console.error('Nombre: ', error.name);
  console.error('Mensaje: ', error.message);
  console.error('Stack: ', error.stack);
  if (error instanceof mongoose.Error.ValidationError) {
    const mensajes: { [key: string]: string } = {};
    Object.keys(errores).forEach((val: string, indice: number) => {
      // console.log(val, "valor dentro del manejador de errores");

      if (typeof val === 'string') {
        mensajes[`error${indice + 1} - ${errores[val].path}`] = errores[val].message;
      }
    });
    return res.status(404).json({ message: mensajes });
  } else if (error instanceof mongoose.Error) {
    return res.status(500).json({ error: true, message: 'Error en el servidor' });
  } else if (error instanceof mongoose.Error.MongooseServerSelectionError) {
    return res
      .status(500)
      .json({ error: true, message: 'Error en la conexión a la base de datos' });
  } else if (error instanceof MongoError) {
    if (error.code === 11000) {
      return res.status(400).json({ error: true, message: `Error en Base de Datos}` });
    }
    return res.status(500).json({ error: true, message: `Error en Base de Datos}` });
  } else if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: true, message: 'Error de tipo' });
  } else if (error instanceof Error && error.name === 'DisconnectedError') {
    return res.status(500).json({ error: true, message: 'Perdida de conexión con el servidor' });
  } else if (error instanceof Error && error.name === 'TimeoutError') {
    return res
      .status(500)
      .json({ error: true, message: 'Tiempo de espera agotado en la base de datos' });
  } else if (error instanceof Error && error.name === 'MongoServerError') {
    return res
      .status(500)
      .json({ error: true, message: `Error en el Servidor de la base de datos` });
  } else {
    return res.status(500).json({ error: true, message: 'Error en el servidor' });
  }
};

export default ManejadorErroresMongoose;
