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
    required: true
  },

  deliveredAt: {
    type: Date
  },
  taxPrice: {
    type: Number,
    default: 0.0
  },

  shippingPrice: {
    type: Number,
    default: 50
  }
}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema);