import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LayoutGrid, Map, List, Plus, Star, MapPin } from "lucide-react";
import { AgentDetailDialog } from "./AgentDetailDialog";

export interface AgentListing {
  id: string;
  title: string;
  address: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  company: string;
  companyLogo?: string;
  avatar: string;
  cityImage: string;
  city: string;
  badge: "Residential" | "Commercial" | "Luxury" | "Investment";
  rating: number;
  reviews: number;
  experience: string;
  phone: string;
  email: string;
  bio: string;
  specializations: string[];
  services: string[];
  listings: AgentListing[];
  coordinates: { x: number; y: number };
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    title: "Senior Real Estate Agent",
    company: "Coldwell Banker",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    cityImage: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop",
    city: "Los Angeles",
    badge: "Luxury",
    rating: 4.9,
    reviews: 127,
    experience: "12 years",
    phone: "(310) 555-0123",
    email: "sarah.mitchell@coldwellbanker.com",
    bio: "Specializing in luxury properties across Los Angeles, I bring over a decade of experience helping clients find their dream homes. My deep knowledge of the LA market and commitment to personalized service has earned me recognition as a top producer.",
    specializations: ["Luxury Homes", "Beachfront Properties", "Celebrity Estates"],
    services: ["Buyer Representation", "Seller Representation", "Market Analysis", "Property Staging"],
    listings: [
      { id: "l1", title: "Modern Hollywood Hills Villa", address: "1234 Sunset Blvd, LA", price: 4500000, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop", beds: 5, baths: 4, sqft: 4200 },
      { id: "l2", title: "Santa Monica Ocean View", address: "567 Pacific Ave, Santa Monica", price: 3200000, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop", beds: 4, baths: 3, sqft: 3100 },
    ],
    coordinates: { x: 20, y: 35 },
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "Commercial Real Estate Specialist",
    company: "CBRE",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    cityImage: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&h=600&fit=crop",
    city: "Austin",
    badge: "Commercial",
    rating: 4.8,
    reviews: 89,
    experience: "8 years",
    phone: "(512) 555-0456",
    email: "michael.chen@cbre.com",
    bio: "As Austin's commercial real estate market continues to boom, I help businesses find the perfect spaces to grow. From tech startups to established corporations, I specialize in office, retail, and mixed-use properties.",
    specializations: ["Office Space", "Retail Properties", "Tech Campus"],
    services: ["Lease Negotiation", "Investment Analysis", "Tenant Representation", "Site Selection"],
    listings: [
      { id: "l3", title: "Downtown Austin Office Tower", address: "100 Congress Ave, Austin", price: 12000000, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop", beds: 0, baths: 0, sqft: 45000 },
      { id: "l4", title: "South Congress Retail Space", address: "1500 S Congress, Austin", price: 2800000, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop", beds: 0, baths: 0, sqft: 8500 },
    ],
    coordinates: { x: 45, y: 55 },
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    title: "Residential Sales Expert",
    company: "Keller Williams",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    cityImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop",
    city: "Chicago",
    badge: "Residential",
    rating: 4.7,
    reviews: 156,
    experience: "15 years",
    phone: "(312) 555-0789",
    email: "emily.rodriguez@kw.com",
    bio: "Born and raised in Chicago, I know every neighborhood intimately. Whether you're looking for a Gold Coast condo or a Lincoln Park brownstone, I'll help you navigate the diverse Chicago real estate landscape with confidence.",
    specializations: ["Condos", "Single Family Homes", "Historic Properties"],
    services: ["First-Time Buyer Guidance", "Relocation Services", "Home Valuation", "Neighborhood Tours"],
    listings: [
      { id: "l5", title: "Gold Coast Luxury Condo", address: "1000 N Lake Shore Dr, Chicago", price: 1850000, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop", beds: 3, baths: 2, sqft: 2200 },
      { id: "l6", title: "Lincoln Park Brownstone", address: "2345 N Halsted, Chicago", price: 1450000, image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop", beds: 4, baths: 3, sqft: 2800 },
    ],
    coordinates: { x: 70, y: 25 },
  },
  {
    id: "4",
    name: "James Thompson",
    title: "Investment Property Advisor",
    company: "Marcus & Millichap",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    cityImage: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop",
    city: "Los Angeles",
    badge: "Investment",
    rating: 4.9,
    reviews: 203,
    experience: "20 years",
    phone: "(310) 555-0321",
    email: "james.thompson@marcusmillichap.com",
    bio: "With two decades in investment real estate, I help investors build and optimize their portfolios. My expertise spans multi-family, mixed-use, and development opportunities across Southern California.",
    specializations: ["Multi-Family", "1031 Exchanges", "Development Sites"],
    services: ["Portfolio Analysis", "Cap Rate Optimization", "Investment Strategy", "Due Diligence"],
    listings: [
      { id: "l7", title: "12-Unit Apartment Complex", address: "456 Venice Blvd, LA", price: 6500000, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop", beds: 24, baths: 12, sqft: 12000 },
    ],
    coordinates: { x: 25, y: 45 },
  },
  {
    id: "5",
    name: "Lisa Park",
    title: "Luxury Home Specialist",
    company: "Sotheby's International",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    cityImage: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&h=600&fit=crop",
    city: "Austin",
    badge: "Luxury",
    rating: 4.8,
    reviews: 94,
    experience: "10 years",
    phone: "(512) 555-0654",
    email: "lisa.park@sothebys.com",
    bio: "Representing Austin's most discerning buyers and sellers, I specialize in luxury estates and architecturally significant homes. My global network and white-glove service ensure an exceptional experience.",
    specializations: ["Estate Homes", "Modern Architecture", "Waterfront Properties"],
    services: ["Private Showings", "International Marketing", "Concierge Services", "Art Advisory"],
    listings: [
      { id: "l8", title: "Lake Austin Estate", address: "100 Scenic Dr, Austin", price: 8900000, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop", beds: 6, baths: 7, sqft: 9500 },
      { id: "l9", title: "Westlake Modern Masterpiece", address: "789 Westlake Dr, Austin", price: 5200000, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop", beds: 5, baths: 5, sqft: 6200 },
    ],
    coordinates: { x: 50, y: 45 },
  },
  {
    id: "6",
    name: "David Williams",
    title: "First-Time Buyer Specialist",
    company: "RE/MAX",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    cityImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop",
    city: "Chicago",
    badge: "Residential",
    rating: 4.6,
    reviews: 78,
    experience: "6 years",
    phone: "(312) 555-0987",
    email: "david.williams@remax.com",
    bio: "I'm passionate about helping first-time buyers achieve their homeownership dreams. My patient, educational approach demystifies the buying process and empowers clients to make confident decisions.",
    specializations: ["First-Time Buyers", "Starter Homes", "FHA/VA Loans"],
    services: ["Buyer Education", "Financing Guidance", "Negotiation", "Closing Support"],
    listings: [
      { id: "l10", title: "Wicker Park 2BR Condo", address: "1800 W Division, Chicago", price: 425000, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop", beds: 2, baths: 1, sqft: 1100 },
      { id: "l11", title: "Logan Square Townhome", address: "2500 N Milwaukee, Chicago", price: 575000, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop", beds: 3, baths: 2, sqft: 1600 },
    ],
    coordinates: { x: 75, y: 35 },
  },
];

const getBadgeColor = (badge: Agent["badge"]) => {
  switch (badge) {
    case "Luxury":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "Commercial":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "Investment":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "Residential":
    default:
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
  }
};

export const AgentGrid = () => {
  const [viewMode, setViewMode] = useState<"grid" | "map" | "table">("grid");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setDialogOpen(true);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
      {mockAgents.map((agent) => (
        <div
          key={agent.id}
          onClick={() => handleAgentClick(agent)}
          className="relative overflow-hidden rounded-lg border border-border/50 bg-card cursor-pointer group hover:border-primary/30 transition-all duration-200"
        >
          {/* Full-card background image */}
          <div className="relative aspect-[4/3]">
            <img
              src={agent.cityImage}
              alt={agent.city}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              {/* Top section - Name and Badge */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                  <p className="text-sm text-white/80 uppercase tracking-wide">
                    {agent.title}
                  </p>
                </div>
                <Badge className={`${getBadgeColor(agent.badge)} border`}>
                  {agent.badge}
                </Badge>
              </div>

              {/* Bottom section - Avatar and Actions */}
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 border-2 border-white">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <p className="text-sm font-medium">{agent.company}</p>
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <MapPin className="h-3 w-3" />
                      {agent.city}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full bg-white/90 text-foreground hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgentClick(agent);
                    }}
                  >
                    More info
                  </Button> */}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/90 text-foreground hover:bg-white h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMapView = () => (
    <div className="relative h-full min-h-[500px] bg-muted/30">
      {/* Simple map placeholder with markers */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/40">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=800&fit=crop"
          alt="Map"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Agent markers */}
      {mockAgents.map((agent) => (
        <div
          key={agent.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
          style={{ left: `${agent.coordinates.x}%`, top: `${agent.coordinates.y}%` }}
          onClick={() => handleAgentClick(agent)}
        >
          <div className="relative">
            <Avatar className="h-12 w-12 border-3 border-white shadow-lg group-hover:scale-110 transition-transform">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback>
                {agent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white" />
          </div>

          {/* Hover tooltip */}
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-card rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            <p className="font-semibold text-sm">{agent.name}</p>
            <p className="text-xs text-muted-foreground">{agent.city}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAgents.map((agent) => (
            <TableRow
              key={agent.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleAgentClick(agent)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.title}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{agent.company}</TableCell>
              <TableCell>{agent.city}</TableCell>
              <TableCell>
                <Badge className={`${getBadgeColor(agent.badge)} border`}>
                  {agent.badge}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{agent.rating}</span>
                  <span className="text-muted-foreground text-xs">
                    ({agent.reviews})
                  </span>
                </div>
              </TableCell>
              <TableCell>{agent.experience}</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-md font-semibold text-foreground">Real Estate Agents</h1>
          <p className="text-sm text-muted-foreground">
            {mockAgents.length} agents found
          </p>
        </div>
        <div className="flex items-center rounded-lg border border-border bg-card p-1 gap-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="gap-1.5"
          >
            <LayoutGrid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("map")}
            className="gap-1.5"
          >
            <Map className="h-4 w-4" />
            Map
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="gap-1.5"
          >
            <List className="h-4 w-4" />
            Table
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {viewMode === "grid" && renderGridView()}
        {viewMode === "map" && renderMapView()}
        {viewMode === "table" && renderTableView()}
      </ScrollArea>

      {/* Agent Detail Dialog */}
      <AgentDetailDialog
        agent={selectedAgent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};
