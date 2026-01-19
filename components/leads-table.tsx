"use client";
import { Prisma } from "@/app/generated/prisma/client";
import { DataTable } from "./data-table";

type LeadWithEvent = Prisma.LeadGetPayload<{ include: { event: true } }>;

type LeadsTableProps = { data: LeadWithEvent[] };

export default function LeadsTable({ data }: LeadsTableProps) {
  const headers = ["Name", "Email", "Event"];
  const rows = data.map((l) => [l.name, l.email, l.event.name]);
  return <DataTable headers={headers} rows={rows} />;
}
