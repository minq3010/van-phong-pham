import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadsRootDir = path.resolve(__dirname, "../../uploads");
export const productUploadsDir = path.resolve(uploadsRootDir, "products");

export const ensureUploadDirs = () => {
  [uploadsRootDir, productUploadsDir].forEach((dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};