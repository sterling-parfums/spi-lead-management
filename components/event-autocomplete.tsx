"use client";

import { Event } from "@/app/generated/prisma/client";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useState } from "react";

type EventAutocompleteProps = {
  events: Event[];
};

export function EventAutocomplete({ events }: EventAutocompleteProps) {
  const options = events.map((event) => ({ label: event.name, id: event.id }));
  const [value, setValue] = useState<(typeof options)[0] | null>(null);

  return (
    <Box gridColumn="1 / -1">
      <Autocomplete
        options={options}
        renderInput={(params) => (
          <TextField {...params} label={"Event"} required />
        )}
        value={value}
        onChange={(_, v) => setValue(v)}
        autoHighlight
      />
      <input type="hidden" name={"eventId"} value={value?.id ?? ""} />
    </Box>
  );
}
