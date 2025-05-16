import env from './config/manejo_VE';
import app from './server';

const levantarServido = async () => {
  try {
    app.listen(env.port, (): void => {
      console.log(`Servidor levantado en http://localhost: ${env.port}`);
    });
  } catch (error) {
    console.error('Error al levantar el servidor', error);
    process.exit(1);
  }
};

levantarServido();
