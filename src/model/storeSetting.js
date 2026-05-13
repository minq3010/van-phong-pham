import mongoose from "mongoose";

const storeSettingSchema = new mongoose.Schema(
  {
    appName: { type: String, default: "Văn Phòng Phẩm" },
    description: { type: String, default: "Chuyên cung cấp văn phòng phẩm chính hãng cho cá nhân, trường học và doanh nghiệp." },
    hotline: { type: String, default: "0900 000 000" },
    email: { type: String, default: "support@vanphongpham.vn" },
    address: { type: String, default: "Nhổn, Bắc Từ Liêm, Hà Nội" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    tiktok: { type: String, default: "" }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const StoreSetting = mongoose.models.storeSettings || mongoose.model("storeSettings", storeSettingSchema);
