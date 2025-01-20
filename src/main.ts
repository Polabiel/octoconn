import app from "./server";

app.use("/", (req, res) => {
  res.send("Hello World!");
});
