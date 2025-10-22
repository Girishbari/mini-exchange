import { Router } from "express";
import { depth } from "../controllers/market.controller";

const router = Router();

router.get("/", depth);

export default router;
