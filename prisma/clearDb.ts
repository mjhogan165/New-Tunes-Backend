import { prisma } from "./prisma-instance";

export async function clearDb() {
  await prisma.user.deleteMany({});
  await prisma.friendRequest.deleteMany({});
  await prisma.newTune.deleteMany({});
}
