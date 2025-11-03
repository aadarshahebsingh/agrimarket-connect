import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Loader2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditCropDialogProps {
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
    published: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CROP_TYPES = ["Wheat", "Rice", "Corn", "Tomato", "Potato", "Onion", "Carrot", "Cabbage", "Other"];
const UNITS = ["kg", "quintal", "ton", "piece"];

export function EditCropDialog({ crop, open, onOpenChange }: EditCropDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const updateCrop = useMutation(api.crops.updateCrop);
  const deleteCrop = useMutation(api.crops.deleteCrop);

  const [formData, setFormData] = useState({
    name: crop.name,
    type: crop.type,
    imageUrl: crop.imageUrl,
    address: crop.location.address,
    harvestDate: crop.harvestDate,
    quantity: crop.quantity.toString(),
    unit: crop.unit,
    pricePerUnit: crop.pricePerUnit.toString(),
    published: crop.published,
  });

  useEffect(() => {
    setFormData({
      name: crop.name,
      type: crop.type,
      imageUrl: crop.imageUrl,
      address: crop.location.address,
      harvestDate: crop.harvestDate,
      quantity: crop.quantity.toString(),
      unit: crop.unit,
      pricePerUnit: crop.pricePerUnit.toString(),
      published: crop.published,
    });
  }, [crop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateCrop({
        cropId: crop._id,
        name: formData.name,
        type: formData.type,
        imageUrl: formData.imageUrl,
        location: {
          lat: crop.location.lat,
          lng: crop.location.lng,
          address: formData.address,
        },
        harvestDate: formData.harvestDate,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        published: formData.published,
      });

      toast.success("Crop updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update crop");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteCrop({ cropId: crop._id });
      toast.success("Crop deleted successfully!");
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete crop");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Crop</DialogTitle>
            <DialogDescription>
              Update your crop listing details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label htmlFor="published">Publish to Marketplace</Label>
                <p className="text-sm text-muted-foreground">
                  Make this crop visible to customers
                </p>
              </div>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Crop Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Crop Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Location/Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <div className="flex-1" />
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Crop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this crop? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
