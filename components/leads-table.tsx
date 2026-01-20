"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { DataTable } from "./data-table";
import { getLeadsByQueryAction, LeadWithEvent } from "@/app/actions/get-leads";
import { Box, TextField, Button } from "@mui/material";

type LeadsTableProps = { data: LeadWithEvent[] };

export default function LeadsTable({ data }: LeadsTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [state, action] = useActionState(getLeadsByQueryAction, {
    data,
  });

  const headers = ["Created At", "Name", "Country", "Company", "Event"];
  const rows = state.data.map((l) => [
    l.createdAt.toLocaleString("en-GB"),
    l.name,
    l.country,
    l.companyName,
    l.event.name,
  ]);

  return (
    <>
      <Box
        component="form"
        mb={2}
        display="grid"
        gap={2}
        action={action}
        gridTemplateColumns={{
          xs: "1fr", // mobile: stacked
          sm: "1fr auto auto", // desktop: input + buttons
        }}
        alignItems="center"
      >
        <TextField
          name="query"
          label="Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          name="intent"
          value="apply"
          fullWidth
        >
          Apply
        </Button>

        <Button
          type="submit"
          variant="outlined"
          name="intent"
          value="reset"
          onClick={() => setQuery("")}
          fullWidth
        >
          Reset
        </Button>
      </Box>

      <p>Found {state.data.length} leads</p>
      <DataTable
        headers={headers}
        rows={rows}
        onRowClick={(_, i) => router.push(`/leads/${state.data[i].id}`)}
      />
    </>
  );
}
