import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import { RouteTile } from "@/components/route-tile";

export default function HomePage() {
  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {/* Header */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Lead Management
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Capture and manage leads by scanning business cards or entering
          details manually.
        </Typography>
      </Box>

      {/* Tiles */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
        gap={2}
      >
        <RouteTile
          href="/leads/new"
          title="Create Lead"
          description="Scan a business card or add a lead manually"
          icon={<AddIcon />}
        />
        <RouteTile
          href="/leads"
          title="Show Leads"
          description="View all of the leads you have captured"
          icon={<ViewListIcon />}
        />
      </Box>
    </Box>
  );
}
