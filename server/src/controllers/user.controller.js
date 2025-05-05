import { asyncHandler } from "../utils/AsyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";


const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User details fetched successfully"));
})


const updateProfileDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password -refreshToken");
  if (!user) {
    throw new AppError(404, "User doesnt exist");
  }
  const userModel = ['fullName', 'username'];
  const detailsToUpdate = userModel.filter((model) => req.body[model] !== undefined);
  if (detailsToUpdate.length === 0) {
    throw new AppError(400, "No details to update");
  }
  detailsToUpdate.forEach((detail) => user[detail] = req.body[detail]);
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, user, "Profile details updated successfully"));
})


const updateProfilePicture = asyncHandler(async (req, res) => {
  const profilePicturePath = req.file?.path;
  if (!profilePicturePath) {
    throw new AppError(400, "Image is required");
  }
  const user = await User.findById(req.user?._id).select("-password -refreshToken");
  const uploadedImage = await uploadToCloudinary(profilePicturePath);
  if (!uploadedImage) {
    throw new AppError(500, "Failed to upload image");
  }
  await deleteFromCloudinary(user.imageId);
  user.profilePicture = uploadedImage.secure_url;
  user.imageId = uploadedImage.public_id;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, "", "Profile picture updated successfully"));
})


const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-refreshToken");
  const imagePublicId=user.imageId;
  const response = await User.deleteOne({ _id: req.user._id });
  if (!response) {
    throw new AppError(500, "Failed to delete account");
  }
  await deleteFromCloudinary(imagePublicId);
  const options = {
    httpOnly: true,
    secure: true
  }
  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "", "Account deleted successfully"));
})

export { updateProfileDetails, getCurrentUser, updateProfilePicture, deleteAccount }