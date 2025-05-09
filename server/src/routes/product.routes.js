import express from "express"
import { addProduct, deleteProduct, updateProductDetails, getAllProducts, getSingleProduct } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {upload} from "../middlewares/multer.middlewares.js"

const router = express.Router();
router.post("/add-item", verifyJWT, verifyAdmin, upload.single('productPicture'),addProduct);
router.delete("/delete-product/:productId", verifyJWT, verifyAdmin, deleteProduct);
router.patch("/update-product/:productId", verifyJWT, verifyAdmin, updateProductDetails);
router.get("/get-all-products", getAllProducts);
router.get("/get-single-products/:productId", getSingleProduct);
router.get("/get-filtered-products", getFilteredProducts);
export default router;