import express from "express"
import { updateProfileDetails, getCurrentUser, updateProfilePicture, deleteAccount } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {upload} from "../middlewares/multer.middlewares.js"

const router = express.Router();


router.patch("/update",verifyJWT,updateProfileDetails);
router.patch("/profilepicture",verifyJWT,upload.single('profilePicture'),updateProfilePicture);
router.get("/user",verifyJWT,getCurrentUser);
router.delete("/delete-account",verifyJWT,deleteAccount);

export default router;