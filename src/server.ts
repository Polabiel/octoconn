// Importações de terceiros
import express from "express";
import http from "http";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import PinoHttp from "pino-http";
import path from "path";

// Importações locais
import swaggerFile from "./assets/swagger-output.json";
import { Configuration } from "./utils/configuration";
import { Server } from "socket.io";
import { initializeSocket } from "./libs/socket";

const app = express();
const httpServer = http.createServer(app);

// Configuração do logger
export const logger = PinoHttp({
  transport: {
    level: "warn",
    target: "pino-pretty",
    options: {
      destination: 2,
      all: true,
      translateTime: true,
    },
  },
});

// Middlewares
app.use(cors());
app.use(["/doc", "/docs"], swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de views
app.set("view engine", "ejs");
app.set("views", "./public");
app.use(express.static(path.join(__dirname, "..", "public")));

// Inicialização do servidor
httpServer.listen(Configuration.port, () => {
  logger.logger.info(
    `Server running at http://${Configuration.host}:${Configuration.port}`
  );
});

httpServer.on("error", (err) => {
  logger.logger.error("Erro no servidor:", err);
});

const io: Server = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 180000,
  pingInterval: 60000,
});

initializeSocket();

export { io, httpServer, app };
