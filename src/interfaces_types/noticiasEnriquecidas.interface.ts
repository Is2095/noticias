import { IDatosNormalizados } from './datosNormalizados.interface';

type palabrasClaves = {
  titulo: Array<string>;
  descripcion: Array<string>;
};

export interface IDatosEnriquecidos extends IDatosNormalizados {
  fechaYHoraIngestion: string;
  fuente: string;
  identificadorUnico: string;
  palabrasClaves: palabrasClaves;
}
