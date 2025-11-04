"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const seedCrops = internalAction({
  args: {},
  handler: async (ctx) => {
    const cropData = [
      {
        name: "Organic Wheat",
        type: "Wheat",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
        address: "Village Rampur, Meerut, Uttar Pradesh",
        quantity: 500,
        unit: "quintal",
        pricePerUnit: 2500,
      },
      {
        name: "Basmati Rice",
        type: "Rice",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
        address: "Village Kheri, Patiala, Punjab",
        quantity: 300,
        unit: "quintal",
        pricePerUnit: 4500,
      },
      {
        name: "Sweet Corn",
        type: "Corn",
        imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800",
        address: "Village Sultanpur, Karnal, Haryana",
        quantity: 200,
        unit: "quintal",
        pricePerUnit: 1800,
      },
      {
        name: "Fresh Tomatoes",
        type: "Tomato",
        imageUrl: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800",
        address: "Village Nashik, Maharashtra",
        quantity: 150,
        unit: "quintal",
        pricePerUnit: 2000,
      },
      {
        name: "Organic Potatoes",
        type: "Potato",
        imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800",
        address: "Village Agra, Uttar Pradesh",
        quantity: 400,
        unit: "quintal",
        pricePerUnit: 1200,
      },
      {
        name: "Red Onions",
        type: "Onion",
        imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800",
        address: "Village Lasalgaon, Nashik, Maharashtra",
        quantity: 250,
        unit: "quintal",
        pricePerUnit: 1500,
      },
      {
        name: "Fresh Carrots",
        type: "Carrot",
        imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800",
        address: "Village Pune, Maharashtra",
        quantity: 100,
        unit: "quintal",
        pricePerUnit: 2200,
      },
      {
        name: "Green Cabbage",
        type: "Cabbage",
        imageUrl: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800",
        address: "Village Ooty, Tamil Nadu",
        quantity: 180,
        unit: "quintal",
        pricePerUnit: 1600,
      },
      {
        name: "Golden Wheat",
        type: "Wheat",
        imageUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=800",
        address: "Village Ludhiana, Punjab",
        quantity: 600,
        unit: "quintal",
        pricePerUnit: 2400,
      },
      {
        name: "Premium Rice",
        type: "Rice",
        imageUrl: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800",
        address: "Village Thanjavur, Tamil Nadu",
        quantity: 350,
        unit: "quintal",
        pricePerUnit: 4200,
      },
      {
        name: "Yellow Corn",
        type: "Corn",
        imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800",
        address: "Village Davangere, Karnataka",
        quantity: 220,
        unit: "quintal",
        pricePerUnit: 1700,
      },
      {
        name: "Cherry Tomatoes",
        type: "Tomato",
        imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800",
        address: "Village Bangalore, Karnataka",
        quantity: 80,
        unit: "quintal",
        pricePerUnit: 3500,
      },
      {
        name: "Baby Potatoes",
        type: "Potato",
        imageUrl: "https://images.unsplash.com/photo-1552874869-5c39ec9288dc?w=800",
        address: "Village Shimla, Himachal Pradesh",
        quantity: 120,
        unit: "quintal",
        pricePerUnit: 2800,
      },
      {
        name: "White Onions",
        type: "Onion",
        imageUrl: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800",
        address: "Village Indore, Madhya Pradesh",
        quantity: 200,
        unit: "quintal",
        pricePerUnit: 1400,
      },
      {
        name: "Organic Carrots",
        type: "Carrot",
        imageUrl: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=800",
        address: "Village Dehradun, Uttarakhand",
        quantity: 90,
        unit: "quintal",
        pricePerUnit: 2500,
      },
    ];

    console.log("Starting to seed crops...");

    for (const crop of cropData) {
      const diseaseAnalysis = {
        isHealthy: Math.random() > 0.3,
        diseaseName: Math.random() > 0.3 ? undefined : "Leaf Blight",
        confidence: Math.random() > 0.3 ? undefined : 0.85,
        remedy: Math.random() > 0.3 ? undefined : "Apply fungicide and ensure proper drainage",
      };

      const harvestDate = new Date();
      harvestDate.setDate(harvestDate.getDate() + Math.floor(Math.random() * 60) + 15);

      await ctx.runMutation(internal.crops.createCropInternal, {
        name: crop.name,
        type: crop.type,
        imageUrl: crop.imageUrl,
        location: {
          lat: 28.6139 + (Math.random() - 0.5) * 5,
          lng: 77.2090 + (Math.random() - 0.5) * 5,
          address: crop.address,
        },
        harvestDate: harvestDate.toISOString().split("T")[0],
        quantity: crop.quantity,
        unit: crop.unit,
        pricePerUnit: crop.pricePerUnit,
        diseaseAnalysis,
        published: true,
        farmerName: "Demo Farmer",
      });
    }

    console.log("Seeding completed!");
    return { success: true, count: cropData.length };
  },
});
