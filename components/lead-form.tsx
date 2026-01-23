"use client";

import { Box } from "@mui/material";
import { useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import createLeadAction from "@/app/actions/create-lead-action";
import { EventAutocomplete } from "@/components/event-autocomplete";
import { BrandAutocomplete } from "./brand-autocomplete";
import { Brand, Event } from "@/app/generated/prisma/client";
import { BusinessCardPicker } from "./business-card-picker";
import { ControlledTextField } from "./controlled-text-field";
import { ControlledStringAutocomplete } from "./controlled-single-autocomplete";
import countries from "@/lib/countries";
import ImagePicker from "./image-picker";
import { SubmitButton } from "./submit-button";
import { scaleImage } from "@/lib/image";
import { FormState } from "@/app/actions/form-state";

export type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  address: string;
  designation: string;
  website: string;
  notes?: string;
};

type LeadFormProps = { events: Event[]; brands: Brand[] };

export function LeadForm({ events, brands }: LeadFormProps) {
  const [state, formAction] = useActionState(createLeadAction, null);
  const [key, setKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const { setValue, control, reset } = useForm<LeadFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      country: "",
      designation: "",
      notes: "",
      address: "",
      website: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setSubmitting(true);
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const original = new FormData(form);

      const cardImages = original.getAll("cardImages") as File[];
      const supportingImages = original.getAll("supportingImages") as File[];

      const files = [...cardImages, ...supportingImages].filter(
        (f) => f && f.size,
      );

      const formData = new FormData();

      for (const [key, value] of original.entries()) {
        if (key !== "cardImages" && key !== "supportingImages") {
          formData.append(key, value);
        }
      }

      // scale images
      for (const file of files) {
        const scaled = await scaleImage(file, 800);
        formData.append("images", scaled, file.name);
      }

      formAction(formData);
      setKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (state?.ok) {
      reset();
      formRef.current?.reset();
    }
  }, [state?.ok, reset]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="grid"
      gap={2}
      gridTemplateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }}
      key={key}
    >
      {/* Scan button */}

      {state && !state.ok && state.formError && (
        <Box gridColumn="1 / -1" color="error.main">
          {state.formError}
        </Box>
      )}

      <EventAutocomplete events={events} />
      <ErrorMessage state={state} name="eventId" />

      <Box gridColumn="1 / -1">
        <BusinessCardPicker setValue={setValue} />
      </Box>

      <ControlledTextField
        control={control}
        name="name"
        label="Name"
        fullWidth
        required
      />
      <ErrorMessage state={state} name="name" />

      <ControlledTextField
        label="Email"
        fullWidth
        name="email"
        control={control}
      />
      <ErrorMessage state={state} name="email" />

      <ControlledTextField
        control={control}
        label="Company Name"
        fullWidth
        required
        name="companyName"
      />
      <ErrorMessage state={state} name="companyName" />

      <ControlledStringAutocomplete
        name="country"
        label="Country"
        options={countries}
        control={control}
        required
      />
      <ErrorMessage state={state} name="country" />

      <ControlledTextField
        name="address"
        label="Address"
        control={control}
        multiline
        rows={3}
        fullWidth
        sx={{ gridColumn: "1 / -1" }}
      />
      <ErrorMessage state={state} name="address" />

      <ControlledTextField
        control={control}
        label="Designation"
        fullWidth
        name="designation"
      />
      <ErrorMessage state={state} name="designation" />

      <ControlledTextField
        control={control}
        label="Phone"
        fullWidth
        name="phone"
      />
      <ErrorMessage state={state} name="phone" />

      <ControlledTextField name="website" label="Website" control={control} />
      <ErrorMessage state={state} name="website" />

      <BrandAutocomplete brands={brands} />
      <ErrorMessage state={state} name="brandIds" />

      <Box gridColumn="1 / -1">
        <ImagePicker name="supportingImages" label="Upload Supporting Images" />
      </Box>

      <ControlledTextField
        control={control}
        name="notes"
        label="Notes"
        multiline
        rows={3}
        fullWidth
        sx={{ gridColumn: "1 / -1" }}
      />
      <ErrorMessage state={state} name="notes" />

      {state?.ok && !submitting && (
        <Box gridColumn="1 / -1" color="success.main" textAlign="center">
          Lead created successfully!
        </Box>
      )}

      {state?.ok === false && state?.formError && (
        <Box gridColumn="1 / -1" color="error.main" textAlign="center">
          {state.formError}
        </Box>
      )}

      {state?.ok === false && state?.fieldErrors && (
        <Box gridColumn="1 / -1" color="error.main" textAlign="center">
          Please fix the errors above.
        </Box>
      )}

      <Box gridColumn="1 / -1">
        <SubmitButton loading={submitting} />
      </Box>
    </Box>
  );
}

type ErrorMessageProps = {
  state: FormState | null;
  name: string;
};
function ErrorMessage({ state, name }: ErrorMessageProps) {
  if (!state || state.ok || !state?.fieldErrors) {
    return null;
  }

  return (
    state.fieldErrors[name] && (
      <Box color="error.main">{state.fieldErrors[name]}</Box>
    )
  );
}
