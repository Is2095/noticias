import { Document, Schema } from 'mongoose';
import env from '../../config/manejo_VE';

interface PalabrasClaves {
  titulo: string[];
  descripcion: string[];
  imagen: string[];
  seccionOCategoria: string[];
}
interface NoticiasDoc extends Document {
  tituloPais: string;
  titulo: string;
  enlaceNoticia: string;
  descripcionNoticia: string;
  fechaPublicacion: Date;
  imagen: string[];
  seccionOCategoria: string[];
  fechaYHoraIngestion: Date;
  fuente: string;
  identificadorUnico: string;
  palabrasClaves: PalabrasClaves;
}

const PalabrasClavesSchema = new Schema(
  {
    titulo: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]): boolean => {
          if (!Array.isArray(arr) || arr.length === 0) return false;
          const primera = arr[0];
          const cantPalabras = primera.trim().split(/\s+/);
          return cantPalabras.length === 3;
        },
        message: 'Error en el formato de palabras claves PCS-T',
      },
    },
    descripcion: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: Array<string>) =>
          Array.isArray(arr) &&
          arr.every((str) => typeof str === 'string' && str.trim().length > 2),
        message: 'Error en el formato de palabras claves PCS-D',
      },
    },
  },
  { _id: false }
);

const NoticiasSchema: Schema = new Schema<NoticiasDoc>(
  {
    tituloPais: {
      type: String,
      required: [true, 'Este elemento es necesario TP'],
      trim: true,
      minlength: [35, 'Error en el número de caracteres TP.MI'],
      maxlength: [65, 'Error en el número de caracteres TP.MA'],
    },
    titulo: {
      type: String,
      required: [true, 'Este elemento es necesario T'],
      trim: true,
      minlength: [10, 'Error en el número de caracteres T.MI'],
      maxlength: [200, 'Error en el número de caracteres T.MA'],
    },
    enlaceNoticia: {
      type: String,
      required: [true, 'Este elemento es necesario EN'],
      trim: true,
      minlength: [30, 'Error en el número de caracteres EN.MI'],
      maxlength: [300, 'Error en el número de caracteres EN.MA'],
    },
    descripcionNoticia: {
      type: String,
      required: [true, 'Este elemento es necesario DN'],
      trim: true,
      minlength: [30, 'Error en el número de caracteres DN.MI'],
      maxlength: [400, 'Error en el número de caracteres DN.MA'],
    },
    fechaPublicacion: {
      type: Date,
      required: [true, 'Este elemento es necesario FP'],
      validate: {
      validator: function (value) {
        // Asegura que la fecha no sea en el futuro
        return value <= new Date();
      },
      message: 'La fecha de publicación no es válida.'
    }
    },
    imagen: {
      type: [String],
      required: false,
      validate: function (arr: Array<string>) {
        const elPaisImageRegex =
          /^(?!.*[,";<>*$])https:\/\/(imagenes|images)(\.[a-z]+)*\.elpais\.com\/resizer\/.+/;
        return arr.every((url: string) => elPaisImageRegex.test(url));
      },
      message: 'Imagen no válida I',
      default: [],
    },
    seccionOCategoria: {
      type: [String],
      required: [true, 'Este elemento es necesario SOC'],
      validate: {
        validator: function (arr: Array<string>) {
          for (const cat of arr) {
            const isValid =
              typeof cat === 'string' && cat.trim().length > 1 && cat.trim().length < 60;
            if (!isValid) {
              console.error('sección inválida: ', cat);
              return false;
            }
          }
          return true;
          // return arr.every(
          //   (cat: string) =>
          //     typeof cat === 'string' && cat.trim().length > 3 && cat.trim().length < 30
          // );
        },
        message: 'Categoría o sección inválida SOC',
      },
    },
    fechaYHoraIngestion: {
      type: Date,
      required: [true, 'Este elemento es necesario FYHI'],
      default: () => new Date(),
    },
    fuente: {
      type: String,
      required: [true, 'Este elemento es necesario Fue'],
      minlength: [50, 'Error en el formato de la fuente Fue-MI'],
      maxlength: [85, 'Error en el formato de la fuente Fue-MA'],
      enum: {
        values: env.urlNoticiasXML,
        message: 'Url no reconocida',
      },
    },
    identificadorUnico: {
      type: String,
      required: [true, 'Este elemento es necesario IU'],
      minlength: [36, 'Error en el formato del identificador IU-MI'],
      maxlength: [36, 'Error en el formato del identificador IU-MA'],
    },
    palabrasClaves: {
      type: PalabrasClavesSchema,
      required: [true, 'Este elemento es necesario PC'],
    },
  },
  {
    timestamps: true,
  }
);

NoticiasSchema.index(
  { tituloPais: 1, titulo: 1, enlaceNoticia: 1, fechaPublicacion: 1 },
  { unique: true }
);

NoticiasSchema.pre('save', function (next) {
  if (this.palabrasClaves) {
    const claves = this.palabrasClaves as PalabrasClaves;
    if (Array.isArray(claves.titulo)) {
      claves.titulo = claves.titulo.map((str: string) => str.trim().toLowerCase());
    }
    if (Array.isArray(claves.descripcion)) {
      claves.descripcion = claves.descripcion.map((str: string) => str.trim().toLowerCase());
    }
    if (Array.isArray(this.imagen)) {
      this.imagen = this.imagen.map((str: string) => str.trim().toLowerCase());
    }
    if (Array.isArray(this.seccionOCategoria)) {
      this.seccionOCategoria = this.seccionOCategoria.map((str: string) =>
        str.trim().toLowerCase()
      );
    }
  }
  next();
});

export default NoticiasSchema;
