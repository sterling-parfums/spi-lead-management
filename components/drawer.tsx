"use client";

import { Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { DrawerContent, DrawerItem } from "./drawer-content";
import MuiDrawer from "@mui/material/Drawer";
import { User } from "@/app/generated/prisma/client";

type DrawerProps = {
  onItemClick?: () => void;
  onClose?: () => void;
  open?: boolean;
  drawerWidth: number;
  items: DrawerItem[];
  user: User;
};
export function Drawer({
  onItemClick,
  onClose,
  open,
  drawerWidth,
  user,
  items,
}: DrawerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {/* Mobile drawer */}
      {isMobile && (
        <MuiDrawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: { width: drawerWidth },
          }}
        >
          <Toolbar />
          <DrawerContent items={items} user={user} onItemClick={onItemClick} />
        </MuiDrawer>
      )}

      {/* Desktop drawer */}
      {!isMobile && (
        <MuiDrawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <DrawerContent items={items} user={user} />
        </MuiDrawer>
      )}
    </>
  );
}
