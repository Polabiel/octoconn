import { Server } from "socket.io";
import { httpServer } from "../server";
import { whatsappManager } from "./baileys";

export const io: Server = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 180000,
  pingInterval: 60000,
});

io.on("connection", async (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Usuário desconectado: ${socket.id}`);
  });
});