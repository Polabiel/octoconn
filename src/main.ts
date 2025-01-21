import { Request, Response } from "express";
import app from "./server";
import { whatsappManager } from "./libs/baileys";

const client = new WebSocket("ws://localhost:3000");

app.get("/", (req: Request, res: Response) => {
  whatsappManager
    .connect()
    .then(() => {
      client.onopen = () => {
        // receber a mensagem qr do servidor
        client.send("start-whatsapp");
      };
    })
    .catch((error) => {
      res.status(500).send("Falha ao iniciar conexão WhatsApp");
    });
});
