"use client";

import { Department } from "@/app/generated/prisma/browser";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useState } from "react";

type DepartmentAutocompleteProps = {
  departments: Department[];
  required?: boolean;
};

export function DepartmentAutocomplete({
  departments,
  required,
}: DepartmentAutocompleteProps) {
  const options = departments.map((dept) => ({
    label: dept.name,
    id: dept.id,
  }));

  const [value, setValue] = useState<(typeof options)[0] | null>(null);

  return (
    <Box gridColumn="1 / -1">
      <Autocomplete
        options={options}
        renderInput={(params) => (
          <TextField {...params} label={"Department"} required={required} />
        )}
        value={value}
        onChange={(_, v) => setValue(v)}
        autoHighlight
      />
      <input type="hidden" name={"departmentId"} value={value?.id ?? ""} />
    </Box>
  );
}
