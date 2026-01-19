import prisma from "@/lib/prisma";

export async function getLeads() {
  const leads = await prisma.lead.findMany({ include: { event: true } });

  return { data: leads };
}
