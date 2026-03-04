import express from "express";
import {
  CreateCategory,
  DeleteCategory,
  DetailCategory,
  GetAllCategory,
  UpdateCategory,
} from "../controller/Caterory";
import { checkout, checkManage } from "../xacthuc/checkout";

const router = express.Router();
router.get("/categorys", GetAllCategory);
router.post("/category", checkout, CreateCategory);
router.patch("/category/:id", checkout, UpdateCategory);
router.delete("/category/:id", checkManage, DeleteCategory);
router.get("/category/:id", DetailCategory);
export default router;
