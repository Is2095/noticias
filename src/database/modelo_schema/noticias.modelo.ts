import { model } from 'mongoose';
import { IDatosEnriquecidos } from '../../interfaces_types/noticiasEnriquecidas.interface';
import NoticiasSchema from './noticias.schema';

const NoticiasModel = model<IDatosEnriquecidos>('Noticias', NoticiasSchema);
export default NoticiasModel;
