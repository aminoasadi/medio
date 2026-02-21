import type { Metadata } from "next";
import "@fontsource/funnel-display";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medio - Creator Toolkit",
  description: "A creator toolkit combining link-in-bio, blog, and email capture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
