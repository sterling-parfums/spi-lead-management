import prisma from "@/lib/prisma";
import { Event } from "../generated/prisma/client";

export async function getEvents(): Promise<{ data: Event[] }> {
  const events = await prisma.event.findMany({});
  return { data: events };
}
