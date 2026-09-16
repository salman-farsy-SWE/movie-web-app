import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GlobalOverlays } from "@/components/overlays/GlobalOverlays";
import { NavigationTracker } from "@/components/navigation/NavigationTracker";
import { SortFilterTransitionProvider } from "@/contexts/SortFilterTransitionContext";
import { NotFoundContent } from "@/components/not-found/NotFoundContent";

export default function NotFound() {
  return (
    <SortFilterTransitionProvider>
      <Navbar />
      <main className="pt-[54px] sm:pt-[56px] lg:pt-[62px] xl:pt-[72px]">
        <NotFoundContent />
      </main>
      <Footer />
      <ScrollToTop />
      <GlobalOverlays />
      <NavigationTracker />
    </SortFilterTransitionProvider>
  );
}

