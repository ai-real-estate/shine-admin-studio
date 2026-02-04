import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import ChatWorkspace from "./pages/ChatWorkspace";
import ConnectPlatforms from "./pages/ConnectPlatforms";
import MyListings from "./pages/MyListings";
import NotFound from "./pages/NotFound";
import AppShellLayout from "@/layouts/AppShellLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppShellLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/chat" element={<ChatWorkspace />} />
            <Route path="/platforms" element={<ConnectPlatforms />} />
            <Route path="/my-listings" element={<MyListings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
