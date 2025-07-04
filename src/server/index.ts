import express, { Application } from 'express';
import { configuracionRutas } from '../routes';

// Se crea una instancia de Express y la guarda en app
const app: Application = express();

// Se pasa la instancia app a la función: configuracionRutas
configuracionRutas(app);

export default app;
