import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, ShoppingCart, Sprout } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { CropCard } from "@/components/CropCard";

const CROP_TYPES = [
  "all",
  "Wheat",
  "Rice",
  "Corn",
  "Tomato",
  "Potato",
  "Onion",
  "Carrot",
  "Cabbage",
  "Other",
];

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹50", min: 0, max: 50 },
  { label: "₹50 - ₹100", min: 50, max: 100 },
  { label: "₹100 - ₹200", min: 100, max: 200 },
  { label: "Above ₹200", min: 200, max: Infinity },
];

export default function Marketplace() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const allCrops = useQuery(api.crops.getMarketplaceCrops, {
    cropType: selectedType,
  });

  // Filter crops based on price range and search query
  const crops = allCrops?.filter((crop) => {
    const priceRange = PRICE_RANGES[selectedPriceRange];
    const matchesPrice = crop.pricePerUnit >= priceRange.min && crop.pricePerUnit < priceRange.max;
    const matchesSearch = searchQuery === "" || 
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPrice && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold tracking-tight">AgriMarket</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/customer/orders")}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              My Orders
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Marketplace</h2>
            <p className="text-muted-foreground">
              Browse fresh crops directly from local farmers
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search crops, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Crop Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CROP_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select 
                  value={selectedPriceRange.toString()} 
                  onValueChange={(value) => setSelectedPriceRange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((range, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{crops?.length || 0} crops found</span>
              {(searchQuery || selectedType !== "all" || selectedPriceRange !== 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedPriceRange(0);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          {/* Crops Grid */}
          {!crops ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : crops.length === 0 ? (
            <Card className="p-12 text-center">
              <Sprout className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No crops available</h3>
              <p className="text-muted-foreground">
                Check back later for fresh listings from farmers
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map((crop) => (
                <CropCard key={crop._id} crop={crop} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
