import express from "express";
import {
  CreateVoucher,
  DeleteVoucher,
  DetailVoucher,
  getAllVoucher,
  getPublicVouchers,
  UpdateVoucher,
} from "../controller/voucher";
import { checkout, checkManage } from "../xacthuc/checkout";

const router = express.Router();
router.get("/vouchers-public", getPublicVouchers);
router.get("/vouchers", checkout, getAllVoucher);
router.post("/voucher", checkout, CreateVoucher);
router.patch("/voucher/:id", checkout, UpdateVoucher);
router.delete("/voucher/:id", checkManage, DeleteVoucher);
router.get("/voucher/:id", checkout, DetailVoucher);
export default router;
