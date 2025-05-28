import { v4 as uuidv4 } from 'uuid';
import env from '../config/manejo_VE';
import { IDatosNormalizados } from '../interfaces_types/datosNormalizados.interface';
import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';
import logger from '../logger';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';

const enriquecerDatos = (
  datos: IDatosNormalizados[],
  urlFuenteInfo: string
): IDatosEnriquecidos[] => {
  if (datos.length === 0 || !env.urlNoticiasXML.includes(urlFuenteInfo)) {
    logger.error(datos.length === 0 ? 'No hay datos' : 'Url no existe');
    throw new ClienteError('Fallo en el enriquesimiento de datos', 404);
  }
  const noticiasEnriquecidas = datos.map((item) => ({
    ...item,
    fechaYHoraIngestion: new Date(),
    fuente: urlFuenteInfo,
    identificadorUnico: uuidv4(),
    palabrasClaves: extraerPalabrasClaves(item.titulo, item.descripcionNoticia),
  }));

  return noticiasEnriquecidas;
};

const extraerPalabrasClaves = (textoTitulo: string, textoDescripcion: string) => {
  const palabrasTitulo = textoTitulo.split(/\s+/);
  const primerasPalabrasTitulo = palabrasTitulo.slice(0, 3).join(' ').toLowerCase();
  const restoTitulo = palabrasTitulo.slice(3);
  const restoTextoFiltrado = restoTitulo.map((p) => p.trim().replace(/[.,;!?]+$/, ''));

  const palabrasDescripcion = textoDescripcion.split(/\s+/);
  const primerasPalabrasDescripcion = palabrasDescripcion.slice(0, 3).join(' ').toLowerCase();
  const restoDescripcion = palabrasDescripcion.slice(3);
  const restoDescripcionFiltrado = restoDescripcion.map((p) => p.trim().replace(/[.,;!?]+$/, ''));

  const palabrasMayusTituloConMayusculas = restoTextoFiltrado.filter((palabra) =>
    /^[A-Z][a-zA-Z]{2,}$/.test(palabra)
  );
  const palabrasMayusTitulo = palabrasMayusTituloConMayusculas.map((p) => p.toLowerCase());

  const palabrasMayusDescripcionConMayusculas = restoDescripcionFiltrado.filter((palabra) =>
    /^[A-Z][a-zA-Z]{2,}$/.test(palabra)
  );
  const palabrasMayusDescripcion = palabrasMayusDescripcionConMayusculas.map((p) =>
    p.toLowerCase()
  );

  const palabrasClaves = {
    titulo: [primerasPalabrasTitulo, ...palabrasMayusTitulo],
    descripcion: [primerasPalabrasDescripcion, ...palabrasMayusDescripcion],
  };

  return palabrasClaves;
};

export default enriquecerDatos;
