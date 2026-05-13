import dotenv from "dotenv";
import express from "express";
import cors from "cors"; // Import cors
import { connectDb } from "./config/db";
import productRouter from "./router/products";
import userRouter from "./router/User";
import categoryRouter from "./router/Caterory";
import cartRouter from "./router/cart";
import voucher from "./router/voucher";
import dashboardRouter from "./router/dashboard";
import comment from "./router/comment";
import order from "./router/order";
import chatbotRouter from "./router/chatbot.js";
import storeSettingRouter from "./router/storeSetting.js";
import footerRouter from "./router/footer.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { ensureUploadDirs, uploadsRootDir } from "./utils/ensureUploadDirs.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
ensureUploadDirs();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://100.119.135.84:5173",
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true, // cho phép gửi cookie, credentials
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(uploadsRootDir));
connectDb();
app.use("/api", productRouter);
app.use("/api", dashboardRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);
app.use("/api", voucher);
app.use("/api", order);
app.use("/api", comment);
app.use("/api", chatbotRouter);
app.use("/api", storeSettingRouter);
app.use("/api", footerRouter);
export const viteNodeApp = app;
// export default app;
