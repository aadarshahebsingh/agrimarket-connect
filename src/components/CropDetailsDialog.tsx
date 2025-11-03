import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";
import { MapPin, Calendar, Package, AlertCircle, CheckCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { CheckoutDialog } from "./CheckoutDialog";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

interface CropDetailsDialogProps {
  crop: {
    _id: Id<"crops">;
    name: string;
    type: string;
    imageUrl: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    harvestDate: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    diseaseAnalysis?: {
      diseaseName?: string;
      confidence?: number;
      remedy?: string;
      isHealthy: boolean;
    };
    farmerName: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFarmer?: boolean;
}

export function CropDetailsDialog({ crop, open, onOpenChange, isFarmer }: CropDetailsDialogProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const incrementViews = useMutation(api.crops.incrementViews);

  useEffect(() => {
    if (open && !isFarmer) {
      incrementViews({ cropId: crop._id });
    }
  }, [open, isFarmer]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{crop.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
              <img
                src={crop.imageUrl}
                alt={crop.name}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <Badge variant="secondary">{crop.type}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-2xl font-bold">
                  ₹{crop.pricePerUnit} <span className="text-sm font-normal">per {crop.unit}</span>
                </p>
              </div>
            </div>

            {crop.diseaseAnalysis && (
              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Health Analysis</h3>
                {crop.diseaseAnalysis.isHealthy ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-600">Healthy Crop</p>
                      <p className="text-sm text-muted-foreground">
                        No diseases detected. Crop is in good condition.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-orange-600">
                          {crop.diseaseAnalysis.diseaseName || "Disease Detected"}
                        </p>
                        {crop.diseaseAnalysis.confidence && (
                          <p className="text-sm text-muted-foreground">
                            Confidence: {(crop.diseaseAnalysis.confidence * 100).toFixed(0)}%
                          </p>
                        )}
                      </div>
                      {crop.diseaseAnalysis.remedy && (
                        <div>
                          <p className="text-sm font-medium">Recommended Action:</p>
                          <p className="text-sm text-muted-foreground">
                            {crop.diseaseAnalysis.remedy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{crop.location.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Expected Harvest</p>
                  <p className="font-medium">
                    {new Date(crop.harvestDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Available Quantity</p>
                  <p className="font-medium">
                    {crop.quantity} {crop.unit}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Farmer</p>
                <p className="font-medium">{crop.farmerName}</p>
              </div>
            </div>

            {!isFarmer && (
              <Button className="w-full" size="lg" onClick={() => setShowCheckout(true)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {!isFarmer && (
        <CheckoutDialog
          crop={crop}
          open={showCheckout}
          onOpenChange={setShowCheckout}
        />
      )}
    </>
  );
}
