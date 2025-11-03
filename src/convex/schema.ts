import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  FARMER: "farmer",
  CUSTOMER: "customer",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.FARMER),
  v.literal(ROLES.CUSTOMER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    crops: defineTable({
      farmerId: v.id("users"),
      farmerName: v.string(),
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
      views: v.number(),
      orders: v.number(),
    })
      .index("by_farmer", ["farmerId"])
      .index("by_published", ["published"]),

    orders: defineTable({
      customerId: v.id("users"),
      customerName: v.string(),
      customerEmail: v.string(),
      farmerId: v.id("users"),
      farmerName: v.string(),
      cropId: v.id("crops"),
      cropName: v.string(),
      cropImage: v.string(),
      quantity: v.number(),
      pricePerUnit: v.number(),
      totalPrice: v.number(),
      deliveryAddress: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("shipped"),
        v.literal("delivered"),
        v.literal("cancelled")
      ),
    })
      .index("by_customer", ["customerId"])
      .index("by_farmer", ["farmerId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;