import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
};

export default env;
