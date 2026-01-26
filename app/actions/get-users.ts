"use server";

import prisma from "@/lib/prisma";
import { User } from "../generated/prisma/client";
import { UserWithSalesman } from "./get-logged-in-user";

export async function getAllUsers() {
  const users = await prisma.user.findMany({});
  return { data: users };
}

export async function getUsersByDepartment(departmentId: string) {
  const users = await prisma.user.findMany({
    where: { salesman: { departmentId: departmentId } },
  });
  return { data: users };
}

export async function getExportableUsers(user: UserWithSalesman) {
  if (user.role === "ADMIN") {
    return getAllUsers();
  }

  if (user.role === "MANAGER" && user.salesman) {
    return getUsersByDepartment(user.salesman.departmentId);
  }

  return { data: [] };
}
