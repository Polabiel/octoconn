import { Request, Response } from "express";
import { app } from "./server";

app.get("/", (req: Request, res: Response) => {
  res.send("Conexão iniciada com sucesso!");
});