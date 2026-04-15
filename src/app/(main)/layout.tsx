import "@/app/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchProvider } from "@/contexts/SearchContext";
import { SearchOverlay } from "@/components/SearchOverlay";

export default function MainLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      <SearchProvider>
        <Navbar />
        {children}
        {modal}        
        <Footer />
        <SearchOverlay /> 
      </SearchProvider>
    </>
  );
}
