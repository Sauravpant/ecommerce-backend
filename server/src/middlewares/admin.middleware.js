import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {AppError} from "../utils/AppError.js";
import jwt from "jsonwebtoken"

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header('Authorization').replace("Bearer ", "");
  if (!token) {
    throw new AppError(401, 'Unauthorized access')
  }
  const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
  if (!user) {
    throw new AppError(404, "User doesnt exist");
  }
  if (!user.isAdmin) {
    throw new AppError(403, "Admin only access")
  }
  req.user = user;
  next();
})

export { verifyAdmin };