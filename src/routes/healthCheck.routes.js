import { Router } from "express";
import { handleHealthchekHandler } from "../controllers/healthcheck.controller.js";
const healthChckRouter = Router();
// define a routes for health check
healthChckRouter.route("/health-check").get(handleHealthchekHandler);
export default healthChckRouter;
