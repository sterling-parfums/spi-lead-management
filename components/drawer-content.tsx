"use client";

import { logout } from "@/app/actions/logout";
import { User } from "@/app/generated/prisma/client";
import { UserRole } from "@/app/generated/prisma/enums";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export type DrawerItem = {
  label: ReactNode;
  href: string;
  icon: ReactNode;
  roles?: UserRole[];
};
type DrawerContentProps = {
  items: DrawerItem[];
  user: User;
  onItemClick?: () => void;
};

export function DrawerContent({
  items,
  onItemClick,
  user,
}: DrawerContentProps) {
  const pathname = usePathname();
  return (
    <List>
      {items
        .filter((i) => !i.roles || i.roles.includes(user.role))
        .map(({ label, href, icon }) => (
          <ListItemButton
            key={href}
            component={Link}
            href={href}
            selected={pathname === href}
            onClick={onItemClick}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}

      <ListItemButton onClick={async () => logout()}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary={"Logout"} />
      </ListItemButton>
    </List>
  );
}
