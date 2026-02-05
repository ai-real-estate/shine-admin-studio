 import { useState, useEffect, useRef, useCallback } from "react";
 import { useIsMobile } from "@/hooks/use-mobile";
 import { useHaptic } from "@/hooks/use-haptic";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Paperclip, Palette, ChevronDown, ArrowUp, AudioLines, Camera, FolderPlus, Github, Search, Globe, Brush, Blocks } from "lucide-react";
import {
  DEFAULT_MOCK_PROFILE,
  getLocationSlangGreeting,
  getTimeOfDayGreeting,
  matchLocationFromCoords,
} from "@/lib/greeting";

interface PromptChatWindowProps {
  userName?: string;
  onSubmit?: (prompt: string) => void;
}

interface HintChip {
  label: string;
  basePrompt: string;
  locations?: string[];
}

interface MockUserProfile {
  firstName: string;
  location?: string;
}

const MOCK_PROFILE_KEY = "shine.mockUserProfile";

const HINT_CHIPS: HintChip[] = [
  { 
    label: "Find Property", 
    basePrompt: "Find 1 bedroom property in Dubai ",
    locations: ["Downtown", "Marina", "Creek Harbour"]
  },
  { label: "Property valuation", basePrompt: "Property valuation" },
  { label: "Undervalued", basePrompt: "Find undervalued properties" },
  { label: "Generate listing", basePrompt: "Generate listing" },
  { 
    label: "Avg rent", 
    basePrompt: "Avg rent ",
    locations: ["Miami", "London", "Tokio"]
  },
  { 
    label: "Rental analytics", 
    basePrompt: "Rental analytics in ",
    locations: ["Kyiv", "Paris", "Warsaw", "Berlin"]
  },
  { 
    label: "Find distress", 
    basePrompt: "Find distress ",
    locations: ["Abu Dhabi", "Sydney", "Barcelona"]
  },
  { 
    label: "Find agent", 
    basePrompt: "Find agent in ",
    locations: ["Los Angeles", "Austin", "Chicago"]
  },
];

export const PromptChatWindow = ({ userName = "there", onSubmit }: PromptChatWindowProps) => {
   const isMobile = useIsMobile();
   const haptic = useHaptic();
  const readMockProfile = (): MockUserProfile => {
    if (typeof window === "undefined") {
      return {
        ...DEFAULT_MOCK_PROFILE,
        firstName: userName || DEFAULT_MOCK_PROFILE.firstName,
      };
    }

    try {
      const rawProfile = window.localStorage.getItem(MOCK_PROFILE_KEY);
      if (!rawProfile) {
        window.localStorage.setItem(
          MOCK_PROFILE_KEY,
          JSON.stringify(DEFAULT_MOCK_PROFILE),
        );
        return DEFAULT_MOCK_PROFILE;
      }

      let parsed: Partial<MockUserProfile> | null = null;
      try {
        parsed = JSON.parse(rawProfile) as Partial<MockUserProfile> | null;
      } catch {
        window.localStorage.setItem(
          MOCK_PROFILE_KEY,
          JSON.stringify(DEFAULT_MOCK_PROFILE),
        );
        return DEFAULT_MOCK_PROFILE;
      }
      const firstName =
        typeof parsed?.firstName === "string" && parsed.firstName.trim().length > 0
          ? parsed.firstName.trim()
          : DEFAULT_MOCK_PROFILE.firstName;
      const location =
        typeof parsed?.location === "string" && parsed.location.trim().length > 0
          ? parsed.location.trim()
          : DEFAULT_MOCK_PROFILE.location;
      const cleanedProfile = { firstName, location };

      if (
        parsed?.firstName !== cleanedProfile.firstName ||
        parsed?.location !== cleanedProfile.location
      ) {
        window.localStorage.setItem(
          MOCK_PROFILE_KEY,
          JSON.stringify(cleanedProfile),
        );
      }

      return cleanedProfile;
    } catch {
      return {
        ...DEFAULT_MOCK_PROFILE,
        firstName: userName || DEFAULT_MOCK_PROFILE.firstName,
      };
    }
  };

  const persistMockProfile = (profile: MockUserProfile) => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore localStorage failures.
    }
  };

  const computeGreeting = (profile: MockUserProfile) => {
    const resolvedName = profile.firstName?.trim() || userName || "there";
    const slangGreeting = getLocationSlangGreeting(resolvedName, profile.location);
    if (slangGreeting) {
      return slangGreeting;
    }
    return getTimeOfDayGreeting(
      resolvedName,
      new Date().getHours(),
      Boolean(profile.location),
    );
  };

  const [prompt, setPrompt] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [profile, setProfile] = useState<MockUserProfile>(() => readMockProfile());
  const [greeting, setGreeting] = useState(() => computeGreeting(profile));
  const profileRef = useRef<MockUserProfile>(profile);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    profileRef.current = profile;
    setGreeting(computeGreeting(profile));
  }, [profile, userName]);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return;
    }

    let didCancel = false;

    const handleSuccess = (position: GeolocationPosition) => {
      if (didCancel) {
        return;
      }
      const matchedLocation = matchLocationFromCoords(
        position.coords.latitude,
        position.coords.longitude,
      );
      if (!matchedLocation) {
        return;
      }
      const currentProfile = profileRef.current;
      if (
        currentProfile.location?.toLowerCase() === matchedLocation.toLowerCase()
      ) {
        return;
      }
      const updatedProfile = {
        ...currentProfile,
        location: matchedLocation,
      };
      profileRef.current = updatedProfile;
      setProfile(updatedProfile);
      persistMockProfile(updatedProfile);
    };

    const requestLocation = () => {
      navigator.geolocation.getCurrentPosition(handleSuccess, undefined, {
        timeout: 8000,
      });
    };

    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((status) => {
          if (status.state === "granted" || status.state === "prompt") {
            requestLocation();
          }
        })
        .catch(() => {
          requestLocation();
        });
    } else {
      requestLocation();
    }

    return () => {
      didCancel = true;
    };
  }, []);

  const handleSubmit = () => {
    if (prompt.trim() && onSubmit && !isAnimating) {
       haptic.medium();
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const typeText = (text: string, currentIndex: number, callback: () => void) => {
    if (currentIndex <= text.length) {
      setPrompt(text.substring(0, currentIndex));
      animationRef.current = setTimeout(() => {
        typeText(text, currentIndex + 1, callback);
      }, 50);
    } else {
      callback();
    }
  };

  const untypeText = (text: string, baseLength: number, callback: () => void) => {
    const currentLength = text.length;
    if (currentLength > baseLength) {
      setPrompt(text.substring(0, currentLength - 1));
      animationRef.current = setTimeout(() => {
        untypeText(text.substring(0, currentLength - 1), baseLength, callback);
      }, 30);
    } else {
      callback();
    }
  };

  const animateLocations = (basePrompt: string, locations: string[], locationIndex: number) => {
    if (locationIndex >= locations.length) {
      // Cycle back to first location
      animationRef.current = setTimeout(() => {
        untypeText(basePrompt + locations[locations.length - 1], basePrompt.length, () => {
          animateLocations(basePrompt, locations, 0);
        });
      }, 3000);
      return;
    }

    const fullText = basePrompt + locations[locationIndex];
    
    typeText(fullText, basePrompt.length, () => {
      animationRef.current = setTimeout(() => {
        if (locationIndex < locations.length - 1) {
          untypeText(fullText, basePrompt.length, () => {
            animationRef.current = setTimeout(() => {
              animateLocations(basePrompt, locations, locationIndex + 1);
            }, 500);
          });
        } else {
          // After last location, wait then start cycle again
          animationRef.current = setTimeout(() => {
            untypeText(fullText, basePrompt.length, () => {
              animationRef.current = setTimeout(() => {
                animateLocations(basePrompt, locations, 0);
              }, 500);
            });
          }, 3000);
        }
      }, 3000);
    });
  };

   const handleChipClick = useCallback((chip: HintChip) => {
     haptic.selection();
     
    // Stop any current animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    setIsAnimating(true);
    setPrompt("");
    
    if (chip.locations && chip.locations.length > 0) {
      // Type base prompt first, then animate locations
      typeText(chip.basePrompt, 0, () => {
        animateLocations(chip.basePrompt, chip.locations!, 0);
      });
    } else {
      // Just type the base prompt
      typeText(chip.basePrompt, 0, () => {
        setIsAnimating(false);
      });
    }
    
    textareaRef.current?.focus();
   }, [haptic]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // If user starts typing, stop animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      setIsAnimating(false);
    }
    setPrompt(e.target.value);
  };

  return (
     <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 pb-6">
      {/* Greeting */}
       <h1 className="text-2xl md:text-4xl font-semibold text-foreground mb-6 md:mb-8 text-center">
        {greeting}
      </h1>

      {/* Input Card */}
       <div className={`w-full border border-border bg-card shadow-soft overflow-hidden ${isMobile ? "mx-2 rounded-lg" : "rounded-2xl"}`}>
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask to create a dashboard to..."
          className="border-0 bg-transparent resize-none min-h-[100px] focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-4 py-4"
        />

        {/* Toolbar */}
         <div className="flex items-center justify-between px-3 py-3 border-t border-border/50 flex-wrap gap-2">
          {/* Left side buttons */}
           <div className="flex items-center gap-1 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground rounded-full bg-muted/50 hover:bg-muted">
                  <Plus className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem className="gap-3">
                  <Paperclip className="h-4 w-4" />
                  <span>Add files or photos</span>
                  <span className="ml-auto text-xs text-muted-foreground">⌘U</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3">
                  <Camera className="h-4 w-4" />
                  <span>Take a screenshot</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3">
                  <FolderPlus className="h-4 w-4" />
                  <span>Add to project</span>
                  <ChevronDown className="ml-auto h-4 w-4 -rotate-90" />
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3">
                  <Github className="h-4 w-4" />
                  <span>Add from GitHub</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-3">
                  <Search className="h-4 w-4" />
                  <span>Research</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3 text-primary">
                  <Globe className="h-4 w-4" />
                  <span>Web search</span>
                  <span className="ml-auto text-primary">✓</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3">
                  <Brush className="h-4 w-4" />
                  <span>Use style</span>
                  <ChevronDown className="ml-auto h-4 w-4 -rotate-90" />
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3">
                  <Blocks className="h-4 w-4" />
                  <span>Connectors</span>
                  <ChevronDown className="ml-auto h-4 w-4 -rotate-90" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

             <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5 hidden md:flex">
              <Paperclip className="h-4 w-4" />
              <span className="text-sm">Attach</span>
            </Button>

             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1 hidden md:flex">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm">Theme</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Light</DropdownMenuItem>
                <DropdownMenuItem>Dark</DropdownMenuItem>
                <DropdownMenuItem>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hidden md:flex">
              <span className="text-sm">Plan</span>
            </Button>

            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
              <AudioLines className="h-5 w-5" />
            </Button>

            <Button 
              size="icon-sm" 
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              onClick={handleSubmit}
              disabled={!prompt.trim() || isAnimating}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hint Chips */}
       <div className="flex flex-wrap items-center justify-center gap-2 mt-4 px-2">
        {HINT_CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleChipClick(chip)}
             className="px-3 py-1.5 text-sm rounded-full border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card hover:border-foreground/20 transition-all duration-200 active:scale-95"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
