const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "Marriage Story API",
  },
  host: "20.89.56.97:8000",
  basePath: "/api",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/api.routes.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
