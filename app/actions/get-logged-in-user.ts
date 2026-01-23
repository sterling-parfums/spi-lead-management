"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { User } from "../generated/prisma/client";

export async function getLoggedInUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) return null;

  const session = await prisma.userSession.findUnique({
    where: { id: sessionId, deletedAt: null },
    include: { user: true },
  });

  return session?.user ?? null;
}
