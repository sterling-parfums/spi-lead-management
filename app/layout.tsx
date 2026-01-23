import { Providers } from "@/app/providers";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>SPI Leads Management</title>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
