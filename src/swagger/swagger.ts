import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Noticias Diario El Pais',
      version: '1.0.0',
      description: 'api con node, express, typescript, MongoDb, manejos archivo RSS Xml con buenas prácticas',
      contact: {
        name: 'Desarrollador',
      },
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'local server',
        },
      ],
    },
  },
  apis: ['./src/routes/*.ts'],
};
const specs = swaggerJsdoc(options);
export default specs;