import { Router } from "express";
import { createOrder } from "../controllers/market.controller";

const router = Router();

router.post("/", createOrder);

export default router;
