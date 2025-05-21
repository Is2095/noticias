import { Response } from 'express';
import { MongooseError } from 'mongoose';

export interface mon {
  [fieldName: string]: MongooseError;
};

const ManejadorErroresMongoose = (error: MongooseError, errores: mon, res: Response) => {
  if (error.name === 'ValidationError') {
    const mensajes: { [key: string]: string } = {};
    Object.keys(errores).forEach((val: string, indice: number) => {
      if (typeof val === 'string') {
        mensajes[`error${indice + 1}`] = errores[val].message;
      }
    });
    return res.status(404).json({ message: mensajes });
  } else if (error.name === 'MongooseError') {
    return res.status(500).json({ error: true, message: 'Error en el servidor' });
  } else if (error.name === 'MongooseServerSelectionError') {
    return res.status(500).json({ error: true, message: 'Error en la conexión al servidor' });
  } else if (error.name === 'DisconnectedError') {
    return res.status(500).json({ error: true, message: 'Perdida de conexión con el servidor' });
  } else if (error.name === 'TimeoutError') {
    return res.status(500).json({ error: true, message: 'Tiempo execibo en la petición al servidor' })
  } else if (error.name === 'CastError') {
    return res.status(400).json({ error: true, message: 'Error de tipo', e: error.message})
  } else if (error.name === 'MongoServerError') {
    return res.status(500).json({ error: true, message: `Error en el Servidor: ${error.message}`})
  } else {
     return res.status(500).json({ error: true, message: 'Error en el servidor' })
  }
};

export default ManejadorErroresMongoose;
