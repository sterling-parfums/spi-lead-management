"use server";

import z from "zod";
import { Lead } from "../generated/prisma/client";
import { FormState } from "./form-state";
import prisma from "@/lib/prisma";
import { getLoggedInSalesman } from "./get-logged-in-salesman";

const createLeadSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  name: z.string().min(2, "Lead name must be at least 2 characters long"),
  country: z.string(),
  companyName: z.string().optional(),
  email: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  brands: z.string().array().optional(),
});

export default async function createLeadAction(
  _prev: FormState<Lead> | null,
  formData: FormData,
): Promise<FormState<Lead>> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = createLeadSchema.safeParse(rawData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const salesman = await getLoggedInSalesman();

  if (!salesman) {
    return { ok: false, formError: "Need to be logged in as a salesman" };
  }

  const lead = await prisma.lead.create({
    data: {
      eventId: parsed.data.eventId,
      name: parsed.data.name,
      country: parsed.data.country,
      companyName: parsed.data.companyName,
      email: parsed.data.email,
      designation: parsed.data.designation,
      phone: parsed.data.phone,
      notes: parsed.data.notes,
      brands: {
        connect: parsed.data.brands?.map((brandId) => ({ id: brandId })) ?? [],
      },
      salesmanId: salesman.id,
    },
  });

  return { ok: true, data: lead };
}
