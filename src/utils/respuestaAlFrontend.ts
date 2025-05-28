import { Response } from 'express';
import { IRespuestaData } from '../interfaces_types/respuestaData.interface';

const RespuestaAlFrontend = (
  res: Response,
  statusCode: number,
  error: boolean,
  message: string | Array<string>,
  noticias: IRespuestaData | null
) => {
  res.status(statusCode).json({
    error,
    message,
    noticias,
  });
};
export default RespuestaAlFrontend;
