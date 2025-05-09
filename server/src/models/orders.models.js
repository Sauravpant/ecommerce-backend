import mongoose, { Schema } from "mongoose";


const orderCountSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },

  quantity: {
    type: Number,
    required: true
  }
})


const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  orderItems: [orderCountSchema],

  totalPrice: {
    type: Number,
    required: true
  },

  shippingAddress: {
    type: String,
    required: true
  },

  paymentMethod: {
    type: String,
    required: true
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  paidAt: {
    type: Date
  },

  isDelivered: {
    type: Boolean,
    default: false
  },

  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema);