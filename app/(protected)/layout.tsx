import { SidebarLayout } from "@/components/sidebar-layout";
import { ReactNode } from "react";
import { getLoggedInUser } from "@/app/actions/get-logged-in-user";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getLoggedInUser();

  if (!user) {
    redirect("/login");
  }

  return <SidebarLayout user={user}>{children}</SidebarLayout>;
}
