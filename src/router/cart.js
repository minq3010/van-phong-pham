import express from "express";
import {
  AddCart,
  DeleteAllCart,
  DeleteCart,
  GetCart,
  UpdateCart,
} from "../controller/cart";
import { checkOwner, checkUser } from "../xacthuc/checkout";

const route = express.Router();
route.post("/cart/:userid", checkOwner, AddCart);
route.get("/cart/:userid", checkOwner, GetCart);
route.delete("/cart/:id", checkUser, DeleteCart);
route.patch("/cart/:id", checkUser, UpdateCart);
route.delete("/carts/:userid", checkOwner, DeleteAllCart);
export default route;
