import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create a new crop listing
export const createCrop = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    imageUrl: v.string(),
    images: v.optional(v.array(v.object({
      url: v.string(),
      uploadedAt: v.number(),
    }))),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
    }),
    harvestDate: v.string(),
    quantity: v.number(),
    unit: v.string(),
    pricePerUnit: v.number(),
    diseaseAnalysis: v.optional(v.object({
      diseaseName: v.optional(v.string()),
      confidence: v.optional(v.number()),
      remedy: v.optional(v.string()),
      isHealthy: v.boolean(),
    })),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const cropId = await ctx.db.insert("crops", {
      farmerId: user._id,
      farmerName: user.name || "Anonymous Farmer",
      ...args,
      views: 0,
      orders: 0,
    });

    return cropId;
  },
});

// Get all crops for a farmer
export const getFarmerCrops = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const crops = await ctx.db
      .query("crops")
      .withIndex("by_farmer", (q) => q.eq("farmerId", user._id))
      .collect();

    return crops;
  },
});

// Get all published crops for marketplace
export const getMarketplaceCrops = query({
  args: {
    cropType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("crops")
      .withIndex("by_published", (q) => q.eq("published", true));

    const crops = await query.collect();

    if (args.cropType && args.cropType !== "all") {
      return crops.filter((crop) => crop.type === args.cropType);
    }

    return crops;
  },
});

// Get single crop details
export const getCrop = query({
  args: { cropId: v.id("crops") },
  handler: async (ctx, args) => {
    const crop = await ctx.db.get(args.cropId);
    return crop;
  },
});

// Update crop
export const updateCrop = mutation({
  args: {
    cropId: v.id("crops"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    location: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
    })),
    harvestDate: v.optional(v.string()),
    quantity: v.optional(v.number()),
    unit: v.optional(v.string()),
    pricePerUnit: v.optional(v.number()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const { cropId, ...updates } = args;
    const crop = await ctx.db.get(cropId);

    if (!crop || crop.farmerId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(cropId, updates);
    return cropId;
  },
});

// Delete crop
export const deleteCrop = mutation({
  args: { cropId: v.id("crops") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const crop = await ctx.db.get(args.cropId);
    if (!crop || crop.farmerId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.cropId);
  },
});

// Increment views
export const incrementViews = mutation({
  args: { cropId: v.id("crops") },
  handler: async (ctx, args) => {
    const crop = await ctx.db.get(args.cropId);
    if (!crop) return;

    await ctx.db.patch(args.cropId, {
      views: (crop.views || 0) + 1,
    });
  },
});
