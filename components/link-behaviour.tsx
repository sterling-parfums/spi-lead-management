"use client";

import NextLink from "next/link";
import { forwardRef } from "react";

export const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<React.ComponentProps<typeof NextLink>, "href"> & { href: string }
>(function LinkBehavior(props, ref) {
  const { href, ...other } = props;
  return <NextLink ref={ref} href={href} {...other} />;
});
