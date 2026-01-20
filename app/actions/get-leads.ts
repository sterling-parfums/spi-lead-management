import prisma from "@/lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { getLoggedInSalesmanOrRedirect } from "./get-logged-in-salesman";

export type LeadWithEventAndBrands = Prisma.LeadGetPayload<{
  include: { event: true; brands: true };
}>;

export type LeadWithEvent = Prisma.LeadGetPayload<{
  include: { event: true };
}>;

export async function getLeads(): Promise<{ data: LeadWithEvent[] }> {
  const salesman = await getLoggedInSalesmanOrRedirect();

  const leads = await prisma.lead.findMany({
    where: { salesmanId: salesman.id },
    include: { event: true },
  });
  return { data: leads };
}

export async function getLeadsByQuery(query: string) {
  const salesman = await getLoggedInSalesmanOrRedirect();

  return prisma.lead.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { companyName: { contains: query, mode: "insensitive" } },
        { country: { contains: query, mode: "insensitive" } },
      ],
      salesmanId: salesman.id,
    },
  });
}
