"use server";

import z from "zod";
import { FormState } from "./form-state";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { User } from "../generated/prisma/client";

const createUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string(),
});

export async function createUser(
  _prevData: FormState<User> | null,
  formData: FormData,
): Promise<FormState<User>> {
  const rawData = Object.fromEntries(formData.entries());

  const parsed = createUserSchema.safeParse(rawData);

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const hashedPassword = await hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      hashedPassword: hashedPassword,
    },
  });

  return { ok: true, data: user };
}
