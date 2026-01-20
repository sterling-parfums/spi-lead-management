"use client";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { LeadWithEventAndBrands } from "@/app/actions/get-leads";

type LeadsTableProps = { data: LeadWithEventAndBrands[] };

export default function LeadsTable({ data }: LeadsTableProps) {
  const headers = ["Name", "Country", "Company", "Event"];
  const rows = data.map((l) => [
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
