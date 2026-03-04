import mongoose from "mongoose";
const DanhMucSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: {
      type: Boolean,
      require: true,
    },
  },

);
export const Caterory = mongoose.models.caterories || mongoose.model("caterories", DanhMucSchema);
