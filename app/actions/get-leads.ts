import prisma from "@/lib/prisma";
import { Prisma } from "../generated/prisma/client";

export type LeadWithEventAndBrands = Prisma.LeadGetPayload<{
  include: { event: true; brands: true };
}>;

export type LeadWithEvent = Prisma.LeadGetPayload<{
  include: { event: true };
}>;

export async function getLeads(
  salesmanId: string,
): Promise<{ data: LeadWithEvent[] }> {
  const leads = await prisma.lead.findMany({
    where: { salesmanId },
    include: { event: true },
  });
  return { data: leads };
}
