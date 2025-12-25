import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import SituationPage from "./pages/SituationPage";
import BasicsPage from "./pages/BasicsPage";
import BasicsCategoryPage from "./pages/BasicsCategoryPage";
import SavedPage from "./pages/SavedPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <ScrollToTop />
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/situation/:id" element={<SituationPage />} />
            <Route path="/basics" element={<BasicsPage />} />
            <Route path="/basics/:id" element={<BasicsCategoryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
