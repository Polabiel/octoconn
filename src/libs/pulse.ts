import { withPulse } from "@prisma/extension-pulse";
import { PrismaClient } from "@prisma/client";

export const prismaClientWithPulse = new PrismaClient().$extends(
  withPulse({
    apiKey: process.env.PULSE_API_KEY ?? "",
  })
);
