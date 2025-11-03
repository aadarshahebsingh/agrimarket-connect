import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, ShoppingCart, Sprout, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useMemo } from "react";
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

export default function Marketplace() {
  const { isLoading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const crops = useQuery(api.crops.getMarketplaceCrops, {
    cropType: selectedType,
  });

  const filteredAndSortedCrops = useMemo(() => {
    if (!crops) return [];

    let filtered = [...crops];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (crop) =>
          crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Health filter
    if (healthFilter === "healthy") {
      filtered = filtered.filter((crop) => crop.diseaseAnalysis?.isHealthy);
    } else if (healthFilter === "diseased") {
      filtered = filtered.filter((crop) => !crop.diseaseAnalysis?.isHealthy);
    }

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => b._creationTime - a._creationTime);
    }

    return filtered;
  }, [crops, searchQuery, healthFilter, sortBy]);

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
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
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

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by crop name, farmer, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Crop Type" />
                </SelectTrigger>
                <SelectContent>
                  {CROP_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Crops" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={healthFilter} onValueChange={setHealthFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Health Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="healthy">Healthy Only</SelectItem>
                  <SelectItem value="diseased">With Disease</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              {filteredAndSortedCrops.length} crop{filteredAndSortedCrops.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Crops Grid */}
          {!crops ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredAndSortedCrops.length === 0 ? (
            <Card className="p-12 text-center">
              <Sprout className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No crops found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCrops.map((crop) => (
                <CropCard key={crop._id} crop={crop} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}