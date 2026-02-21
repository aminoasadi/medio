import type { Metadata } from "next";
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
    <html lang="fa" dir="rtl">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
