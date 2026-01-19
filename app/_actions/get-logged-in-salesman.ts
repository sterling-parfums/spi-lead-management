"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Salesman } from "../generated/prisma/client";

export async function getLoggedInSalesman(): Promise<Salesman | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) return null;

  const session = await prisma.userSession.findUnique({
    where: { id: sessionId },
    include: { user: { include: { salesman: true } } },
  });

  return session?.user.salesman ?? null;
}
