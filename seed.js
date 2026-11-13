
import "dotenv/config";

import connectDB from "./config/db.js";
import Menu from "./models/Menu.js";
import Deal from "./models/Deal.js";

import { menuData, dealsData } from "./data/seedData.js";

const seedDatabase = async () => {
  try {
    await connectDB();

    await Menu.bulkWrite(
      menuData.map((item) => ({
        updateOne: {
          filter: { id: item.id },
          update: { $set: item },
          upsert: true,
        },
      }))
    );

    await Deal.bulkWrite(
      dealsData.map((deal) => ({
        updateOne: {
          filter: { id: deal.id },
          update: { $set: deal },
          upsert: true,
        },
      }))
    );

    console.log("Menu items and deals saved successfully!");
    console.log(`Menu items: ${menuData.length}`);
    console.log(`Deals: ${dealsData.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
