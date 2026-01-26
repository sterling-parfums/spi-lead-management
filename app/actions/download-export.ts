"use server";

import z from "zod";
import { getLoggedInUserOrRedirect } from "./get-logged-in-user";
import { FormState } from "./form-state";
import prisma from "@/lib/prisma";

const exportInputSchema = z.object({
  startDate: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid start date",
    })
    .optional(),
  endDate: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid end date",
    })
    .optional(),
  eventId: z.string(),
  userId: z.string().optional(),
});

export async function downloadExport(
  formData: FormData,
): Promise<FormState | Response> {
  const user = await getLoggedInUserOrRedirect({ includeSalesman: true });

  if (user.role !== "ADMIN" && user.role !== "MANAGER") {
    return { ok: false, formError: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = exportInputSchema.safeParse(rawData);

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

  const data = parsed.data;

  const role = user.role;
  const departmentId = user.salesman.departmentId;
  const userId = data.userId ?? user.id;

  const startDate = data.startDate ? new Date(data.startDate) : undefined;
  startDate?.setHours(0, 0, 0, 0);

  const endDate = data.endDate ? new Date(data.endDate) : undefined;
  endDate?.setHours(23, 59, 59, 999);

  const leads = await prisma.lead.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      salesman: role === "ADMIN" ? { userId } : { departmentId },
      eventId: data.eventId,
    },
    include: {
      brands: true,
      salesman: { include: { user: { select: { fullName: true } } } },
    },
  });

  const { name: eventName } = await prisma.event.findUniqueOrThrow({
    where: { id: data.eventId },
    select: { name: true },
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

  let exportFilename = `${Date.now()}-leads-${eventName}`;
  if (data.startDate) {
    exportFilename += `-${data.startDate}`;
  }
  if (data.endDate) {
    exportFilename += `-${data.endDate}`;
  }
  exportFilename += ".csv";

  return new Response(csvBytes, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${exportFilename}"`,
    },
  });
}
