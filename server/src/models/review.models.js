import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required:true
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: "Products"
  },

  rating: {
    type: Number,
    required: true
  },

  comment: {
    type: String
  }

}, { timestamps: true })


export const Review = mongoose.model("Reviews", reviewSchema);