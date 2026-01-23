"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import { UseFormSetValue } from "react-hook-form";

import { analyzeBusinessCard } from "@/app/actions/analyze-business-card";
import { scaleImage } from "@/lib/image";
import { LeadFormValues } from "./lead-form";
import { ImageGallery } from "./image-gallery";

type Props = {
  setValue: UseFormSetValue<LeadFormValues>;
};

type PreviewImage = {
  url: string;
  filename: string;
};

export function BusinessCardPicker({ setValue }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, startExtract] = useTransition();
  const [images, setImages] = useState<PreviewImage[]>([]);

  // clean up blob URLs
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const pickImages = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // create preview thumbnails immediately
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      filename: file.name,
    }));

    setImages(previews);

    startExtract(async () => {
      try {
        const formData = new FormData();

        for (const file of files) {
          const processed = await scaleImage(file);
          formData.append("images", processed, file.name);
        }

        const result = await analyzeBusinessCard(formData);

        if (!result) {
          setError("Extraction failed");
          return;
        }

        setValue("name", result.name || "");
        setValue("email", result.emails || "");
        setValue(
          "phone",
          [result.workPhones, result.mobilePhones, result.otherPhones]
            .filter(Boolean)
            .join(" | ") || "",
        );
        setValue("companyName", result.companyNames || "");
        setValue("address", result.addresses || "");
        setValue("designation", result.jobTitles || "");
        setValue("website", result.websites || "");
        setValue("country", result.countries || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Extraction failed");
      }
    });
  };

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <Stack spacing={1}>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        accept="image/*"
        onChange={onFilesSelected}
        capture={isIOS ? undefined : "environment"}
        name="cardImages"
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

      {images.length > 0 && <ImageGallery images={images} thumbSize={80} />}

      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
