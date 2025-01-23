import { Request, Response } from "express";
import io from "socket.io-client";
import { app } from "./server";
import { initializeSocket } from "./libs/socket";

const socket = io("http://localhost:3000");

app.get("/", (req: Request, res: Response) => {
  res.send("Conexão iniciada com sucesso!");
});

socket.on("connect", () => {
  console.log("Conexão estabelecida com sucesso!");
});

initializeSocket();