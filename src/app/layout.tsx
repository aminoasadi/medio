import type { Metadata } from "next";
import { Roboto } from "next/font/google"; // Switch to Roboto
import "./globals.css";

// Configure Roboto font, 400 (regular), 500 (medium), 700 (bold), 900 (black)
const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medio - Creator Toolkit",
  description: "A creator toolkit combining link-in-bio, blog, and email capture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Force light mode by adding "light" class and stripping dark backgrounds
  return (
    <html lang="en" dir="ltr" className="light">
      <body className={`${roboto.className} antialiased selection:bg-sky-500/30 selection:text-sky-900 bg-background min-h-screen flex flex-col overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
