import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { useMultiFileAuthState, makeWASocket, DisconnectReason } from "baileys";
import { pathInstance } from "../utils";
import { Boom } from "@hapi/boom";

const prisma = new PrismaClient();

const instanceController = {
  async createSocket() {
    const { state, saveCreds } = await useMultiFileAuthState(pathInstance);

    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      defaultQueryTimeoutMs: 60000,
      syncFullHistory: true,
    });

    socket.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        console.log(
          "connection closed due to ",
          lastDisconnect?.error,
          ", reconnecting ",
          shouldReconnect
        );
        // reconnect if not logged out
        if (shouldReconnect) {
          this.createSocket();
        }
      } else if (connection === "open") {
        console.log("opened connection");
      }
    });

    socket.ev.on("creds.update", saveCreds);
    return socket;
  },
};

export default instanceController;
