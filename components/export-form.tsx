"use client";

import { Event, UserRole } from "@/app/generated/prisma/browser";
import { Box, Button, TextField, Typography } from "@mui/material";
import { EventAutocomplete } from "./event-autocomplete";
import { UserAutocomplete } from "./user-autocomplete";

type ExportFormProps = {
  events: Event[];
  role: UserRole;
  users: { id: string; fullName: string }[];
};

export function ExportForm({ events, role, users }: ExportFormProps) {
  return (
    <>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Export Leads
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Select a date range and event to export leads collected during that
          period.
        </Typography>

        {role === "ADMIN" && (
          <Typography variant="body1" color="text.secondary" mt={1}>
            As an admin, you can export all leads from an event.
          </Typography>
        )}

        {role === "MANAGER" && (
          <Typography variant="body1" color="text.secondary" mt={1}>
            As a manager, you can export all leads from your department.
          </Typography>
        )}
      </Box>
      <Box
        component="form"
        action="/api/export"
        method="post"
        sx={{ display: "grid", gap: 2, maxWidth: 400 }}
      >
        <EventAutocomplete events={events} required />

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

        <UserAutocomplete users={users} />

        <Button type="submit" variant="contained">
          Export
        </Button>
      </Box>
    </>
  );
}
