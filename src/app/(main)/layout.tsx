import "@/app/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SearchOverlay } from "@/components/overlays/SearchOverlay";
import { RatingOverlay } from "@/components/overlays/RatingOverlay";
import { ListOverlay } from "@/components/overlays/ListOverlay";
import { NavigationTracker } from "@/components/navigation/NavigationTracker";
import { PageTransition } from "@/components/navigation/PageTransition";
import { SortFilterTransitionProvider } from "@/contexts/SortFilterTransitionContext";

export default function MainLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      <SortFilterTransitionProvider>
        <Navbar />
        <PageTransition>
          {children}
        </PageTransition>
        {modal}
        <Footer />
        <ScrollToTop />
        <SearchOverlay />
        <RatingOverlay />
        <ListOverlay />
        <NavigationTracker />
      </SortFilterTransitionProvider>
    </>
  );
}
