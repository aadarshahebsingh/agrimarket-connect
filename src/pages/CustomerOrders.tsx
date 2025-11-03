import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function CustomerOrders() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const orders = useQuery(api.orders.getCustomerOrders);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "confirmed":
        return "bg-blue-500/10 text-blue-600";
      case "shipped":
        return "bg-purple-500/10 text-purple-600";
      case "delivered":
        return "bg-green-500/10 text-green-600";
      case "cancelled":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold tracking-tight">AgriMarket</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/marketplace")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">My Orders</h2>
            <p className="text-muted-foreground">
              View all your orders and their status
            </p>
          </div>

          {!orders ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                Start shopping for fresh produce from local farmers
              </p>
              <Button onClick={() => navigate("/marketplace")}>
                Browse Marketplace
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={order.cropImage}
                        alt={order.cropName}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{order.cropName}</h4>
                            <p className="text-sm text-muted-foreground">
                              From {order.farmerName}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium">{order.quantity} units</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Price per unit</p>
                            <p className="font-medium">₹{order.pricePerUnit}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Price</p>
                            <p className="font-bold text-lg">₹{order.totalPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Order Date</p>
                            <p className="font-medium">
                              {new Date(order._creationTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-muted-foreground">Delivery Address</p>
                          <p className="text-sm">{order.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
