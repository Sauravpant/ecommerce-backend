import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,  //Cloudinaary url
    required: true
  },
  imageId: {
    type: String,
    required: true
  },
  ratings: {
    type: Number,
    default: 0
  },
  countInStock: {
    type: Number,
    required: true
  }

}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema);