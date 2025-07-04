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
  // Validación de datos vacío y que la url sea la permitida
  if (datos.length === 0 || !env.urlNoticiasXML.includes(urlFuenteInfo)) {
    logger.error(datos.length === 0 ? 'No hay datos' : 'Url no existe');
    throw new ClienteError('Fallo en el enriquesimiento de datos', 404);
  }
  // Se agrega fecha de pedido de noticias, fuente(url), identificador único, palabras claves para la búsqueda
  const noticiasEnriquecidas = datos.map((item) => ({
    ...item,
    fechaYHoraIngestion: new Date(),
    fuente: urlFuenteInfo,
    identificadorUnico: uuidv4(),
    palabrasClaves: extraerPalabrasClaves(item.titulo, item.descripcionNoticia),
  }));

  return noticiasEnriquecidas;
};

// Extracción de palabras claves para la búsqueda por search
const extraerPalabrasClaves = (textoTitulo: string, textoDescripcion: string) => {
  // Divide el texto en palabras, separador  \s = (espacio, espacios, tabulación, salto de línea)
  const palabrasTitulo = textoTitulo.split(/\s+/);
  // Se sacan las tres primeras palabras y se convierten en minúsculas y se juntan en un solo string separandolas con un espacio.
  const primerasPalabrasTitulo = palabrasTitulo.slice(0, 3).join(' ').toLowerCase();
  // Guardo el resto del texto sin las tres primera palabras.
  const restoTitulo = palabrasTitulo.slice(3);
  // Se mapean todas las palabras y se saca los espacios vacíos al principio y al final, y se eliminan los . , ; ! ? que estuvieran al final de la palabra
  const restoTextoFiltrado = restoTitulo.map((p) => p.trim().replace(/[.,;!?]+$/, ''));

  // Se divide el texto de la descripción por el separador espacio \s = (espacio, espacios, tabulación, salto de línea)
  const palabrasDescripcion = textoDescripcion.split(/\s+/);
  // Se sacan las tres primeras palabras y se convierten en minúsculas y se juntan en un solo string separandolas con un espacio.
  const primerasPalabrasDescripcion = palabrasDescripcion.slice(0, 3).join(' ').toLowerCase();
  // Se guarda el resto del texto sin las tres primeras palabras.
  const restoDescripcion = palabrasDescripcion.slice(3);
  // Se mapean todas las palabras y se saca los espacios vacíos al principio y al final, y se eliminan los . , ; ! ? que estuvieran al final de la palabra
  const restoDescripcionFiltrado = restoDescripcion.map((p) => p.trim().replace(/[.,;!?]+$/, ''));

  // Filtrar y saca (en el título sin las tres primeras palabras) todas las palabras que empiecen con mayúsculas, tengan al menos 2 caracteres después de la mayúsculas y que estén compuestas por letras
  const palabrasMayusTituloConMayusculas = restoTextoFiltrado.filter((palabra) =>
    /^[A-Z][a-zA-Z]{2,}$/.test(palabra)
  );
  // Convierto las palabras filtradas en minúsculas
  const palabrasMayusTitulo = palabrasMayusTituloConMayusculas.map((p) => p.toLowerCase());

  // Filtrar y saca (en la descripción sin las tres primeras palabras) todas las palabras que empiecen con mayúsculas, tengan al menos 2 caracteres después de la mayúsculas y que estén compuestas por letras
  const palabrasMayusDescripcionConMayusculas = restoDescripcionFiltrado.filter((palabra) =>
    /^[A-Z][a-zA-Z]{2,}$/.test(palabra)
  );
  // Convierto las palabras filtradas en minúsculas
  const palabrasMayusDescripcion = palabrasMayusDescripcionConMayusculas.map((p) =>
    p.toLowerCase()
  );

  // Guardo en un objeto las 3 primeras palabras y el resto de las palabras con la primera letra en mayúsculas tanto del título como de la descripción
  const palabrasClaves = {
    titulo: [primerasPalabrasTitulo, ...palabrasMayusTitulo],
    descripcion: [primerasPalabrasDescripcion, ...palabrasMayusDescripcion],
  };

  return palabrasClaves;
};

export default enriquecerDatos;
