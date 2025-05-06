import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiRespone } from "../utils/ApiResponse.js";
import { AppError } from "../utils/AppError.js";
import { Review } from "../models/review.models.js";

const createReview = asyncHandler(async (req, res) => {

  const { productId } = req.params;
  const { rating, comment } = req.body;
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId
  })

  if (existingReview) {
    throw new AppError(400, "Duplicate reviews isnt allowed");
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: rating,
    comment: comment
  })

  if (!review) {
    throw new AppError(500, "Failed to post the review");
  }

  return res.status(200).json(new ApiRespone(200, review, "Review posted successfully"));
})

const getAllReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ product: productId }).populate("user", "fullName");
  if (reviews.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No reviews yet"));
  }
  return res.status(200).json(new ApiRespone(200, reviews, "Reviews fetched successfully"));


})


const editReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { newComment, newRating } = req.body;
  const review = await Review.findOne({
    user: req.user._id,
    product: productId
  });
  if (!review) {
    throw new AppError(404, "Review not found");
  }

  review.comment = newComment;
  review.rating = newRating;
  await review.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, "", "Review updated successfully"));

})


const deleteReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const review = await Review.findOneAndDelete({
    user: req.user._id,
    product: productId
  });
  if (!review) {
    throw new AppError(404, "Review not found");
  }
  return res.status(200).json(new ApiRespone(200, "", "Review deleted successfully"));

})

export { createReview, getAllReviews, editReview ,deleteReview}