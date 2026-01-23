"use client";

import { Box, Stack, Tooltip } from "@mui/material";

type ImageItem = {
  url: string;
  filename: string;
};

type ImageGalleryProps = {
  images: ImageItem[];
  thumbSize?: number;
};

export function ImageGallery({ images, thumbSize = 80 }: ImageGalleryProps) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {images.map((img) => (
        <Tooltip key={img.url} title={img.filename} arrow>
          <Box
            component="a"
            href={img.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              width: thumbSize,
              height: thumbSize,
              borderRadius: 1,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              display: "block",
            }}
          >
            <Box
              component="img"
              src={img.url}
              alt={img.filename}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
          </Box>
        </Tooltip>
      ))}
    </Stack>
  );
}
