import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  uri_db: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.7rytdze.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_CLUSTER}`
  
};

export default env;
