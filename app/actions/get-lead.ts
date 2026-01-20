import prisma from "@/lib/prisma";

export async function getLeadById(id: string, salesmanId: string) {
  return prisma.lead.findUnique({
    where: { id, salesmanId },
    include: { event: true, brands: true },
  });
}

export async function getLeadByQuery(query: string, salesmanId: string) {
  return prisma.lead.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { companyName: { contains: query, mode: "insensitive" } },
        { country: { contains: query, mode: "insensitive" } },
      ],
      salesmanId,
    },
  });
}
