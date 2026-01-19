import { SidebarLayout } from "@/components/sidebar-layout";
import { ReactNode } from "react";
import { getLoggedInUser } from "@/app/_actions/get-logged-in-user";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getLoggedInUser();

  if (!user) {
    redirect("/login");
  }

  return <SidebarLayout>{children}</SidebarLayout>;
}
