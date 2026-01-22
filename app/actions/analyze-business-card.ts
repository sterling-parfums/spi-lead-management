// app/actions/analyzeBusinessCard.ts
"use server";

import {
  DocumentAnalysisClient,
  AzureKeyCredential,
  AnalyzeResult,
  AnalyzedDocument,
  DocumentField,
} from "@azure/ai-form-recognizer";

export async function analyzeBusinessCard(formData: FormData) {
  const files = formData.getAll("images") as File[];
  const [file] = files;

  if (!(file instanceof File)) {
    throw new Error("Missing image file");
  }

  const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;
  const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;

  if (!endpoint || !key) {
    throw new Error("Azure Document Intelligence env vars not set");
  }

  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key),
  );

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const poller = await client.beginAnalyzeDocument(
    "prebuilt-businessCard",
    buffer,
  );

  const result = await poller.pollUntilDone();

  const [document] = result.documents || [];
  const fields = document.fields;

  if (!fields) {
    return null;
  }

  console.log("Analyzed document fields:", Object.values(fields));

  const extracted = {
    name: getFieldValue(fields.ContactNames),
    mobilePhones: getFieldValue(fields.MobilePhones),
    workPhones: getFieldValue(fields.WorkPhones),
    otherPhones: getFieldValue(fields.OtherPhones),
    jobTitles: getFieldValue(fields.JobTitles),
    companyNames: getFieldValue(fields.CompanyNames),
    addresses: getFieldValue(fields.Addresses),
    emails: getFieldValue(fields.Emails),
    websites: getFieldValue(fields.Websites),
    departments: getFieldValue(fields.Departments),
  };

  return extracted;
}

function getFieldValue(field?: DocumentField, confidence = 0.9): string | null {
  if (!field) {
    return null;
  }

  if (field.kind === "array") {
    return field.values.map((item) => getFieldValue(item)).join(" | ");
  }

  if (field.kind === "object") {
    return field.content ?? null;
  }

  if (!field.confidence || field.confidence < confidence) {
    console.log(`Field confidence too low: ${field.confidence}`);
    console.log("Field content:", field);
    return null;
  }

  if (field.kind === "string") {
    return field.value ?? null;
  }

  if (field.kind === "phoneNumber") {
    return field.value ?? null;
  }

  if (field.kind === "address") {
    return field.content ?? null;
  }

  return null;
}
