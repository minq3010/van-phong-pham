import express from "express";
import { askChatbot } from "../controller/chatbot.js";

const router = express.Router();

router.post("/chatbot", askChatbot);

export default router;
