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
        isHealthy: true,
      },
      {
        name: "Basmati Rice",
        type: "Rice",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
        address: "Village Kheri, Patiala, Punjab",
        quantity: 300,
        unit: "quintal",
        pricePerUnit: 4500,
        isHealthy: true,
      },
      {
        name: "Sweet Corn",
        type: "Corn",
        imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800",
        address: "Village Sultanpur, Karnal, Haryana",
        quantity: 200,
        unit: "quintal",
        pricePerUnit: 1800,
        isHealthy: true,
      },
      {
        name: "Fresh Tomatoes",
        type: "Tomato",
        imageUrl: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800",
        address: "Village Nashik, Maharashtra",
        quantity: 150,
        unit: "quintal",
        pricePerUnit: 2000,
        isHealthy: true,
      },
      {
        name: "Organic Potatoes",
        type: "Potato",
        imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800",
        address: "Village Agra, Uttar Pradesh",
        quantity: 400,
        unit: "quintal",
        pricePerUnit: 1200,
        isHealthy: true,
      },
      {
        name: "Red Onions",
        type: "Onion",
        imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800",
        address: "Village Lasalgaon, Nashik, Maharashtra",
        quantity: 250,
        unit: "quintal",
        pricePerUnit: 1500,
        isHealthy: true,
      },
      {
        name: "Fresh Carrots",
        type: "Carrot",
        imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800",
        address: "Village Pune, Maharashtra",
        quantity: 100,
        unit: "quintal",
        pricePerUnit: 2200,
        isHealthy: true,
      },
      {
        name: "Green Cabbage",
        type: "Cabbage",
        imageUrl: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800",
        address: "Village Ooty, Tamil Nadu",
        quantity: 180,
        unit: "quintal",
        pricePerUnit: 1600,
        isHealthy: true,
      },
      {
        name: "Infected Wheat Crop",
        type: "Wheat",
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
        address: "Village Ludhiana, Punjab",
        quantity: 600,
        unit: "quintal",
        pricePerUnit: 1800,
        isHealthy: false,
      },
      {
        name: "Diseased Wheat",
        type: "Wheat",
        imageUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800",
        address: "Village Meerut, Uttar Pradesh",
        quantity: 400,
        unit: "quintal",
        pricePerUnit: 1600,
        isHealthy: false,
      },
      {
        name: "Premium Rice",
        type: "Rice",
        imageUrl: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800",
        address: "Village Thanjavur, Tamil Nadu",
        quantity: 350,
        unit: "quintal",
        pricePerUnit: 4200,
        isHealthy: true,
      },
      {
        name: "Infected Corn",
        type: "Corn",
        imageUrl: "https://images.unsplash.com/photo-1633436375096-2b2cd9926c7e?w=800",
        address: "Village Davangere, Karnataka",
        quantity: 220,
        unit: "quintal",
        pricePerUnit: 1400,
        isHealthy: false,
      },
      {
        name: "Healthy Yellow Corn",
        type: "Corn",
        imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800",
        address: "Village Bangalore, Karnataka",
        quantity: 280,
        unit: "quintal",
        pricePerUnit: 1900,
        isHealthy: true,
      },
      {
        name: "Cherry Tomatoes",
        type: "Tomato",
        imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800",
        address: "Village Bangalore, Karnataka",
        quantity: 80,
        unit: "quintal",
        pricePerUnit: 3500,
        isHealthy: true,
      },
      {
        name: "Baby Potatoes",
        type: "Potato",
        imageUrl: "https://images.unsplash.com/photo-1552874869-5c39ec9288dc?w=800",
        address: "Village Shimla, Himachal Pradesh",
        quantity: 120,
        unit: "quintal",
        pricePerUnit: 2800,
        isHealthy: true,
      },
      {
        name: "White Onions",
        type: "Onion",
        imageUrl: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800",
        address: "Village Indore, Madhya Pradesh",
        quantity: 200,
        unit: "quintal",
        pricePerUnit: 1400,
        isHealthy: true,
      },
      {
        name: "Organic Carrots",
        type: "Carrot",
        imageUrl: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=800",
        address: "Village Dehradun, Uttarakhand",
        quantity: 90,
        unit: "quintal",
        pricePerUnit: 2500,
        isHealthy: true,
      },
    ];

    console.log("Starting to seed crops...");

    for (const crop of cropData) {
      const diseaseAnalysis = crop.isHealthy
        ? {
            isHealthy: true,
            diseaseName: undefined,
            confidence: undefined,
            remedy: undefined,
          }
        : {
            isHealthy: false,
            diseaseName: "Leaf Blight",
            confidence: 0.85,
            remedy: "Apply fungicide and ensure proper drainage",
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