"use client";

import { Controller, Control, Path, FieldValues } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

type ControlledStringAutocompleteProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: readonly string[];
  label: string;
  required?: boolean;
  fullWidth?: boolean;
};

export function ControlledStringAutocomplete<T extends FieldValues>({
  name,
  control,
  options,
  label,
  required,
  fullWidth = true,
}: ControlledStringAutocompleteProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <Autocomplete
            options={options}
            value={field.value ?? null}
            onChange={(_, value) => field.onChange(value ?? "")}
            isOptionEqualToValue={(a, b) => a === b}
            autoHighlight
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                required={required}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth={fullWidth}
              />
            )}
          />

          {/* Ensures value is included in FormData */}
          <input type="hidden" name={name} value={field.value ?? ""} />
        </>
      )}
    />
  );
}
