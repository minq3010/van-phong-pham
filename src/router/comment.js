import express from "express";

import {
  createComment,
  deleteComment,
  getCommentStatsForAdmin,
  getComments,
  getCommentsByProduct,
  getCommentsByProductId,
  updateComment,
} from "../controller/comment.js";
import { checkout, checkManage } from "../xacthuc/checkout";

const router = express.Router();

// (C) Create - Tạo comment
router.post("/comment", createComment);

// (R) Read - Lấy danh sách comment
router.get("/comment", getComments);

// (R) Read - Lấy 1 comment theo id
router.get("/comment/:id", getCommentsByProductId);

// (U) Update - Cập nhật comment
router.put("/comment/:id", checkout, updateComment);

// (D) Delete - Xoá comment
router.delete("/comment/:id", checkManage, deleteComment);

// (R) Read - Lấy comment theo productId
router.get("/comment/product/:productId", getCommentsByProduct);

router.get("/comment/admin/products", checkout, getCommentStatsForAdmin);

export default router;
