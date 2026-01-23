"use client";

import * as React from "react";
import { Button, Stack, Box, Popover, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

type ImagePickerProps = {
  onChange?: (files: File[]) => void;
  name: string;
  label: string;
};

export default function ImagePicker({
  onChange,
  name,
  label,
}: ImagePickerProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [broken, setBroken] = React.useState<Set<number>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [activeFile, setActiveFile] = React.useState<File | null>(null);

  const imageSize = 64;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    setFiles(selectedFiles);
    setBroken(new Set());
    onChange?.(selectedFiles);
  };

  const openLabel = (event: React.MouseEvent<HTMLElement>, file: File) => {
    setAnchorEl(event.currentTarget);
    setActiveFile(file);
  };

  const closeLabel = () => {
    setAnchorEl(null);
    setActiveFile(null);
  };

  return (
    <Stack spacing={2}>
      <Button variant="outlined" component="label" fullWidth>
        {label}
        <input
          name={name}
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={handleChange}
        />
      </Button>

      {files.length > 0 && (
        <Stack direction="row" spacing={1}>
          {files.map((file, index) => {
            const preview = broken.has(index) ? (
              <Box
                sx={{
                  width: imageSize,
                  height: imageSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  color: "text.secondary",
                }}
              >
                <ImageIcon fontSize="small" />
              </Box>
            ) : (
              <Box
                component="img"
                src={URL.createObjectURL(file)}
                alt={file.name}
                onError={() => setBroken((prev) => new Set(prev).add(index))}
                sx={{
                  width: imageSize,
                  height: imageSize,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            );

            return (
              <Box
                key={index}
                onClick={(e) => openLabel(e, file)}
                sx={{ cursor: "pointer" }}
              >
                {preview}
              </Box>
            );
          })}
        </Stack>
      )}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closeLabel}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Typography sx={{ p: 1, maxWidth: 240 }} variant="body2">
          {activeFile?.name}
        </Typography>
      </Popover>
    </Stack>
  );
}
