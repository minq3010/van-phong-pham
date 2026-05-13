import mongoose from "mongoose";

const navigationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
);

export const Navigation = mongoose.models.navigations || mongoose.model("navigations", navigationSchema);
