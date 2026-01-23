"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { getLoggedInSalesmanOrRedirect } from "./get-logged-in-salesman";

export type LeadWithEventAndBrandsAndImages = Prisma.LeadGetPayload<{
  include: { event: true; brands: true; images: true };
}>;

export type LeadWithEvent = Prisma.LeadGetPayload<{
  include: { event: true };
}>;

export async function getLeads(): Promise<{ data: LeadWithEvent[] }> {
  const salesman = await getLoggedInSalesmanOrRedirect();

  const leads = await prisma.lead.findMany({
    where: { salesmanId: salesman.id },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });
  return { data: leads };
}

export async function getLeadsByQueryAction(
  _prev: unknown,
  formData: FormData,
): Promise<{ data: LeadWithEvent[] }> {
  const salesman = await getLoggedInSalesmanOrRedirect();

  const query = formData.get("query");
  const intent = formData.get("intent");

  if (!query || typeof query !== "string" || intent === "reset") {
    return getLeads();
  }

  const leads = await prisma.lead.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { companyName: { contains: query, mode: "insensitive" } },
        { country: { contains: query, mode: "insensitive" } },
        { event: { name: { contains: query, mode: "insensitive" } } },
      ],
      salesmanId: salesman.id,
    },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  return { data: leads };
}
