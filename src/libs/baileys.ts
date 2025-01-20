import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "baileys";
import { pathInstance } from "../utils";
import { io } from "../libs/socket";
import { Boom } from "@hapi/boom";

export class WhatsAppConnection {
  private socket: any;

  async connect() {
    const { state, saveCreds } = await useMultiFileAuthState(pathInstance);

    this.socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      defaultQueryTimeoutMs: 60000,
      syncFullHistory: true,
    });

    this.socket.ev.on("connection.update", this.handleConnectionUpdate);
    this.socket.ev.on("creds.update", saveCreds);

    return this.socket;
  }

  private readonly handleConnectionUpdate = (update: any) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason?.loggedOut;

      if (shouldReconnect) {
        this.connect();
      }
    }

    // Emite o QR code para o cliente
    if (update.qr) {
      io.emit("whatsapp-qr", update.qr);
    }

    // Emite o status da conexão
    if (connection) {
      io.emit("connection-status", connection);
    }
  };
}
