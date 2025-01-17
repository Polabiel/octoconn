import swaggerUi from "swagger-ui-express";
import swaggerFile from "./assets/swagger-output.json";
import PinoHttp from "pino-http";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import http from "http";
import { PrismaClient } from "@prisma/client";
import { withPulse } from "@prisma/extension-pulse";
import * as socket from "socket.io";
import { Server } from "socket.io";
import { Configuration } from "./utils/configuration";

const app = express();
const server = http.createServer(app);
export const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";
export const ADMIN_SECRET = process.env.ADMIN_SECRET;
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export const prismaClientWithPulse = new PrismaClient().$extends(
  withPulse({
    apiKey: process.env.PULSE_API_KEY || "",
  })
);

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

app.use(cors());
app.use(["/doc", "/docs"], swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(logger);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./public");

app.use(express.static(path.join(__dirname, "..", "public")));

server.listen(Configuration.port, () => {
  logger.logger.info(
    `Server running at http://${Configuration.host}:${Configuration.port}`
  );
});

// Adicionar manipulador de erros ao servidor
server.on("error", (err) => {
  logger.logger.error("Erro no servidor:", err);
});

export default app;
