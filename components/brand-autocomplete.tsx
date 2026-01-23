"use client";

import { Brand } from "@/app/generated/prisma/client";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useState } from "react";

type BrandAutocompleteProps = {
  brands: Brand[];
};

export function BrandAutocomplete({ brands }: BrandAutocompleteProps) {
  const options = brands.map((b) => ({ label: b.name, id: b.id }));
  const [value, setValue] = useState<typeof options>([]);
  const [inputValue, setInputValue] = useState("");

  return (
    <Box gridColumn="1 / -1">
      <Autocomplete
        options={options}
        renderInput={(params) => <TextField {...params} label={"Brands"} />}
        value={value}
        inputValue={inputValue}
        onChange={(_, v) => setValue(v)}
        onInputChange={(_, v, reason) => {
          if (reason !== "selectOption" && reason !== "reset") {
            setInputValue(v);
          }
        }}
        multiple
        disableCloseOnSelect
        filterSelectedOptions
        isOptionEqualToValue={(opt, val) => opt.id === val.id}
        autoHighlight
      />
      <input
        type="hidden"
        name={"brandIds"}
        value={value.map((v) => v.id) ?? []}
      />
    </Box>
  );
}
