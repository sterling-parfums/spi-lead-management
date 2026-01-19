"use client";

import { login } from "@/app/_actions/login";
import { Button, TextField } from "@mui/material";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, action] = useActionState(login, null);
  return (
    <form
      action={action}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: 300,
        margin: "auto",
        marginTop: 100,
      }}
    >
      <TextField name="email" label="Email" />
      <TextField name="password" type="password" label="Password" />
      <Button type="submit" variant="contained">
        Login
      </Button>
      {state && !state.ok && (
        <div style={{ color: "red" }}>
          {state.formError || "There were errors with your submission."}
        </div>
      )}
    </form>
  );
}
