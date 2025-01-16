import swaggerUi from "swagger-ui-express";
import swaggerFile from "./assets/swagger-output.json";
import PinoHttp from "pino-http";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import http from "http";

const HOST = process.env.HOST ?? "localhost";
const PORT = (process.env.PORT as unknown as number) ?? 3000;

export const logger = PinoHttp({
  transport: {
    level: "debug",
    target: "pino-pretty",
    options: {
      destination: 2,
      all: true,
      translateTime: true,
    },
  },
});

const app = express();

const server = http.createServer(app);

export const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";
export const ADMIN_SECRET = process.env.ADMIN_SECRET;

app.use(cors());
app.use(["/doc", "/docs"], swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(logger);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./public");

app.use(express.static(path.join(__dirname, "..", "public")));

server.listen(PORT, () => {
  logger.logger.info(`Server running at http://${HOST}:${PORT}`);
  logger.logger.info(`Swagger running at http://${HOST}:${PORT}/docs`);
});

// Adicionar manipulador de erros ao servidor
server.on("error", (err) => {
  logger.logger.error("Erro no servidor:", err);
});

export default app;