import jwt from "jsonwebtoken"
import { AppError } from "../utils/AppError.js"
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js"

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new AppError(201, "Unauthorized access");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      throw new AppError(404, "Invaid token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new AppError(401, "Invalid or expired token");
  }
});

export { verifyJWT };