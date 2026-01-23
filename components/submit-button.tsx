"use client";

import { Button, ButtonProps } from "@mui/material";

export function SubmitButton(props: ButtonProps) {
  return (
    <Button {...props} type="submit" variant="contained" fullWidth>
      Submit
    </Button>
  );
}
