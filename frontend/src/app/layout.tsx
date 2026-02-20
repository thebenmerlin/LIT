import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Litigation Intelligence Terminal",
  description: "Enterprise-grade legal research terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
