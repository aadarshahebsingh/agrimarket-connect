import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";
import { MapPin, Calendar, Package, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { CropDetailsDialog } from "./CropDetailsDialog";
import { EditCropDialog } from "./EditCropDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface CropCardProps {
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
    published: boolean;
    views: number;
    orders: number;
    farmerName: string;
  };
  isFarmer?: boolean;
}

export function CropCard({ crop, isFarmer }: CropCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const updateCrop = useMutation(api.crops.updateCrop);

  const handleTogglePublish = async () => {
    try {
      await updateCrop({
        cropId: crop._id,
        published: !crop.published,
      });
      toast.success(crop.published ? "Crop unpublished" : "Crop published to marketplace!");
    } catch (error) {
      toast.error("Failed to update crop status");
      console.error(error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
          <div onClick={() => setShowDetails(true)}>
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img
                src={crop.imageUrl}
                alt={crop.name}
                className="object-cover w-full h-full"
              />
              {!crop.published && isFarmer && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  Draft
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg tracking-tight">{crop.name}</h3>
                  <p className="text-sm text-muted-foreground">{crop.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{crop.pricePerUnit}</p>
                  <p className="text-xs text-muted-foreground">per {crop.unit}</p>
                </div>
              </div>

              {/* Disease Status */}
              {crop.diseaseAnalysis && (
                <div className="mb-3">
                  {crop.diseaseAnalysis.isHealthy ? (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Healthy Crop</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        {crop.diseaseAnalysis.diseaseName || "Disease Detected"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{crop.location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Harvest: {new Date(crop.harvestDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>
                    {crop.quantity} {crop.unit} available
                  </span>
                </div>
              </div>

              {isFarmer && (
                <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{crop.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>{crop.orders} orders</span>
                  </div>
                </div>
              )}

              {!isFarmer && (
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                  By {crop.farmerName}
                </p>
              )}
            </CardContent>
          </div>

          {isFarmer && (
            <CardFooter className="p-4 pt-0 gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowEdit(true)}
              >
                Edit
              </Button>
              <Button
                variant={crop.published ? "secondary" : "default"}
                className="flex-1"
                onClick={handleTogglePublish}
              >
                {crop.published ? "Unpublish" : "Publish"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>

      <CropDetailsDialog
        crop={crop}
        open={showDetails}
        onOpenChange={setShowDetails}
        isFarmer={isFarmer}
      />

      {isFarmer && (
        <EditCropDialog
          crop={crop}
          open={showEdit}
          onOpenChange={setShowEdit}
        />
      )}
    </>
  );
}