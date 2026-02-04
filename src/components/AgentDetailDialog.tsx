import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Home,
  MessageCircle,
  Calendar,
} from "lucide-react";
import type { Agent, AgentListing } from "./AgentGrid";

interface AgentDetailDialogProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  return `$${(price / 1000).toFixed(0)}K`;
};

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
    <div className="p-2 rounded-full bg-primary/10">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const ListingCard = ({ listing }: { listing: AgentListing }) => (
  <div className="rounded-lg border border-border overflow-hidden bg-card hover:border-primary/30 transition-colors cursor-pointer">
    <div className="relative aspect-[16/10]">
      <img
        src={listing.image}
        alt={listing.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 right-2">
        <Badge className="bg-card/90 text-foreground">{formatPrice(listing.price)}</Badge>
      </div>
    </div>
    <div className="p-3">
      <h4 className="font-medium text-sm truncate">{listing.title}</h4>
      <p className="text-xs text-muted-foreground truncate">{listing.address}</p>
      {listing.beds > 0 && (
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span>{listing.beds} beds</span>
          <span>{listing.baths} baths</span>
          <span>{listing.sqft.toLocaleString()} sqft</span>
        </div>
      )}
    </div>
  </div>
);

export const AgentDetailDialog = ({
  agent,
  open,
  onOpenChange,
}: AgentDetailDialogProps) => {
  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <ScrollArea className="max-h-[90vh]">
          {/* Header with city image */}
          <div className="relative h-48">
            <img
              src={agent.cityImage}
              alt={agent.city}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div className="flex items-end gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback className="text-xl">
                    {agent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white mb-1">
                  <h2 className="text-2xl font-bold">{agent.name}</h2>
                  <p className="text-white/80">
                    {agent.title} at {agent.company}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white mb-1">
                <MapPin className="h-4 w-4" />
                <span>{agent.city}</span>
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="p-6 space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={Star}
                label="Rating"
                value={`${agent.rating} (${agent.reviews} reviews)`}
              />
              <StatCard icon={Clock} label="Experience" value={agent.experience} />
              <StatCard icon={Home} label="Listings" value={agent.listings.length} />
              <StatCard icon={Award} label="Specialty" value={agent.badge} />
            </div>

            {/* Contact info */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{agent.email}</span>
              </div>
            </div>

            <Separator />

            {/* Bio */}
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground leading-relaxed">{agent.bio}</p>
            </div>

            {/* Specializations */}
            <div>
              <h3 className="font-semibold mb-2">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {agent.specializations.map((spec) => (
                  <Badge key={spec} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-2">Services</h3>
              <div className="flex flex-wrap gap-2">
                {agent.services.map((service) => (
                  <Badge key={service} variant="outline">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Listings */}
            {agent.listings.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Current Listings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agent.listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            )}

            {/* Contact buttons */}
            <div className="flex gap-3 pt-2">
              <Button className="flex-1 gap-2">
                <MessageCircle className="h-4 w-4" />
                Contact Agent
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Call
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
