"use client";

import { Box, Toolbar, useTheme, useMediaQuery } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import { useState } from "react";
import { User } from "@/app/generated/prisma/client";
import { DrawerItem } from "./drawer-content";
import { AppBar } from "./app-bar";
import { Drawer } from "./drawer";

type SidebarLayoutProps = { children: React.ReactNode; user?: User };
export function SidebarLayout({ children, user }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDrawerClose = () => setSidebarOpen(false);
  const handleDrawerToggle = () => setSidebarOpen((v) => !v);

  const navItems: DrawerItem[] = [
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "My Leads", href: "/leads", icon: <PeopleIcon /> },
    {
      label: "Exports",
      href: "/exports",
      icon: <PeopleIcon />,
      roles: ["ADMIN", "MANAGER"],
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        title={`SPI Leads Management (${user.fullName})`}
        onDrawerToggle={handleDrawerToggle}
      />

      <Drawer
        items={navItems}
        user={user}
        drawerWidth={240}
        open={sidebarOpen}
        onItemClick={handleDrawerClose}
        onClose={handleDrawerClose}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: 0,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
