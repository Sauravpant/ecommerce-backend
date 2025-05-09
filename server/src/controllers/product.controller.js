import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AppError } from "../utils/AppError.js";
import { Product } from "../models/product.models.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";


const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, discount, ratings, itemsInStock } = req.body;

  if (!name.trim() || !description.trim() || !price.trim() || !category.trim() || !discount.trim() || !ratings.trim() || !itemsInStock.trim()) {
    throw new AppError(400, "Insert all fields");
  }

  const productImagePath = req.file?.path;
  if (!productImagePath) {
    throw new AppError(400, "Image is required");
  }
  const uploadedImage = await uploadToCloudinary(productImagePath);
  if (!uploadedImage) {
    throw new AppError(500, "Failed to upload image. Try again");
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    discount,
    ratings,
    itemsInStock,
    image: uploadedImage.secure_url,
    imageId: uploadedImage.public_id
  });

  if (!product) {
    throw new AppError(500, "Failed to add item to the database");
  }

  return res.status(200).json(new ApiResponse(200, "", "Item added successfully"));
});


const deleteProduct = asyncHandler(async (req, res) => {

  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, "Item doesnt exist");
  }

  const productCloudId = product.imageId;
  if (productCloudId) {
    await deleteFromCloudinary(productCloudId);
  }

  const response = await Product.findByIdAndDelete(productId);
  if (!response) {
    throw new AppError(500, "Failed to delete item from the database");
  }
  return res.status(200).json(new ApiResponse(200, "", "Item deleted successfully"));

});


const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});


const updateProductDetails = asyncHandler(async (req, res) => {

  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, "Items doesnt exist");
  }

  const productModel = ['name', 'description', 'price', 'category', 'discount', 'countInStock'];
  const fieldsToUpdate = productModel.filter((prod) => req.body[prod] !== undefined);
  if (fieldsToUpdate.length === 0) {
    throw new AppError(400, "No fields to update");
  }

  fieldsToUpdate.forEach((prod) => {
    if (req.body[prod] !== undefined) {
      product[prod] = req.body[prod];
    }
  })
  await product.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, "Item updated successfully"));

});

const getSingleProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!productId) {
    throw new AppError(500, "Failed to get product");
  }
  return res.status(200).json(new ApiResponse(200, product, "Item fetched successfully"));

});


const getFilteredProducts = asyncHandler(async (req, res) => {
  const { category, priceMin, priceMax, ratingMin } = req.query;

  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = priceMin;
    if (priceMax) filter.price.$lte = priceMax;
  }
  if (ratingMin) {
    filter.ratings = { $gte: ratingMin };
  }

  const products = await Product.find(filter);
  return res.status(200).json(new ApiResponse(200, products, "Filtered products fetched successfully"));
});

export { addProduct, deleteProduct, updateProductDetails, getAllProducts, getSingleProduct, getFilteredProducts };
