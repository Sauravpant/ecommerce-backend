import { asyncHandler } from "../utils/AsyncHandler";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";
import { Order } from "../models/orders.models.js";
import { Cart } from "../models/cart.models.js";
import { Product } from "../models/product.models.js";


const createOrder = asyncHandler(async (req, res) => {

  const { shippingAddress, paymentMethod } = req.body;
  if (!shippingAddress.trim() || !paymentMethod.trim()) {
    throw new AppError(400, "Enter all fields");
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.cartItems.length === 0) {
    throw new AppError(404, "Cart is empty");
  }

  let totalPrice = 0;
  let orderItems = [];
  for (let i = 0; i < cart.cartItems.length; i++) {
    const product = await Product.findById(cart.cartItems[i].product);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    if (product.countInStock < cart.cartItems[i].quantity) {
      throw new AppError(400, "THe selected quantity is not available on stock");
    }
    totalPrice += product.price * cart.cartItems[i].quantity;
    orderItems.push({
      product: product._id,
      quantity: cart.cartItems[i].quantity
    })

    product.countInStock -= cart.cartItems[i].quantity;
    await product.save({ validateBeforeSave: false });
  }
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    totalPrice: totalPrice,
    shippingAddress,
    paymentMethod,
  }
  );
  const savedOrder = await order.save();
  await Cart.deleteOne({ user: req.user._id });
  return res.status(200).json(new ApiResponse(200, savedOrder, "Order placed successfully"));
})

const markAsDelivered = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, "", "Order marked as delivered"));
})


const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ user: req.user._id, _id: orderId });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  if (order.status === "Pending") {
    const deletedOrder = await Order.findOneAndDelete({ user: req.user._id, _id: orderId });
    if (!deletedOrder) {
      throw new AppError(500, "Failed to delete the order");
    }
    return res.status(200).json(new ApiResponse(200, "", "Order cancelled successfully"));
  } else {
    throw new AppError(405, "Order is already placed.Cannot cancel...")
  }
})


const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const validStatus = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatus.includes(status)) {
    throw new AppError(400, 'Not valid status');
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(400, "Order not found");
  }
  order.status = status;
  await order.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, order, "Order status changed successfully"));
})


const getAllOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const orders = await Order.find({ user: userId });
  if (!orders) {
    throw new AppError(404, "No orders yet");
  }
  return res.status(200).json(new ApiResponse(200, "", "Orders fetched successfully"));
})


export { createOrder, markAsDelivered, cancelOrder, updateOrderStatus, getAllOrders }