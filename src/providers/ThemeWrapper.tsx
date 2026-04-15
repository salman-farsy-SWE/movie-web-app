"use client";

import { ThemeProvider } from "next-themes";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={true} storageKey={undefined}>
      <div suppressHydrationWarning>
        {children}
      </div>
    </ThemeProvider>
  );
}