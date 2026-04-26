import express from "express";
import {
  AddOrder,
  DeleteOrder,
  DetailOrder,
  GetOrder,
  GetOrderByStatus,
  GetOrderByUser,
  UpdateOrder,
} from "../controller/order";
import { checkout, checkManage, checkOwner, checkUser } from "../xacthuc/checkout";
const router = express.Router();
router.get("/orders", checkout, GetOrder);
router.post("/order", checkUser, AddOrder);
router.patch("/order/:id", checkout, UpdateOrder);
router.delete("/order", checkManage, DeleteOrder);
router.get("/order/user/:userid", checkOwner, GetOrderByUser);       // user chỉ xem đơn của mình
router.get("/order/:id", checkUser, DetailOrder);
router.get("/order/status/:status/:userid", checkOwner, GetOrderByStatus); // user chỉ xem trạng thái đơn của mình

export default router;
