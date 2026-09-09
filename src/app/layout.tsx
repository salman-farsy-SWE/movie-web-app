import type { Metadata } from "next";
import { Akshar, Inter, Poppins, Monda  } from "next/font/google";
import "@/app/globals.css";
import ThemeWrapper from "@/providers/ThemeWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

import { getCurrentUser } from "@/actions/auth";

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

const monda = Monda({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-monda",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${inter.variable} ${akshar.variable} ${monda.variable} flow-root overflow-hidden bg-white dark:bg-dark min-h-screen text-foreground antialiased`}
      >
        <ThemeWrapper>
          <AuthProvider initialUser={user}>
            {children}
          </AuthProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
