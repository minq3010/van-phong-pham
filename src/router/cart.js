import express from "express";
import {
  AddCart,
  DeleteAllCart,
  DeleteCart,
  GetCart,
  UpdateCart,
} from "../controller/cart";
import { checkOwner } from "../xacthuc/checkout";

const route = express.Router();
route.post("/cart/:userid", checkOwner, AddCart);
route.get("/cart/:userid", checkOwner, GetCart);
route.delete("/cart/:id", checkOwner, DeleteCart);
route.patch("/cart/:id", checkOwner, UpdateCart);
route.delete("/carts/:userid", checkOwner, DeleteAllCart);
export default route;
