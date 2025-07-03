import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import AuthLayoutWrapper from "../components/AuthLayoutWrapper";

export const metadata: Metadata = {
  title: "Vroom Vroom - Admin Dashboard",
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};


export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}