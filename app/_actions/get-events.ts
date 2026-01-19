import prisma from "@/lib/prisma";

export async function getEvents() {
  const events = await prisma.event.findMany({});
  return { data: events };
}
