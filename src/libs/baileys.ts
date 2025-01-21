import {
  WASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeWASocket,
  DisconnectReason,
} from "baileys";
import { Boom } from "@hapi/boom";
import NodeCache from "node-cache";
import { io } from "./socket";
import Pino from "pino";

export class WhatsAppManager {
  private socket: WASocket | null = null;
  private readonly msgRetryCounterCache = new NodeCache();

  async connect() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState("./assets/auth");
      const { version } = await fetchLatestBaileysVersion();

      this.socket = makeWASocket({
        version,
        logger: Pino({ level: "error" }),
        printQRInTerminal: false, // Desabilita QR no terminal
        defaultQueryTimeoutMs: 60 * 1000,
        auth: state,
        keepAliveIntervalMs: 60 * 1000,
        markOnlineOnConnect: true,
        msgRetryCounterCache: this.msgRetryCounterCache,
      });

      // Gerenciar eventos de conexão
      this.socket.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === "close") {
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;

          io.emit("status", {
            status: "disconnected",
            shouldReconnect,
          });

          if (shouldReconnect) {
            this.connect();
          }
        }

        if (qr) {
          io.emit("qr", {
            qr,
          });
        }

        if (connection === "open") {
          io.emit("status", {
            status: "connected",
          });
        }
      });

      this.socket.ev.on("creds.update", saveCreds);

      return this.socket;
    } catch (error) {
      io.emit("error", {
        error: "Falha ao iniciar conexão WhatsApp",
      });
      throw error;
    }
  }

  getSocket(): WASocket | null {
    return this.socket;
  }
}

export const whatsappManager = new WhatsAppManager();
