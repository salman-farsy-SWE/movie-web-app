import "@/app/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SearchProvider } from "@/contexts/SearchContext";
import { SearchOverlay } from "@/components/overlays/SearchOverlay";
import { RatingProvider } from "@/contexts/RatingContext";
import { RatingOverlay } from "@/components/overlays/RatingOverlay";
import { ListProvider } from "@/contexts/ListContext";
import { ListOverlay } from "@/components/overlays/ListOverlay";
import { NavigationTracker } from "@/components/navigation/NavigationTracker";

export default function MainLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      <ListProvider>
        <RatingProvider>
          <SearchProvider>
            <Navbar />
            {children}
            {modal}
            <Footer />
            <ScrollToTop />
            <SearchOverlay />
            <RatingOverlay />
            <ListOverlay />
            <NavigationTracker />
          </SearchProvider>
        </RatingProvider>
      </ListProvider>

    </>
  );
}
