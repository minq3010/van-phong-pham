import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose
      .connect(
        process.env.DB_URI || "mongodb://localhost:27017/do_an_freelance"
      )
      .then();
  } catch (error) {
    console.log(error);
  }
};
