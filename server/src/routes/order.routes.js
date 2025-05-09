import express from "express";
import { createOrder, markAsDelivered, cancelOrder, updateOrderStatus, getAllOrders } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createOrder);
router.delete("/cancel/:orderId", verifyJWT, cancelOrder);
router.get("/user/:userId", verifyJWT, getAllOrders);
router.patch("/status/:orderId", verifyJWT, verifyAdmin, updateOrderStatus);
router.patch("/deliver/:orderId", verifyJWT, verifyAdmin, markAsDelivered);

export default router;
