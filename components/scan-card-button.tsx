"use client";

import { useRef, useState, useTransition } from "react";
import { Alert, Button, CircularProgress } from "@mui/material";
import { UseFormSetValue } from "react-hook-form";
import { processImage } from "@/lib/exif";
import { extractLeadFromImages } from "@/app/actions/extract-card-fields";

type ExtractResponse = {
  ok: boolean;
  data?: Partial<{
    name: string;
    email: string;
    phone: string;
    companyName: string;
    country: string;
    designation: string;
  }>;
  error?: string;
};

type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  designation: string;
  notes?: string;
};

type Props = {
  setValue: UseFormSetValue<LeadFormValues>;
};

export function ScanBusinessCardButton({ setValue }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, startExtract] = useTransition();

  const pickImages = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";

    if (!files.length) return;

    startExtract(async () => {
      try {
        const formData = new FormData();

        for (const file of files) {
          const processed = await processImage(file, 600);
          formData.append(
            "images",
            processed,
            file.name.replace(/\.\w+$/, ".jpg"),
          );
        }

        const result = await extractLeadFromImages(formData);

        if (!result.ok) {
          throw new Error(result.error);
        }

        Object.entries(result.data).forEach(([key, value]) => {
          if (value) {
            setValue(key as keyof LeadFormValues, value, {
              shouldDirty: true,
            });
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Extraction failed");
      }
    });
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        accept="image/*"
        capture="environment"
        onChange={onFilesSelected}
      />

      <Button variant="outlined" onClick={pickImages} disabled={isExtracting}>
        {isExtracting ? (
          <>
            <CircularProgress size={18} sx={{ mr: 1 }} />
            Extracting…
          </>
        ) : (
          "Scan business card"
        )}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </>
  );
}
