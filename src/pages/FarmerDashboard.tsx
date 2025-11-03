import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Plus, Sprout, Package, TrendingUp, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { AddCropDialog } from "@/components/AddCropDialog";
import { CropCard } from "@/components/CropCard";

export default function FarmerDashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showAddCrop, setShowAddCrop] = useState(false);

  const crops = useQuery(api.crops.getFarmerCrops);
  const orders = useQuery(api.orders.getFarmerOrders);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role !== "farmer") {
        navigate("/marketplace");
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

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

  if (!user?.role) {
    navigate("/role-selection");
    return null;
  }

  if (user.role !== "farmer") {
    navigate("/marketplace");
    return null;
  }

  const publishedCrops = crops?.filter((c) => c.published).length || 0;
  const totalViews = crops?.reduce((sum, c) => sum + (c.views || 0), 0) || 0;
  const totalOrders = orders?.length || 0;

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
            <Button variant="outline" onClick={() => navigate("/marketplace")}>
              Marketplace
            </Button>
            <Button variant="ghost" onClick={() => navigate("/farmer/orders")}>
              Orders
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back, {user?.name || "Farmer"}
            </h2>
            <p className="text-muted-foreground">
              Manage your crops and track your sales
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Published Crops</CardTitle>
                <Sprout className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedCrops}</div>
                <p className="text-xs text-muted-foreground">
                  {crops?.length || 0} total crops
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
                <p className="text-xs text-muted-foreground">Across all crops</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
          </div>

          {/* My Crops Section */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">My Crops</h3>
              <p className="text-muted-foreground">Manage your crop listings</p>
            </div>
            <Button onClick={() => setShowAddCrop(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Crop
            </Button>
          </div>

          {/* Crops Grid */}
          {!crops ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : crops.length === 0 ? (
            <Card className="p-12 text-center">
              <Sprout className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No crops yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first crop listing
              </p>
              <Button onClick={() => setShowAddCrop(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Crop
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map((crop) => (
                <CropCard key={crop._id} crop={crop} isFarmer />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AddCropDialog open={showAddCrop} onOpenChange={setShowAddCrop} />
    </div>
  );
}