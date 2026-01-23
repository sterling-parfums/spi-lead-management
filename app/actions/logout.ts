"use server";

import { cookies } from "next/headers";
import { FormState } from "./form-state";
import { getLoggedInUser } from "./get-logged-in-user";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function logout(): Promise<FormState> {
  const user = await getLoggedInUser();

  if (!user) {
    console.log("No user logged in, redirecting to login page.");
    redirect("/login");
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    console.log("No session ID found in cookies, redirecting to login page.");
    redirect("/login");
  }

  await prisma.userSession.update({
    where: { id: sessionId, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  cookieStore.delete("sessionId");

  return { ok: true };
}
