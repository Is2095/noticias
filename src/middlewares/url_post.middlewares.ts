import { NextFunction, Request, Response } from 'express';
// import env from '../config/manejo_VE';
// import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';

const validarUrlXML = (req: Request, _res: Response, next: NextFunction) => {
  // const { url } = req.body;
  // if (typeof url !== 'string' || !env.urlNoticiasXML.includes(url)) {
  //   throw new ClienteError('Url no reconocida mi', 404);
  // }
  next();
};

export default validarUrlXML;
