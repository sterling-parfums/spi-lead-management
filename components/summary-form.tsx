"use client";

import { Box, TextField, Button } from "@mui/material";
import { EventAutocomplete } from "./event-autocomplete";
import { UserAutocomplete } from "./user-autocomplete";
import { Department, Event, User } from "@/app/generated/prisma/browser";
import { DepartmentAutocomplete } from "./department-autocomplete";
import { useActionState } from "react";
import { getSummary } from "@/app/actions/get-summary";
import { DataTable } from "./data-table";

type SummaryFormProps = {
  events: Event[];
  departments: Department[];
  users: User[];
};

export function SummaryForm({ events, users, departments }: SummaryFormProps) {
  const [state, action, submitting] = useActionState(getSummary, null);

  const headers = ["Created At", "User", "Name", "Country", "Company", "Event"];
  const rows =
    state?.ok && state.data
      ? state.data?.map((l) => [
          l.createdAt.toLocaleString("en-GB"),
          l.salesman.user.fullName,
          l.name,
          l.country,
          l.companyName,
          l.event.name,
        ])
      : [];

  return (
    <>
      <Box
        component="form"
        action={action}
        sx={{ display: "grid", gap: 2, maxWidth: 400 }}
      >
        <EventAutocomplete events={events} required />
        <DepartmentAutocomplete departments={departments} />
        <UserAutocomplete users={users} />

        <TextField
          name="startDate"
          label="From Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          name="endDate"
          label="To Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button type="submit" variant="contained" loading={submitting}>
          Export
        </Button>
      </Box>

      {state && state.ok && state.data && (
        <>
          <p>Found {state.data.length} leads</p>
          <DataTable headers={headers} rows={rows} />
        </>
      )}

      {state?.ok === false && state.formError && (
        <Box mt={2} color="error.main">
          {state.formError}
        </Box>
      )}
    </>
  );
}
