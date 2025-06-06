import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  uri_db: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.7rytdze.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_CLUSTER}`,
  url_mongo_local: process.env.URL_MONGO_LOCAL as string,
  isDev: process.env.IS_DEV,
  urlNoticiasXML: process.env.URL_API_DE_NOTICIAS_XML
    ? process.env.URL_API_DE_NOTICIAS_XML.split(',').map((url) => url.trim())
    : [],
};

export default env;
