require("dotenv").config();
const mongoose = require("mongoose");
const connectDb = require("../config/db");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const Partner = require("../models/Partner");
const { hashPassword } = require("../utils/hash");

const seed = async () => {
  try {
    await connectDb();

    console.log("Clearing collections...");
    await Promise.all([
      MenuItem.deleteMany({}),
      Restaurant.deleteMany({}),
      Partner.deleteMany({}),
    ]);

    const restaurantsData = [
      {
        name: "Deshi Dine",
        cuisine: "Bangladeshi",
        rating: 4.5,
        deliveryFee: 29,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        city: "Chattogram",
        menu: [
          {
            name: "Whopper",
            price: 320,
            description: "Flame-grilled beef patty",
            image:
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop",
          },
          {
            name: "Chicken Royale",
            price: 280,
            description: "Crispy chicken burger",
            image:
              "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=200&h=150&fit=crop",
          },
          {
            name: "French Fries",
            price: 120,
            description: "Crispy golden fries",
            image:
              "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=150&fit=crop",
          },
        ],
      },
      {
        name: "Astana",
        cuisine: "Bangali food",
        rating: 4.3,
        deliveryFee: 35,
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
        city: "Chattogram",
        menu: [
          {
            name: "Margherita Pizza",
            price: 450,
            description: "Classic cheese pizza",
            image:
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop",
          },
          {
            name: "Pepperoni Pizza",
            price: 550,
            description: "With pepperoni slices",
            image:
              "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=150&fit=crop",
          },
        ],
      },
      {
        name: "Habibi Bistro",
        cuisine: "Chinese and Bangla",
        rating: 4.7,
        deliveryFee: 40,
        image:
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
        city: "Chattogram",
        menu: [
          {
            name: "Beef Kacchi",
            price: 380,
            description: "Traditional Kacchi Biryani",
            image:
              "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=150&fit=crop",
          },
          {
            name: "Chicken Biryani",
            price: 320,
            description: "Aromatic chicken biryani",
            image:
              "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&h=150&fit=crop",
          },
        ],
      },
    ];

    console.log("Inserting restaurants and menu items...");
    const restaurantDocs = [];
    for (const r of restaurantsData) {
      const restaurant = await Restaurant.create({
        name: r.name,
        cuisine: r.cuisine,
        rating: r.rating,
        deliveryFee: r.deliveryFee,
        image: r.image,
        city: r.city,
      });
      const items = r.menu.map((item) => ({
        ...item,
        restaurant: restaurant.id,
      }));
      await MenuItem.insertMany(items);
      restaurantDocs.push(restaurant);
    }

    console.log("Creating demo partners...");
    const passwordHash = await hashPassword("demo123");
    const partnerSeeds = [
      {
        partnerId: "PARTNER001",
        email: "john@deshidine.com",
        ownerName: "John Doe",
        restaurant: restaurantDocs[0].id,
      },
      {
        partnerId: "PARTNER002",
        email: "jane@astana.com",
        ownerName: "Jane Smith",
        restaurant: restaurantDocs[1].id,
      },
    ];

    for (const p of partnerSeeds) {
      await Partner.create({ ...p, passwordHash });
    }

    console.log("Seeding complete.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed", err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
