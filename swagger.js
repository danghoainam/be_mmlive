const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API documentation with Swagger",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://https://be-mmlive.vercel.app",
      description: "Production server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./server.js"], // Đường dẫn tới các file chứa chú thích của bạn
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Đổi đường dẫn
};

module.exports = setupSwagger;
