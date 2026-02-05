 import { Menu, ChevronDown, Ghost } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { useHaptic } from "@/hooks/use-haptic";
 
 interface MobileHeaderProps {
   onMenuClick: () => void;
 }
 
 export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
   const haptic = useHaptic();
 
   const handleMenuClick = () => {
     haptic.light();
     onMenuClick();
   };
 
   return (
     <header className="flex items-center justify-between px-4 py-3 bg-background">
       {/* Hamburger menu button */}
       <Button
         variant="ghost"
         size="icon"
         onClick={handleMenuClick}
         className="h-12 w-12 rounded-full bg-card border border-border shadow-sm"
       >
         <Menu className="h-5 w-5 text-foreground" strokeWidth={1.5} />
       </Button>
 
       {/* Center title with dropdown */}
       <Button
         variant="ghost"
         className="flex items-center gap-1 text-foreground font-medium"
       >
         <span>Estatio</span>
         <ChevronDown className="h-4 w-4" />
       </Button>
 
       {/* Right icon button */}
       <Button
         variant="ghost"
         size="icon"
         className="h-12 w-12 rounded-full bg-card border border-border shadow-sm"
       >
         <Ghost className="h-5 w-5 text-foreground" strokeWidth={1.5} />
       </Button>
     </header>
   );
 }