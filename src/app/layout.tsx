import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" dir="ltr">
      <body className={`${inter.className} antialiased selection:bg-black selection:text-white bg-[#FAFAFA] min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
