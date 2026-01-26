"use client";

import { Event } from "@/app/generated/prisma/browser";
import { Box, Button, TextField } from "@mui/material";
import { EventAutocomplete } from "./event-autocomplete";

type ExportFormProps = {
  events: Event[];
};
export function ExportForm({ events }: ExportFormProps) {
  return (
    <Box
      component="form"
      action="/api/export"
      method="post"
      sx={{ display: "grid", gap: 2, maxWidth: 400 }}
    >
      <TextField
        name="startDate"
        label="Start Date"
        type="date"
        slotProps={{ inputLabel: { shrink: true } }}
        required
      />

      <TextField
        name="endDate"
        label="End Date"
        type="date"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <EventAutocomplete events={events} required />

      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Box>
  );
}
