import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CROP_TYPES = ["Wheat", "Rice", "Corn", "Tomato", "Potato", "Onion", "Carrot", "Cabbage", "Other"];
const UNITS = ["kg", "quintal", "ton", "piece"];

export function AddCropDialog({ open, onOpenChange }: AddCropDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createCrop = useMutation(api.crops.createCrop);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    imageUrl: "",
    address: "",
    harvestDate: "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock disease analysis (in production, this would call Gemini API)
      const diseaseAnalysis = {
        isHealthy: Math.random() > 0.3,
        diseaseName: Math.random() > 0.3 ? undefined : "Leaf Blight",
        confidence: Math.random() > 0.3 ? undefined : 0.85,
        remedy: Math.random() > 0.3 ? undefined : "Apply fungicide and ensure proper drainage",
      };

      await createCrop({
        name: formData.name,
        type: formData.type,
        imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
        location: {
          lat: 28.6139 + (Math.random() - 0.5) * 0.1,
          lng: 77.2090 + (Math.random() - 0.5) * 0.1,
          address: formData.address,
        },
        harvestDate: formData.harvestDate,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        diseaseAnalysis,
        published: false,
      });

      toast.success("Crop added successfully!");
      onOpenChange(false);
      setFormData({
        name: "",
        type: "",
        imageUrl: "",
        address: "",
        harvestDate: "",
        quantity: "",
        unit: "kg",
        pricePerUnit: "",
      });
    } catch (error) {
      toast.error("Failed to add crop");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Crop</DialogTitle>
          <DialogDescription>
            Add a new crop listing with details and images
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Crop Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Organic Wheat"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Crop Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {CROP_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for default image
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Location/Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., Village Name, District, State"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="harvestDate">Expected Harvest Date *</Label>
            <Input
              id="harvestDate"
              type="date"
              value={formData.harvestDate}
              onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerUnit">Price per Unit (₹) *</Label>
            <Input
              id="pricePerUnit"
              type="number"
              step="0.01"
              value={formData.pricePerUnit}
              onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
              placeholder="50"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
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
                  Adding...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Add Crop
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
