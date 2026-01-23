"use client";

import { LeadWithEventAndBrandsAndImages } from "@/app/actions/get-leads";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { ImageGallery } from "./image-gallery";

export default function LeadDetail({
  lead,
}: {
  lead: LeadWithEventAndBrandsAndImages;
}) {
  return (
    <Box maxWidth={900} mx="auto">
      <Card>
        <CardContent>
          <Stack spacing={3}>
            {/* Header */}
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {lead.name}
              </Typography>
              <Typography color="text.secondary">
                {lead.designation || "—"} · {lead.companyName || "—"}
              </Typography>
            </Box>

            <Divider />

            {/* Main Info */}
            <Grid container spacing={2}>
              <Info label="Email" value={lead.email} type="email" />
              <Info label="Phone" value={lead.phone} />
              <Info label="Country" value={lead.country} />
              <Info label="Event" value={lead.event.name} />
            </Grid>

            {/* Brands */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Brands
              </Typography>
              {lead.brands.length === 0 ? (
                <Typography color="text.secondary">—</Typography>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {lead.brands.map((b) => (
                    <Chip key={b.id} label={b.name} size="small" />
                  ))}
                </Stack>
              )}
            </Box>

            {/* Notes */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Notes
              </Typography>
              <Typography
                color={lead.notes ? "text.primary" : "text.secondary"}
              >
                {lead.notes || "—"}
              </Typography>
            </Box>

            <Divider />

            <ImageGallery images={lead.images} />

            {/* Metadata */}
            <Grid container spacing={2}>
              <Info
                label="Created"
                value={new Date(lead.createdAt).toLocaleString()}
              />
              <Info
                label="Updated"
                value={new Date(lead.updatedAt).toLocaleString()}
              />
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function Info({
  label,
  value,
  type,
}: {
  label: string;
  value?: string | null;
  type?: "email";
}) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box>
        {value && type === "email" ? (
          <Link href={`mailto:${value}`}>{value}</Link>
        ) : (
          <Typography>{value || "—"}</Typography>
        )}
      </Box>
    </Grid>
  );
}
