"use server";

import z from "zod";
import { Lead } from "../generated/prisma/client";
import { FormState } from "./form-state";
import prisma from "@/lib/prisma";
import { getLoggedInSalesman } from "./get-logged-in-salesman";
import { uploadImagesToS3 } from "@/lib/s3";
import { ImageCreateManyArgs } from "../generated/prisma/models";

const createLeadSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  name: z.string().min(2, "Lead name must be at least 2 characters long"),
  country: z.string(),
  companyName: z.string().optional(),
  email: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  brandIds: z.preprocess((v) => {
    if (typeof v !== "string") {
      return [];
    }

    return v
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, z.string().array()),
  website: z.string().optional(),
  address: z.string().optional(),
});

export default async function createLeadAction(
  _prev: FormState<Lead> | null,
  formData: FormData,
): Promise<FormState<Lead>> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = createLeadSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      formError: "Invalid form data",
    };
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
        connect: parsed.data.brandIds?.map((id) => ({ id })) ?? [],
      },
      salesmanId: salesman.id,
      website: parsed.data.website,
      address: parsed.data.address,
    },
  });

  const imageFiles = formData.getAll("images") as File[];

  const env = process.env.NODE_ENV || "dev";
  const uploaded = await uploadImagesToS3(
    imageFiles.filter(Boolean),
    `${env}/${lead.id}`,
  );

  await prisma.image.createMany({
    data: uploaded.map(({ url, file }) => ({
      url,
      filename: file.name,
      leadId: lead.id,
    })),
  } as ImageCreateManyArgs);

  return { ok: true, data: lead };
}
