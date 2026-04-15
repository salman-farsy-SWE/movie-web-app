import type { Metadata } from "next";
import { Akshar, Inter, Poppins } from "next/font/google";
import "@/app/globals.css";
import ThemeWrapper from "@/providers/ThemeWrapper";

export const metadata: Metadata = {
  title: "Movie Trails",
  description: "Movie streaming landing page",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const akshar = Akshar({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-akshar",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${inter.variable} ${akshar.variable} overflow-x-hidden bg-white dark:bg-dark text-foreground antialiased`}
      >
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}
