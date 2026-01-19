"use server";

import z from "zod";
import { FormState } from "./form-state";
import prisma from "@/lib/prisma";
import { Event } from "../generated/prisma/client";

const createEventSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters long"),
  description: z.string().optional(),
});

export async function createEvent(
  formData: FormData,
): Promise<FormState<Event>> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = createEventSchema.safeParse(rawData);

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const event = await prisma.event.create({
    data: parsed.data,
  });

  return { ok: true, data: event };
}
