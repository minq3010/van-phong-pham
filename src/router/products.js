import express from "express";
import {
  AddProduct,
  DeleteProduct,
  GetAllProduct,
  GetProductDetails,
  GetProductsCategory,
  Pagination,
  UpdateProduct,
} from "../controller/product";
import { checkout, checkManage } from "../xacthuc/checkout";
import uploadProductImages from "../middleware/uploadProductImages";
const router = express.Router();
router.get("/products", GetAllProduct);
router.get("/products/:page", Pagination);
router.get("/product/:id", GetProductDetails);
router.get("/products/category/:category", GetProductsCategory);
router.post("/products", checkout, uploadProductImages.array("images", 5), AddProduct);
router.patch("/products/:id", checkout, uploadProductImages.array("images", 5), UpdateProduct);
router.delete("/products/:id", checkManage, DeleteProduct);
export default router;
