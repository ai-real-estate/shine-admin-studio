import { MiniSidebar } from "@/components/MiniSidebar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AppShellProvider } from "@/contexts/AppShellContext";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

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

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("source-groups");
  const [homeActiveItem, setHomeActiveItem] = useState("api");
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    if (location.pathname !== "/notifications") {
      setUnreadCount(2);
    }
  }, [location.pathname]);

  const activeItem = useMemo(() => {
    return getActiveItem(location.pathname, homeActiveItem);
  }, [homeActiveItem, location.pathname]);

  const handleItemClick = (item: string) => {
    if (item === "settings") {
      setSettingsOpen(true);
      return;
    }

    setSettingsOpen(false);

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
  };

  return (
    <AppShellProvider value={{ unreadCount, setUnreadCount }}>
      <div className="flex h-screen w-full bg-background">
        <MiniSidebar activeItem={activeItem} onItemClick={handleItemClick} unreadCount={unreadCount} />

        <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => {
            setSettingsOpen(false);
            setHomeActiveItem("api");
          }}
          activeSection={activeSection}
          onSectionClick={setActiveSection}
        />

        <main className="flex flex-1 p-3 pl-0">
          <Outlet />
        </main>
      </div>
    </AppShellProvider>
  );
}

