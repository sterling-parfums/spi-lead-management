"use server";

import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const LeadExtractionSchema = z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  companyName: z.string().nullable(),
  country: z.string().nullable(),
  designation: z.string().nullable(),
});

export type ExtractLeadResult =
  | { ok: true; data: z.infer<typeof LeadExtractionSchema> }
  | { ok: false; error: string };

export async function extractLeadFromImages(
  formData: FormData,
): Promise<ExtractLeadResult> {
  try {
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return { ok: false, error: "No images provided" };
    }

    const imageParts = await Promise.all(
      files.map(async (file) => {
        const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

        return {
          type: "input_image" as const,
          image_url: `data:${file.type};base64,${base64}`,
          detail: "low" as const,
        };
      }),
    );

    const response = await openai.responses.parse({
      model: "gpt-4.1",
      temperature: 0,
      input: [
        {
          role: "system",
          content:
            "You extract structured contact details from business cards. " +
            "Only return fields that are clearly present. Do not guess.",
        },
        { role: "user", content: [...imageParts] },
      ],
      text: { format: zodTextFormat(LeadExtractionSchema, "lead") },
    });

    const parsed = response.output_parsed;

    if (!parsed) {
      return { ok: false, error: "Failed to parse model response" };
    }

    return { ok: true, data: parsed };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Lead extraction failed",
    };
  }
}
