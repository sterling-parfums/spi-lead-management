"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

type ControlledTextFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
} & Omit<TextFieldProps, "name" | "defaultValue" | "onChange" | "value">;

export function ControlledTextField<T extends FieldValues>(
  props: ControlledTextFieldProps<T>,
) {
  const { name, control, ...textFieldProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...textFieldProps}
          {...field}
          value={field.value ?? ""}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
