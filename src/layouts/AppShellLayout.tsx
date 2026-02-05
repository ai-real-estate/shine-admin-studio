 import { MiniSidebar } from "@/components/MiniSidebar";
 import { MobileDrawer } from "@/components/MobileDrawer";
 import { useIsMobile } from "@/hooks/use-mobile";
import { SettingsPanel } from "@/components/SettingsPanel";
import { HistoryPanel } from "@/components/HistoryPanel";
import { AppShellProvider } from "@/contexts/AppShellContext";
 import { useEffect, useMemo, useState, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
 import { Menu } from "lucide-react";

function getActiveItem(pathname: string, homeActiveItem: string) {
  if (pathname.startsWith("/notifications")) return "notifications";
  if (pathname.startsWith("/platforms")) return "platforms";
  if (pathname.startsWith("/my-listings")) return "my-listings";
  if (pathname === "/" || pathname.startsWith("/chat")) return homeActiveItem;
  return homeActiveItem;
}

export default function AppShellLayout() {
  const location = useLocation();
  const navigate = useNavigate();
   const isMobile = useIsMobile();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
   const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("source-groups");
  const [homeActiveItem, setHomeActiveItem] = useState("api");
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    if (location.pathname !== "/notifications") {
      setUnreadCount(2);
    }
  }, [location.pathname]);

  const activeItem = useMemo(() => {
    if (settingsOpen) return "settings";
    if (historyOpen) return "history";
    return getActiveItem(location.pathname, homeActiveItem);
  }, [historyOpen, homeActiveItem, location.pathname, settingsOpen]);

   const handleItemClick = useCallback((item: string) => {
    if (item === "settings") {
      setSettingsOpen(true);
      setHistoryOpen(false);
      return;
    }

    if (item === "history") {
      setHistoryOpen(true);
      setSettingsOpen(false);
      return;
    }

    setSettingsOpen(false);
    setHistoryOpen(false);

    if (item === "notifications") {
      navigate("/notifications");
      return;
    }
    if (item === "platforms") {
      navigate("/platforms");
      return;
    }
    if (item === "my-listings") {
      navigate("/my-listings");
      return;
    }

    setHomeActiveItem(item);
    navigate("/");
   }, [navigate]);

  return (
    <AppShellProvider value={{ unreadCount, setUnreadCount }}>
       <div className="flex h-screen w-full flex-col bg-background md:flex-row">
         {/* Mobile Drawer */}
         <MobileDrawer
           isOpen={mobileDrawerOpen}
           onClose={() => setMobileDrawerOpen(false)}
           activeItem={activeItem}
           onItemClick={handleItemClick}
           unreadCount={unreadCount}
         />
 
         {/* Desktop Sidebar - hidden on mobile */}
         {!isMobile && (
           <MiniSidebar activeItem={activeItem} onItemClick={handleItemClick} unreadCount={unreadCount} />
         )}

         {!isMobile && (
           <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => {
            setSettingsOpen(false);
            setHomeActiveItem("api");
          }}
          activeSection={activeSection}
          onSectionClick={setActiveSection}
           />
         )}

         {!isMobile && (
           <HistoryPanel
          isOpen={historyOpen}
          onClose={() => {
            setHistoryOpen(false);
            setHomeActiveItem("api");
          }}
          onOpenChat={(chatId) => {
            navigate(`/chat?chatId=${encodeURIComponent(chatId)}`);
            setHistoryOpen(false);
          }}
           />
         )}

         <main className="flex flex-1 p-3 md:pl-0 relative">
           {/* Mobile hamburger button - absolute positioned */}
           {isMobile && (
             <button
               onClick={() => setMobileDrawerOpen(true)}
               className="absolute top-4 left-4 z-10 p-2"
             >
               <Menu className="h-6 w-6 text-foreground" strokeWidth={1.5} />
             </button>
           )}
          <Outlet />
        </main>
      </div>
    </AppShellProvider>
  );
}
