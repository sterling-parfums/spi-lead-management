"use server";

import z from "zod";
import { UserSession } from "../generated/prisma/client";
import { FormState } from "./form-state";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export async function formLoginAction(
  _prevState: FormState<UserSession> | null,
  formData: FormData,
): Promise<FormState<UserSession>> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    return { ok: false, formError: "Invalid email or password" };
  }

  const match = await compare(parsed.data.password, user.hashedPassword);

  if (!match) {
    return { ok: false, formError: "Invalid email or password" };
  }

  const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await prisma.userSession.create({
    data: { user: { connect: user }, expiresAt: sessionExpiry },
  });

  const cookieStore = await cookies();
  const cookieName = "sessionId";

  cookieStore.set({
    name: cookieName,
    value: session.id,
    expires: sessionExpiry,
  });

  redirect("/");
}
