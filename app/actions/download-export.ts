"use server";

import z from "zod";
import { getLoggedInUserOrRedirect } from "./get-logged-in-user";
import { FormState } from "./form-state";
import prisma from "@/lib/prisma";

const downloadExportSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid end date",
    })
    .optional(),
  eventId: z.string(),
});

export async function downloadExport(
  formData: FormData,
): Promise<FormState | Response> {
  const user = await getLoggedInUserOrRedirect({ includeSalesman: true });

  if (user.role !== "ADMIN" && user.role !== "MANAGER") {
    return { ok: false, formError: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = downloadExportSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      formError: "Invalid input",
    };
  }

  if (!user.salesman) {
    return { ok: false, formError: "User is not a salesman" };
  }

  const role = user.role;
  const departmentId = user.salesman.departmentId;

  const startDate = new Date(parsed.data.startDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(parsed.data.endDate || parsed.data.startDate);
  endDate.setHours(23, 59, 59, 999);

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  const leads = await prisma.lead.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      salesman: role === "ADMIN" ? undefined : { departmentId },
      eventId: parsed.data.eventId,
    },
    include: {
      brands: true,
      salesman: { include: { user: { select: { fullName: true } } } },
    },
  });

  const csvHeaders = [
    "Timestamp",
    "Salesman Name",
    "Lead Name",
    "Country",
    "Company Name",
    "Email",
    "Designation",
    "Phone",
    "Address",
    "Website",
    "Brands",
    "Notes",
  ];

  const csvRows: string[][] = leads.map((l) => [
    l.createdAt.toISOString(),
    l.salesman.user.fullName ?? "",
    l.name ?? "",
    l.country ?? "",
    l.companyName ?? "",
    l.email ?? "",
    l.designation ?? "",
    l.phone ?? "",
    l.address ?? "",
    l.website ?? "",
    l.brands.map((b) => b.name).join(" | "),
    l.notes ?? "",
  ]);

  const csvBytes = new TextEncoder().encode(
    csvHeaders.join(",") +
      "\n" +
      csvRows
        .map((row) => row.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
        .join("\n"),
  );

  return new Response(csvBytes, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads_export_${
        startDate.toISOString().split("T")[0]
      }_to_${endDate.toISOString().split("T")[0]}.csv"`,
    },
  });
}
