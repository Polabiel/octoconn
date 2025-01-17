import instance from "./routes/instance";
import app, { io, prismaClientWithPulse } from "./server";

app.use("/instance", instance);

io.on(`connection`, async (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on(`disconnect`, () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  // quando o usuário se conectar, ele irá criar um session (consiste em capturar tudo que está na pasta ./assets/auth) e salvar no banco de dados

  socket.on(`create-session`, async () => {
    const session = await instance.createSocket();
    const user = await prismaClientWithPulse.user.create({
      data: {
        session: session.state,
      },
    });
    console.log(`User created: ${user.id}`);
  });
});
