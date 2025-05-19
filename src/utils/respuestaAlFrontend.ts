import { Response } from 'express';
import { IRespuestaData } from '../interfaces_types/respuestaData.interface';

const RespuestaAlFrontend = (
  res: Response,
  statusCode: number,
  error: boolean,
  message: string | Array<string>,
  data: IRespuestaData
) => {
  res.status(statusCode).json({
    error,
    message,
    data,
  });
};
export default RespuestaAlFrontend;
