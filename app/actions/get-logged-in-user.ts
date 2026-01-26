"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { User } from "../generated/prisma/client";
import { redirect } from "next/navigation";
import { Prisma } from "../generated/prisma/browser";

type UserWithSalesman = Prisma.UserGetPayload<{ include: { salesman: true } }>;

type GetLoggedInUserOpts = { includeSalesman: true };
export async function getLoggedInUser(): Promise<User | null>;
export async function getLoggedInUser(
  opts: GetLoggedInUserOpts,
): Promise<UserWithSalesman | null>;
export async function getLoggedInUser(opts?: GetLoggedInUserOpts) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) return null;

  const session = await prisma.userSession.findUnique({
    where: { id: sessionId, deletedAt: null },
    include: { user: { include: { salesman: opts?.includeSalesman } } },
  });

  return session?.user ?? null;
}

type GetLoggedInUserOrRedirectOpts = GetLoggedInUserOpts;
export async function getLoggedInUserOrRedirect(): Promise<User>;
export async function getLoggedInUserOrRedirect(
  opts: GetLoggedInUserOrRedirectOpts,
): Promise<UserWithSalesman>;
export async function getLoggedInUserOrRedirect(
  opts?: GetLoggedInUserOrRedirectOpts,
): Promise<User> {
  const user = opts ? await getLoggedInUser(opts) : await getLoggedInUser();
  if (!user) {
    redirect("/");
  }

  return user;
}
