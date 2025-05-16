import express, { Application } from 'express';
import { configuracionRutas } from '../routes';

const app: Application = express();

configuracionRutas(app);

export default app;
