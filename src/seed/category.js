import mongoose from "mongoose";
import { Caterory } from "../model/Caterory.js";

const seedData = async () => {
  try {
    await mongoose.connect(process.env.DB_URI || "mongodb://localhost:27017/do_an_freelance");
    
    await Caterory.deleteMany({});
    
    await Caterory.insertMany(seedCategories);
    
    console.log("Seeding Database successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Database:", error);
    process.exit(1);
  }
};

seedData();
