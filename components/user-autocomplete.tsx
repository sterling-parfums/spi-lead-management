"use client";

import { Autocomplete, Box, TextField } from "@mui/material";
import { useState } from "react";

type UserAutocompleteProps = {
  users: { id: string; fullName: string }[];
  required?: boolean;
};

export function UserAutocomplete({ users, required }: UserAutocompleteProps) {
  const options = users.map((u) => ({ label: u.fullName, id: u.id }));
  const [value, setValue] = useState<(typeof options)[0] | null>(null);

  return (
    <Box gridColumn="1 / -1">
      <Autocomplete
        options={options}
        renderInput={(params) => (
          <TextField {...params} label={"User"} required={required} />
        )}
        value={value}
        onChange={(_, v) => setValue(v)}
        autoHighlight
      />
      <input type="hidden" name={"userId"} value={value?.id ?? ""} />
    </Box>
  );
}
