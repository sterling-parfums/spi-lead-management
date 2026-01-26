import { getEvents } from "@/app/actions/get-events";
import { getLoggedInUserOrRedirect } from "@/app/actions/get-logged-in-user";
import { UserRole } from "@/app/generated/prisma/enums";
import { ExportForm } from "@/components/export-form";
import { redirect } from "next/navigation";

export default async function ExportPage() {
  const user = await getLoggedInUserOrRedirect();
  const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER];

  if (!allowedRoles.includes(user.role)) {
    redirect("/");
  }

  const { data: events } = await getEvents();

  return <ExportForm events={events} />;
}
