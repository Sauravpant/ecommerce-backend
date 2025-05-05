import { asyncHandler } from "../utils/AsyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.models.js"

const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    const existingItem = cart.cartItems.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity++;
    }
    else {
      cart.cartItems.push({ product: productId });
    }
    await cart.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
  } else {
    const newCart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, quantity }]
    })
    if (!newCart) {
      throw new AppError(500, "Failed to add item to cart")
    }
    return res.status(200).json(new ApiResponse(200, newCart, "Cart created and item added to cart successfully"));

  }
})

const deleteCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError(404, "Cart doesnt exist");
  }
  const deletedCart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!deletedCart) {
    throw new AppError(500, "Failed to delete cart");
  }
  return res.status(200).json(new ApiResponse(200, "", "Cart deleted successfully"));

})


const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  cart.cartItems = cart.cartItems.filter((item) => item.product.toString() !== productId);
  if (cart.cartItems.length === 0) {
    await Cart.findByIdAndDelete(cart._id);
  }
  await cart.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, "", "Item removed from cart"));
})


const decrementQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  const product = cart.cartItems.find((item) => item.product.toString() === productId);
  if (product.quantity > 1) {
    product.quantity--;
  } else {
    cart.cartItems = cart.cartItems.filter((item) => item.product.toString() !== productId);
  }
  await cart.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, "", "Quantity decremented successfully"));

})


const incrementQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  const product = cart.cartItems.find((item) => item.product.toString() === productId); 
    product.quantity++;
    await cart.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "", "Quantity incremented successfully"));
})




export { addToCart, deleteCart, removeItemFromCart, decrementQuantity, incrementQuantity }

