const mongoose = require("mongoose");
require("dotenv").config();
const Restaurant = require("../models/Restaurant");
const Partner = require("../models/Partner");

async function verifyRestaurantImages() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.log("MongoDB URI not found in environment variables");
      console.log("Using default: mongodb://localhost:27017/happymeal");
    }

    await mongoose.connect(mongoURI || "mongodb://localhost:27017/happymeal");
    console.log("✓ Connected to MongoDB\n");

    // Get all restaurants
    const restaurants = await Restaurant.find({}).select(
      "_id name image city isActive"
    );
    console.log(`Found ${restaurants.length} restaurants in database:\n`);

    if (restaurants.length === 0) {
      console.log("No restaurants found");
    } else {
      restaurants.forEach((restaurant, index) => {
        console.log(`${index + 1}. ${restaurant.name}`);
        console.log(`   ID: ${restaurant._id}`);
        console.log(`   City: ${restaurant.city}`);
        console.log(`   Active: ${restaurant.isActive}`);
        console.log(`   Image URL: ${restaurant.image}`);
        console.log(`   Has Image: ${restaurant.image ? "✓ YES" : "✗ NO"}`);
        console.log("");
      });
    }

    // Get partners with their restaurants
    const partners = await Partner.find({}).populate(
      "restaurant",
      "name image"
    );
    console.log(`\nFound ${partners.length} partners:\n`);

    partners.forEach((partner, index) => {
      console.log(`${index + 1}. Partner: ${partner.email}`);
      console.log(`   Partner ID: ${partner.partnerId}`);
      if (partner.restaurant) {
        console.log(`   Restaurant: ${partner.restaurant.name}`);
        console.log(`   Restaurant Image: ${partner.restaurant.image}`);
      }
      console.log("");
    });

    await mongoose.connection.close();
    console.log("\n✓ Database verification complete");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

verifyRestaurantImages();
