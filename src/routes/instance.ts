import express from "express";
const instance = express.Router();
import instanceController from "../controllers/instance.controller";

instance.get("/", (req, res) => {
  instanceController.createSocket().then((socket) => {
    res.send(socket);
  });
});

export default instance;
