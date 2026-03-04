import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../model/User.js";

const createManager = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URI || "mongodb://localhost:27017/do_an_freelance"
    );

    // Kiểm tra đã có tài khoản manage chưa
    const existing = await User.findOne({ role: "manage" });
    if (existing) {
      console.log("⚠️  Tài khoản manage đã tồn tại:");
      console.log(`   Username : ${existing.username}`);
      console.log(`   Email    : ${existing.email}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Manager@123", 10);

    const manager = await User.create({
      username: "manager",
      email: "manager@admin.com",
      password: hashedPassword,
      role: "manage",
      active: true,
    });

    console.log("✅ Tạo tài khoản manage thành công!");
    console.log(`   Username : ${manager.username}`);
    console.log(`   Email    : ${manager.email}`);
    console.log(`   Password : Manager@123`);
    console.log(`   Role     : ${manager.role}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    process.exit(1);
  }
};

createManager();
