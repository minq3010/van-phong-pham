import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose
      .connect(
        ""
      )
      .then();
  } catch (error) {
    console.log(error);
  }
};
