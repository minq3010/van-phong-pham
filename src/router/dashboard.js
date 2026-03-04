import express from "express";
import DashboardStats from "../controller/dashboard";
import { checkout } from "../xacthuc/checkout";

const route = express.Router();

route.get("/dashboard", checkout, DashboardStats);
export default route;
