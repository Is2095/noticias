
export interface IDatosNormalizados {
  tituloPais: string;
  titulo: string;
  enlaceNoticia: string;
  descripcionNoticia: string;
  fechaPublicacion: string;
  imagen: Array<string | undefined>;
  seccionOCategoria: Array<string>;
}
