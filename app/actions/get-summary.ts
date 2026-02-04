"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { FormState } from "./form-state";

export type SummaryLead = Prisma.LeadGetPayload<{
  include: {
    event: true;
    salesman: { include: { user: true; department: true } };
  };
}>;

const summaryInputSchema = z.object({
  eventId: z.string(),
  departmentId: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().refine((date) => !date || !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((date) => !date || !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
});

export async function getSummary(_prev: unknown, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = summaryInputSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      formError: "Invalid input",
    };
  }

  const data = parsed.data;
  const startDate = data.startDate ? new Date(data.startDate) : undefined;
  const endDate = data.endDate ? new Date(data.endDate) : undefined;

  const leads = await prisma.lead.findMany({
    where: {
      eventId: data.eventId,
      salesman: {
        userId: data.userId || undefined,
        departmentId: data.departmentId || undefined,
      },
      createdAt: { gte: startDate, lte: endDate },
    },
    include: {
      event: true,
      salesman: { include: { user: true, department: true } },
    },
  });

  return { ok: true, data: leads };
}
