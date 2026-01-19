"use server";

import z from "zod";
import { FormState } from "./form-state";
import prisma from "@/lib/prisma";
import { Salesman } from "../generated/prisma/client";

const createSalesmanSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  departmentId: z.string().min(1, "Department ID is required"),
});

export async function createSalesman(
  formData: FormData,
): Promise<FormState<Salesman>> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = createSalesmanSchema.safeParse(rawData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const salesman = await prisma.salesman.create({
    data: {
      userId: parsed.data.userId,
      departmentId: parsed.data.departmentId,
    },
  });

  return { ok: true, data: salesman };
}
