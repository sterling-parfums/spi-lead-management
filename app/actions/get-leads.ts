import prisma from "@/lib/prisma";
import { Prisma } from "../generated/prisma/client";

export type LeadWithEventAndBrands = Prisma.LeadGetPayload<{
  include: { event: true; brands: true };
}>;

export async function getLeads(): Promise<{ data: LeadWithEventAndBrands[] }> {
  const leads = await prisma.lead.findMany({ include: { event: true } });
  return { data: leads };
}
