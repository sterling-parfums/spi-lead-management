"use client";

import { formLoginAction } from "@/app/actions/login-action";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, action] = useActionState(formLoginAction, null);
  return (
    <>
      <Box
        component="img"
        src="/logo.png"
        alt="Logo"
        sx={{
          display: "block",
          height: 64,
          mx: "auto",
          mt: 8,
          mb: 3,
        }}
      />

      <Typography
        variant="h5"
        align="center"
        fontFamily="serif"
        sx={{ mt: 1, fontWeight: 500 }}
      >
        SPI Lead Management
      </Typography>

      <form
        action={action}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: 300,
          margin: "auto",
          marginTop: 50,
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
    </>
  );
}
