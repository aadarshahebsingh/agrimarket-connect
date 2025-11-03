import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Sprout, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

export default function RoleSelection() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const setUserRole = useMutation(api.users.setUserRole);

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

  if (user?.role) {
    // User already has a role, redirect to appropriate dashboard
    if (user.role === "farmer") {
      navigate("/farmer/dashboard");
    } else {
      navigate("/marketplace");
    }
    return null;
  }

  const handleRoleSelection = async (role: "farmer" | "customer") => {
    setIsUpdating(true);
    try {
      await setUserRole({ role });
      toast.success(`Welcome as a ${role}!`);
      
      if (role === "farmer") {
        navigate("/farmer/dashboard");
      } else {
        navigate("/marketplace");
      }
    } catch (error) {
      toast.error("Failed to set role");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Choose Your Role</h1>
          <p className="text-muted-foreground">
            Select how you'd like to use AgriMarket
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => !isUpdating && handleRoleSelection("farmer")}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8" />
              </div>
              <CardTitle>I'm a Farmer</CardTitle>
              <CardDescription>
                List and sell your crops directly to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Upload crop listings with photos</li>
                <li>• AI-powered disease detection</li>
                <li>• Track views and orders</li>
                <li>• Manage your inventory</li>
              </ul>
              <Button className="w-full" disabled={isUpdating} onClick={(e) => {
                e.stopPropagation();
                handleRoleSelection("farmer");
              }}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue as Farmer"}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => !isUpdating && handleRoleSelection("customer")}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <CardTitle>I'm a Customer</CardTitle>
              <CardDescription>
                Buy fresh crops directly from local farmers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Browse fresh produce</li>
                <li>• Filter by type and health status</li>
                <li>• View detailed crop information</li>
                <li>• Easy checkout process</li>
              </ul>
              <Button className="w-full" disabled={isUpdating} onClick={(e) => {
                e.stopPropagation();
                handleRoleSelection("customer");
              }}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue as Customer"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
