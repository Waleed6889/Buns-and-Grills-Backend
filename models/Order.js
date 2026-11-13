
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderReference: {
      type: String,
      required: true,
      unique: true,
    },

    fulfillmentMode: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
    },

    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      area: String,
      address: String,
      branchId: String,
      branchName: String,
      pickupTime: String,
      notes: String,
    },

    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        unitPricePkr: { type: Number, required: true },
        quantity: { type: Number, required: true },
        lineTotalPkr: { type: Number, required: true },
      },
    ],

    pricing: {
      subtotalPkr: { type: Number, required: true },
      deliveryFeePkr: { type: Number, required: true },
      totalPkr: { type: Number, required: true },
      currency: { type: String, default: "PKR" },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "ready_for_pickup",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "cash_on_pickup"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
