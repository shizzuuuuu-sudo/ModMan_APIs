import Order from "../models/orderModel.js";

import mongoose from "mongoose";
export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, userDetails } = req.body;

    if (!userId || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    // Create new order document
    const newOrder = new Order({
      userId,
      userDetails,
      items,
      totalAmount,
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "items.productId",
        select: "productName price images", // include images
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};





export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing userId",
      });
    }

    const orders = await Order.find({ userId })
      .populate({
        path: "items.productId",
        select: "productName price images", // include images
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
      message: orders.length ? "Orders fetched" : "No orders found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


