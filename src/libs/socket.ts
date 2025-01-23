import { io } from "../server";
import { logger } from "../server";
import { WhatsAppManager } from "./baileys";

const whatsappManager = new WhatsAppManager();

export const initializeSocket = () => {
  io.on("connection", (socket) => {
    logger.logger.info("Nova conexão estabelecida:", socket.id);

    socket.on("start-whatsapp", async () => {
      try {
        await whatsappManager.connect();
      } catch (error) {
        logger.logger.error("Erro ao conectar WhatsApp:", error);
      }
    });

    socket.on("disconnect", () => {
      logger.logger.info("Cliente desconectado:", socket.id);
    });
  });
};
