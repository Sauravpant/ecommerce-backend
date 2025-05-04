import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password -refreshToken");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new AppError(500, "Something went wrong");
  }
};


const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (!fullName?.trim() || !username?.trim() || !email?.trim() || !password?.trim()) {
    throw new AppError(400, "Fields cannot be empty");
  }
  const userExists = await User.findOne({
    $or: [{ username }, { email }]
  });
  if (userExists) {
    throw new AppError(400, "User already exists");
  }
  const profilePicturePath = req.file?.profilePicture?.[0]?.path;
  if (!profilePicturePath) {
    throw new AppError(400, "Profile Picture is required");
  }
  const profilePicture = await uploadToCloudinary(profilePicturePath);
  if (!profilePicture) {
    throw new AppError(500, "Failed to upload image. Try again");
  }
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    profilePicture: profilePicture.url
  });
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new AppError(500, "Error occurred while saving the user details");
  }
  return res.status(200).json(new ApiResponse(200, createdUser, "User registered successfully"));
});


const logInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password?.trim()) {
    throw new AppError(400, "Fields cannot be empty.");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User doesn't exist");
  }
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new AppError(401, "Password doesn't match");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  const options = { httpOnly: true, secure: true };
  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 }
  }, { new: true });
  const options = { httpOnly: true, secure: true };
  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const newRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!newRefreshToken) {
    throw new AppError(401, "Unauthorized access");
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(newRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new AppError(401, "Invalid refresh token");
  }
  const user = await User.findById(decodedToken._id).select("-password");
  if (!user) {
    throw new AppError(404, "User doesn't exist");
  }
  if (newRefreshToken !== user.refreshToken) {
    throw new AppError(401, "Token doesn't match");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const options = { httpOnly: true, secure: true };
  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!newPassword?.trim() || !oldPassword?.trim()) {
    throw new AppError(400, "Fields cannot be empty");
  }
  const user = await User.findById(req.user?._id).select("-password -refreshToken");
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new AppError(400, "Password doesnt match")
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, "", "Password Changed successfully"))
})

export { registerUser, logInUser, logOutUser, refreshAccessToken, changeCurrentPassword };
