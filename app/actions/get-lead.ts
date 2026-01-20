import prisma from "@/lib/prisma";

export async function getLeadById(id: string, salesmanId: string) {
  return prisma.lead.findUnique({
    where: { id, salesmanId },
    include: { event: true, brands: true },
  });
}
