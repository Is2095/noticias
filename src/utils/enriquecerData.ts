import { v4 as uuidv4 } from 'uuid';
import { IDatosNormalizados } from '../interfaces_types/datosNormalizados.interface';
import { IDatosEnriquecidos } from '../interfaces_types/noticiasEnriquecidas.interface';

const enriquecerDatos = (
  datos: IDatosNormalizados[],
  urlFuenteInfo: string
): IDatosEnriquecidos[] => {
  const noticiasEnriquecidas = datos.map((item) => ({
    ...item,
    fechaYHoraIngestion: new Date().toLocaleString(),
    fuente: urlFuenteInfo,
    identificadorUnico: uuidv4(),
    palabrasClaves: extraerPalabrasClaves(item.titulo, item.descripcionNoticia),
  }));
  return noticiasEnriquecidas;
};

const extraerPalabrasClaves = (textoTitulo: string, textoDescripcion: string) => {
  const palabrasTitulo = textoTitulo.split(' ');
  const primerasPalabrasTitulo = palabrasTitulo.slice(0, 3).join(' ').toLowerCase();
  const restoTitulo = palabrasTitulo.slice(3);
  const restoTextoFiltrado = restoTitulo.map((p) => p.trim().replace(/[.,;!?]+$/, ''));

  const palabrasDescripcion = textoDescripcion.split(' ');
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
