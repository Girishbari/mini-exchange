import { Router } from "express";
import { getUserBalance } from "../controllers/market.controller";

const router = Router();

router.get("/:userId", getUserBalance);

export default router;
