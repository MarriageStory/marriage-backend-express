const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "Marriage Story API",
  },
  host: "localhost:8000",
  basePath: "/api",
  schemes: ["http", "https"],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/api.routes.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
