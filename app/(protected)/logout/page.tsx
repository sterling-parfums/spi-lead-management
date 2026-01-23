import { logout } from "@/app/actions/logout";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  await logout();
  redirect("/login");
}
