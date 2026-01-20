"use client";

import {
  Box,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

export type ContextMenuItem<Row> = {
  label: string;
  onClick: (row: Row) => void;
};

type DataTableProps<Row extends readonly React.ReactNode[]> = {
  headers: string[];
  rows: Row[];
  onRowClick?: (row: Row, index: number) => void;
  contextMenuItems?: ContextMenuItem<Row>[];
};

export function DataTable<Row extends readonly React.ReactNode[]>({
  headers,
  rows,
  onRowClick,
  contextMenuItems = [],
}: DataTableProps<Row>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeRow, setActiveRow] = useState<Row | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, row: Row) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setActiveRow(row);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setActiveRow(null);
  };

  if (rows.length === 0) {
    return (
      <Box
        sx={{
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="h6">No data</Typography>
        <Typography variant="body2">
          There is nothing to display yet.
        </Typography>
      </Box>
    );
  }

  /* ---------------- Mobile cards ---------------- */

  if (isMobile) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {rows.map((row, i) => (
          <Card
            key={i}
            onClick={() => onRowClick?.(row, i)}
            sx={{ cursor: onRowClick ? "pointer" : "default" }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  {row
                    .filter((c) => c)
                    .map((cell, idx) => (
                      <Box key={idx} mb={1}>
                        <Typography variant="caption" color="text.secondary">
                          {headers[idx]}
                        </Typography>
                        <Typography>{cell}</Typography>
                      </Box>
                    ))}
                </Box>

                {contextMenuItems.length > 0 && (
                  <IconButton onClick={(e) => openMenu(e, row)}>
                    <MoreVertIcon />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}

        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
          {contextMenuItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                if (activeRow) item.onClick(activeRow);
                closeMenu();
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  /* ---------------- Desktop table ---------------- */

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((h) => (
              <TableCell key={h}>{h}</TableCell>
            ))}
            {contextMenuItems.length > 0 && <TableCell align="right" />}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              hover={!!onRowClick}
              onClick={() => onRowClick?.(row, i)}
              sx={{
                cursor: onRowClick ? "pointer" : "default",

                // zebra striping
                backgroundColor: i % 2 === 0 ? "action.hover" : "inherit",

                // hover override (must be explicit)
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                },
              }}
            >
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}

              {contextMenuItems.length > 0 && (
                <TableCell align="right">
                  <IconButton onClick={(e) => openMenu(e, row)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
        {contextMenuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              if (activeRow) item.onClick(activeRow);
              closeMenu();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
  );
}
