import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
);

export const Policy = mongoose.models.policies || mongoose.model("policies", policySchema);
