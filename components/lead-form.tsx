"use client";

import { Box, Button, TextField } from "@mui/material";
import { EventAutocomplete } from "@/components/event-autocomplete";
import { BrandAutocomplete } from "./brand-autocomplete";
import createLeadAction from "@/app/actions/create-lead-action";
import { Brand, Event } from "@/app/generated/prisma/client";
import { useActionState } from "react";

type LeadFormProps = { events: Event[]; brands: Brand[] };

export function LeadForm({ events, brands }: LeadFormProps) {
  const [state, action] = useActionState(createLeadAction, null);

  return (
    <Box
      component="form"
      display="grid"
      action={action}
      gridTemplateColumns={{
        xs: "1fr", // mobile: single column
        md: "repeat(2, 1fr)", // desktop: two columns
      }}
      gap={2}
    >
      {state && !state.ok && state.formError && (
        <Box gridColumn="1 / -1" color="error.main">
          {state.formError}
        </Box>
      )}

      <EventAutocomplete events={events} />

      <TextField name="name" label="Name" required fullWidth />
      <TextField name="email" label="Email" type="email" fullWidth />

      <TextField name="companyName" label="Company Name" fullWidth required />
      <TextField name="country" label="Country" fullWidth required />

      <TextField name="designation" label="Designation" fullWidth />
      <TextField name="phone" label="Phone" fullWidth />

      <BrandAutocomplete brands={brands} />

      <TextField
        name="notes"
        label="Notes"
        multiline
        rows={3}
        fullWidth
        sx={{ gridColumn: "1 / -1" }}
      />

      <Box gridColumn="1 / -1" display="flex" justifyContent="flex-end">
        <Button variant="contained" type="submit" fullWidth>
          Save Lead
        </Button>
      </Box>

      {state?.ok && (
        <Box
          gridColumn="1 / -1"
          color="success.main"
          sx={{ textAlign: "center" }}
        >
          Lead created successfully!
        </Box>
      )}
    </Box>
  );
}
