const express = require("express");
const dotenv = require("dotenv");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
dotenv.config();

const routes = require("./src/routes/api.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Routes Index /
app.get("/", (req, res) => {
  res.send("Marriage Story API 2022");
});

// Routing Static File
app.use("/public", express.static("public"));

app.use("/api", routes);

// Route Swagger
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((req, res) => {
  res.status(404).json({ message: "404_NOT_FOUND" });
});

app.listen(process.env.APP_PORT || 8000, () => {
  console.log(`Server Ready on PORT ${process.env.APP_PORT || 8000}`);
});
