import { Server } from "socket.io";
import { httpServer, logger } from "../server";

export const io: Server = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 180000,
  pingInterval: 60000,
});

io.on("connection", async (socket) => {
  logger.logger.info(`Usuário conectado: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.logger.info(`Usuário desconectado: ${socket.id}`);
  });
});
