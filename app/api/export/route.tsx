import { downloadExport } from "@/app/actions/download-export";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const response = await downloadExport(formData);

  if (response instanceof Response) {
    return response;
  }

  return NextResponse.json(response);
}
