import express from "express"
import { registerUser, logInUser, logOutUser, refreshAccessToken, changeCurrentPassword } from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import {upload} from "../middlewares/multer.middlewares.js"
const router = express.Router();

router.post("/register-user",upload.single('profilePicture'), registerUser);
router.post("/login", logInUser);
router.get("/logout",verifyJWT, logOutUser);
router.patch("/change-password", verifyJWT, changeCurrentPassword);
router.get("/refresh-token", verifyJWT, refreshAccessToken);
export default router;