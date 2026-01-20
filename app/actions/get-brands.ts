import prisma from "@/lib/prisma";
import { Brand } from "../generated/prisma/browser";

export async function getBrands(): Promise<{ data: Brand[] }> {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return { data: brands };
}
