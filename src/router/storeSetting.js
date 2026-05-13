import { Router } from "express";
import { getStoreSetting, updateStoreSetting } from "../controller/storeSetting.js";

const storeSettingRouter = Router();

storeSettingRouter.get("/store-setting", getStoreSetting);
storeSettingRouter.put("/store-setting", updateStoreSetting);

export default storeSettingRouter;
