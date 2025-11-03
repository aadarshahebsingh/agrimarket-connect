import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create order
export const createOrder = mutation({
  args: {
    cropId: v.id("crops"),
    quantity: v.number(),
    totalPrice: v.number(),
    deliveryAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const crop = await ctx.db.get(args.cropId);
    if (!crop) {
      throw new Error("Crop not found");
    }

    const orderId = await ctx.db.insert("orders", {
      customerId: user._id,
      customerName: user.name || "Anonymous Customer",
      customerEmail: user.email || "",
      farmerId: crop.farmerId,
      farmerName: crop.farmerName,
      cropId: args.cropId,
      cropName: crop.name,
      cropImage: crop.imageUrl,
      quantity: args.quantity,
      pricePerUnit: crop.pricePerUnit,
      totalPrice: args.totalPrice,
      deliveryAddress: args.deliveryAddress,
      status: "pending",
    });

    // Update crop orders count
    await ctx.db.patch(args.cropId, {
      orders: (crop.orders || 0) + 1,
    });

    return orderId;
  },
});

// Get customer orders
export const getCustomerOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", user._id))
      .collect();

    return orders;
  },
});

// Get farmer orders
export const getFarmerOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_farmer", (q) => q.eq("farmerId", user._id))
      .collect();

    return orders;
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order || order.farmerId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.orderId, {
      status: args.status,
    });
  },
});
