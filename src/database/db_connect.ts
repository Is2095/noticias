import mongoose from 'mongoose';
import env from '../config/manejo_VE';

async function connectMongo() {
  try {
    await mongoose.connect(env.uri_db);
    console.log('MongoDb conectada con éxito');
  } catch (error) {
    console.log('Error de conección ' + error);
    process.exit(1);
  }
}

export default connectMongo;
