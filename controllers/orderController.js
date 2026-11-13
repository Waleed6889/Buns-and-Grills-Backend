
import { randomBytes } from "crypto";
import Menu from "../models/Menu.js";
import Deal from "../models/Deal.js";
import Order from "../models/Order.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { fulfillmentMode, customer, items } = req.body;

    // Validate basic information
    if (!["delivery", "pickup"].includes(fulfillmentMode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fulfillment mode",
      });
    }

    if (!customer?.name?.trim() || !customer?.phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name and phone are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    if (fulfillmentMode === "delivery" && (!customer.area || !customer.address)) {
      return res.status(400).json({
        success: false,
        message: "Delivery area and address are required",
      });
    }

    if (fulfillmentMode === "pickup" && (!customer.branchId || !customer.pickupTime)) {
      return res.status(400).json({
        success: false,
        message: "Pickup branch and pickup time are required",
      });
    }

    // Calculate prices using MongoDB data
    const orderItems = [];

    for (const item of items) {
      if (
        typeof item.id !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 50
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid cart item or quantity",
        });
      }

      // First check regular menu
      let product = await Menu.findOne({ id: item.id });
      let unitPrice;

      if (product) {
        unitPrice = product.price;
      } else {
        // If not found, check special deals
        product = await Deal.findOne({ id: item.id });

        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product not found: ${item.id}`,
          });
        }

        unitPrice = product.discountedPrice;
      }

      const lineTotal = unitPrice * item.quantity;

      orderItems.push({
        id: product.id,
        name: product.name,
        unitPricePkr: unitPrice,
        quantity: item.quantity,
        lineTotalPkr: lineTotal,
      });
    }

    const subtotal = orderItems.reduce(
      (total, item) => total + item.lineTotalPkr,
      0
    );

    // Delivery fee
    const deliveryFee =
      fulfillmentMode === "pickup"
        ? 0
        : subtotal >= 2500
          ? 0
          : 150;

    const total = subtotal + deliveryFee;

    // Generate order reference
    const orderReference = `BG-${randomBytes(4).toString("hex").toUpperCase()}`;

    // Save order
    const order = await Order.create({
      orderReference,
      fulfillmentMode,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        area: customer.area,
        address: customer.address,
        branchId: customer.branchId,
        branchName: customer.branchName,
        pickupTime: customer.pickupTime,
        notes: customer.notes,
      },
      items: orderItems,
      pricing: {
        subtotalPkr: subtotal,
        deliveryFeePkr: deliveryFee,
        totalPkr: total,
        currency: "PKR",
      },
      paymentMethod:
        fulfillmentMode === "delivery"
          ? "cash_on_delivery"
          : "cash_on_pickup",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderReference: order.orderReference,
        items: order.items,
        pricing: order.pricing,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// TRACK ORDER
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderReference: req.params.orderReference,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        orderReference: order.orderReference,
        fulfillmentMode: order.fulfillmentMode,
        items: order.items,
        pricing: order.pricing,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Track order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to track order",
    });
  }
};
