import { getAllDepartments } from "@/app/actions/get-departments";
import { getEvents } from "@/app/actions/get-events";
import { getLoggedInUserOrRedirect } from "@/app/actions/get-logged-in-user";
import { getAllUsers, getExportableUsers } from "@/app/actions/get-users";
import { EventAutocomplete } from "@/components/event-autocomplete";
import { SummaryForm } from "@/components/summary-form";
import { UserAutocomplete } from "@/components/user-autocomplete";
import { Box, Button, TextField, Typography } from "@mui/material";
import { redirect } from "next/navigation";

export default async function SummaryPage() {
  const user = await getLoggedInUserOrRedirect();

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const { data: events } = await getEvents();
  const { data: users } = await getAllUsers();
  const { data: departments } = await getAllDepartments();

  return (
    <>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Leads Summary
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Overview of all leads captured in the system with filters.
        </Typography>
      </Box>

      <SummaryForm events={events} users={users} departments={departments} />
    </>
  );
}
