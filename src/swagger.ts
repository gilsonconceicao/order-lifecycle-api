
import swaggerJsdoc from "swagger-jsdoc"; 

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: ' Gerenciamento de pedidos ',
      version: '1.0.0',
      description: 'Documentação da API com Swagger',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: '/api',
      },
    ],
  },
  apis: ['src/**/*.ts'],
};

export const specs = swaggerJsdoc(options);