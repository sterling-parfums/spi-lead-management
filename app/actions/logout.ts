"use server";

import { cookies } from "next/headers";
import { FormState } from "./form-state";
import { getLoggedInUser } from "./get-logged-in-user";
import prisma from "@/lib/prisma";

export async function logout(): Promise<FormState> {
  const user = await getLoggedInUser();

  if (!user) {
    return { ok: false, formError: "No user is currently logged in." };
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return { ok: false, formError: "No active session found." };
  }

  await prisma.userSession.update({
    where: { id: sessionId, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  cookieStore.delete("sessionId");

  return { ok: true };
}
