"use client";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { LeadWithEvent } from "@/app/actions/get-leads";
import { useState } from "react";

type LeadsTableProps = { data: LeadWithEvent[] };

export default function LeadsTable({ data }: LeadsTableProps) {
  const [filteredData, setFilteredData] = useState(data);
  const headers = ["Name", "Country", "Company", "Event"];
  const rows = filteredData.map((l) => [
    l.name,
    l.country,
    l.companyName,
    l.event.name,
  ]);

  const router = useRouter();
  return (
    <DataTable
      headers={headers}
      rows={rows}
      onRowClick={(_, i) => router.push(`/leads/${data[i].id}`)}
    />
  );
}
