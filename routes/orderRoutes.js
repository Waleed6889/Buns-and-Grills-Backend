import express from "express";
import { createOrder, trackOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/:orderReference", trackOrder);

export default router;