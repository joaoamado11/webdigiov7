import type { Metadata } from "next";
import "./globals.css";
import OsmoMenu from "@/components/ui/OsmoMenu";

export const metadata: Metadata = {
  title: "Webdigio — Agência Digital Premium",
  description:
    "Webdigio — Agência digital portuguesa premium. Design, desenvolvimento e performance.",
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="antialiased">
        <OsmoMenu />
        {children}
      </body>
    </html>
  );
}
