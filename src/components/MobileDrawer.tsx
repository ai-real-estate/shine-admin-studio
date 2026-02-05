 import { Sheet, SheetContent } from "@/components/ui/sheet";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { cn } from "@/lib/utils";
 import { useHaptic } from "@/hooks/use-haptic";
 import {
   MessageSquare,
   FolderOpen,
   Zap,
   FileText,
   MessageCirclePlus,
   Bell,
   Settings,
   Share2,
   LayoutList,
   User,
 } from "lucide-react";
 
 interface MobileDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   activeItem: string;
   onItemClick: (item: string) => void;
   unreadCount?: number;
 }
 
 const mainNavItems = [
   { id: "web", icon: MessageCirclePlus, label: "Web" },
   { id: "history", icon: FileText, label: "History" },
   { id: "api", icon: Zap, label: "API" },
   { id: "platforms", icon: Share2, label: "Platforms" },
   { id: "my-listings", icon: LayoutList, label: "My Listings" },
 ];
 
 const starredItems = [
   { id: "starred-1", label: "EpicVisuals" },
   { id: "starred-2", label: "layoff.Today" },
   { id: "starred-3", label: "Fitrun" },
   { id: "starred-4", label: "DNS" },
   { id: "starred-5", label: "MonoSend" },
 ];
 
 const recentItems = [
   { id: "recent-1", label: "Email workflow automation dat..." },
   { id: "recent-2", label: "Average Cost of Bookkeeping f..." },
   { id: "recent-3", label: "Profitable Infoproducts for Ukr..." },
   { id: "recent-4", label: "Developing Strategic Entrepren..." },
 ];
 
 const bottomNavItems = [
   { id: "notifications", icon: Bell, label: "Notifications", hasBadge: true },
   { id: "settings", icon: Settings, label: "Settings" },
   { id: "account", icon: User, label: "Account" },
 ];
 
 export function MobileDrawer({
   isOpen,
   onClose,
   activeItem,
   onItemClick,
   unreadCount = 0,
 }: MobileDrawerProps) {
   const haptic = useHaptic();
 
   const handleItemClick = (item: string) => {
     haptic.selection();
     onItemClick(item);
     onClose();
   };
 
   return (
     <Sheet open={isOpen} onOpenChange={onClose}>
       <SheetContent
         side="left"
         className="w-[85%] max-w-sm p-0 bg-background border-r-0"
       >
         <div className="flex flex-col h-full">
           {/* Header */}
           <div className="px-6 py-6">
             <h1 className="text-3xl font-bold text-foreground">Estatio</h1>
           </div>
 
           <ScrollArea className="flex-1 px-4">
             {/* Main Navigation */}
             <nav className="flex flex-col gap-1">
               {mainNavItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => handleItemClick(item.id)}
                   className={cn(
                     "flex items-center gap-3 rounded-xl px-4 py-3 text-base transition-smooth",
                     activeItem === item.id
                       ? "bg-muted text-foreground font-medium"
                       : "text-foreground hover:bg-muted/50"
                   )}
                 >
                   <item.icon className="h-5 w-5" strokeWidth={1.5} />
                   {item.label}
                 </button>
               ))}
             </nav>
 
             {/* Starred Section */}
             <div className="mt-6">
               <h3 className="px-4 mb-2 text-sm font-medium text-muted-foreground">
                 Starred
               </h3>
               <nav className="flex flex-col gap-0.5">
                 {starredItems.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => handleItemClick(item.id)}
                     className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-base text-foreground hover:bg-muted/50 transition-smooth"
                   >
                     <FolderOpen className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                     {item.label}
                   </button>
                 ))}
               </nav>
             </div>
 
             {/* Recent Section */}
             <div className="mt-6 mb-4">
               <nav className="flex flex-col gap-0.5">
                 {recentItems.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => handleItemClick(item.id)}
                     className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-base text-foreground/80 hover:bg-muted/50 transition-smooth truncate"
                   >
                     {item.label}
                   </button>
                 ))}
               </nav>
             </div>
           </ScrollArea>
 
           {/* Bottom Navigation */}
           <div className="px-4 py-4 border-t border-border/50">
             <nav className="flex flex-col gap-1">
               {bottomNavItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => handleItemClick(item.id)}
                   className={cn(
                     "relative flex items-center gap-3 rounded-xl px-4 py-3 text-base transition-smooth",
                     activeItem === item.id
                       ? "bg-muted text-foreground font-medium"
                       : "text-foreground hover:bg-muted/50"
                   )}
                 >
                   <item.icon className="h-5 w-5" strokeWidth={1.5} />
                   {item.label}
                   {item.hasBadge && unreadCount > 0 && (
                     <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-foreground">
                       {unreadCount > 9 ? "9+" : unreadCount}
                     </span>
                   )}
                 </button>
               ))}
             </nav>
 
             {/* Account Button */}
             <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
               <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                 CA
               </div>
               <span className="text-base text-foreground">Cooper AI</span>
             </div>
           </div>
         </div>
       </SheetContent>
     </Sheet>
   );
 }