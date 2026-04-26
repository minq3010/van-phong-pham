import mongoose from "mongoose";

export const getMongoUri = () =>
  process.env.DB_URI ||
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/do_an_freelance";

export const connectDb = async () => {
  try {
    await mongoose.connect(getMongoUri());
  } catch (error) {
    console.log(error);
  }
};
