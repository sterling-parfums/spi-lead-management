import prisma from "@/lib/prisma";

export async function getAllDepartments() {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  });

  return { data: departments };
}
