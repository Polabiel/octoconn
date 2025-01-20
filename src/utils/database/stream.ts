import { Server } from "http";
import { prismaClientWithPulse } from "../../libs/pulse";

export async function streamChatMessages(io: Server) {
  console.log(`Stream new messages with Prisma Client ...`);
  const stream = await prismaClientWithPulse.session.stream({ create: {} });

  // Handle Prisma stream events
  for await (const event of stream) {
    console.log(`New event from Pulse: `, event);
    io.emit("chat-message", event.created);
  }
}
