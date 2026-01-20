"use client";

import Link from "next/link";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { ReactNode } from "react";

type RouteTileProps = {
  href: string;
  title: string;
  description?: string;
  icon?: ReactNode;
};

export function RouteTile({ href, title, description, icon }: RouteTileProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        transition: "all 0.2s ease",
      }}
    >
      <CardActionArea
        component={Link}
        href={href}
        sx={{
          height: "100%",
          alignItems: "stretch",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: -2,
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            {icon && (
              <Box
                sx={{
                  color: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {icon}
              </Box>
            )}

            <Box>
              <Typography variant="h6">{title}</Typography>

              {description && (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
