import { Router } from "express";
import { quote } from "../controllers/market.controller";

const router = Router();

router.post("/", quote);

export default router;
