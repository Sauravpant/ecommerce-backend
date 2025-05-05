import express from "express";
import { addToCart, deleteCart, removeItemFromCart, decrementQuantity, incrementQuantity } from "../controllers/cart.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post("/add/:productId", verifyJWT, addToCart);
router.delete("/delete", verifyJWT, deleteCart);
router.delete("/remove/:productId", verifyJWT, removeItemFromCart);
router.patch("/decrement/:productId", verifyJWT, decrementQuantity);
router.patch("/increment/:productId", verifyJWT, incrementQuantity);

export default router;
