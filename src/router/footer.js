import { Router } from "express";
import {
  getPolicies,
  getPolicyBySlug,
  createPolicy,
  updatePolicy,
  deletePolicy,
  getNavigations,
  createNavigation,
  updateNavigation,
  deleteNavigation
} from "../controller/footer.js";

const footerRouter = Router();

footerRouter.get("/policies", getPolicies);
footerRouter.get("/policies/:slug", getPolicyBySlug);
footerRouter.post("/policies", createPolicy);
footerRouter.put("/policies/:id", updatePolicy);
footerRouter.delete("/policies/:id", deletePolicy);

footerRouter.get("/navigations", getNavigations);
footerRouter.post("/navigations", createNavigation);
footerRouter.put("/navigations/:id", updateNavigation);
footerRouter.delete("/navigations/:id", deleteNavigation);

export default footerRouter;
