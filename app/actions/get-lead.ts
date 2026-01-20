import prisma from "@/lib/prisma";

export default async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: { event: true, brands: true },
  });
}
