"use client";

import { Box, Button, TextField } from "@mui/material";
import { useActionState } from "react";
import { useForm } from "react-hook-form";

import createLeadAction from "@/app/actions/create-lead-action";
import { EventAutocomplete } from "@/components/event-autocomplete";
import { BrandAutocomplete } from "./brand-autocomplete";
import { Brand, Event } from "@/app/generated/prisma/client";
import { ScanBusinessCardButton } from "./scan-card-button";
import { ControlledTextField } from "./controlled-text-field";

type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  designation: string;
  notes?: string;
};

type LeadFormProps = { events: Event[]; brands: Brand[] };

export function LeadForm({ events, brands }: LeadFormProps) {
  const [state, action] = useActionState(createLeadAction, null);

  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<LeadFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      country: "",
      designation: "",
      notes: "",
    },
  });

  return (
    <Box
      component="form"
      action={action}
      display="grid"
      gap={2}
      gridTemplateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }}
    >
      {/* Scan button */}
      <Box gridColumn="1 / -1">
        <ScanBusinessCardButton setValue={setValue} />
      </Box>

      {state && !state.ok && state.formError && (
        <Box gridColumn="1 / -1" color="error.main">
          {state.formError}
        </Box>
      )}

      <EventAutocomplete events={events} />

      <ControlledTextField
        control={control}
        name="name"
        label="Name"
        fullWidth
        required
      />

      <ControlledTextField
        label="Email"
        type="email"
        fullWidth
        name="email"
        control={control}
      />

      <ControlledTextField
        control={control}
        label="Company Name"
        fullWidth
        required
        name="companyName"
      />

      <ControlledTextField
        control={control}
        label="Country"
        fullWidth
        required
        name="country"
      />

      <ControlledTextField
        control={control}
        label="Designation"
        fullWidth
        name="designation"
      />

      <ControlledTextField
        control={control}
        label="Phone"
        fullWidth
        name="phone"
      />

      <BrandAutocomplete brands={brands} />

      <ControlledTextField
        control={control}
        name="notes"
        label="Notes"
        multiline
        rows={3}
        fullWidth
        sx={{ gridColumn: "1 / -1" }}
      />

      <Box gridColumn="1 / -1">
        <Button type="submit" variant="contained" fullWidth>
          Save Lead
        </Button>
      </Box>

      {state?.ok && (
        <Box gridColumn="1 / -1" color="success.main" textAlign="center">
          Lead created successfully!
        </Box>
      )}
    </Box>
  );
}
