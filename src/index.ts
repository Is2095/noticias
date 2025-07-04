import env from './config/manejo_VE';
import connectMongo from './database/coneccionDBMongo/db_connect';
import app from './server';

// Función donde se levanta el server y la conección de la base de datos Mongodb
const levantarServido = async () => {
  try {
    await connectMongo();
    app.listen(env.port, (): void => {
      console.log(`Servidor levantado en http://localhost: ${env.port}`);
    });
  } catch (error) {
    console.error('Error al levantar el servidor', error);
    process.exit(1);
  }
};

levantarServido();
