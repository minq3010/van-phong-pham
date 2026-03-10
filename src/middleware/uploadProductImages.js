import path from "path";
import multer from "multer";
import { ensureUploadDirs, productUploadsDir } from "../utils/ensureUploadDirs.js";

ensureUploadDirs();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, productUploadsDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const baseName = path
      .basename(file.originalname || "product-image", extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);

    callback(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName || "product"}${extension || ".jpg"}`
    );
  },
});

const fileFilter = (_req, file, callback) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(new Error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP"));
    return;
  }

  callback(null, true);
};

const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

export default uploadProductImages;