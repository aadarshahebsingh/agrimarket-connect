import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CheckoutDialogProps {
  crop: {
    _id: Id<"crops">;
    name: string;
    pricePerUnit: number;
    unit: string;
    quantity: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutDialog({ crop, open, onOpenChange }: CheckoutDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [address, setAddress] = useState("");
  const createOrder = useMutation(api.orders.createOrder);

  const totalPrice = parseFloat(quantity || "0") * crop.pricePerUnit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const qty = parseFloat(quantity);
      if (qty <= 0 || qty > crop.quantity) {
        toast.error("Invalid quantity");
        setIsLoading(false);
        return;
      }

      await createOrder({
        cropId: crop._id,
        quantity: qty,
        totalPrice,
        deliveryAddress: address,
      });

      toast.success("Order placed successfully!");
      onOpenChange(false);
      setQuantity("1");
      setAddress("");
    } catch (error) {
      toast.error("Failed to place order");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            Enter delivery details to complete your purchase
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-lg border bg-muted/50">
            <h3 className="font-semibold mb-2">{crop.name}</h3>
            <p className="text-sm text-muted-foreground">
              ₹{crop.pricePerUnit} per {crop.unit}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              Quantity ({crop.unit}) *
            </Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              min="0.01"
              max={crop.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Max available: {crop.quantity} {crop.unit}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete delivery address"
              rows={3}
              required
            />
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
