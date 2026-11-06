import connectDB from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import { verifyToken } from "../../../../lib/auth";

const validStatuses = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // Verify admin token
    const authHeader =
      request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json(
        {
          success: false,
          message: "Authorization required",
        },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return Response.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    if (decoded.role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    // Get order ID
    const { id } = await params;

    const body = await request.json();
    const { orderStatus } = body;

    if (!validStatuses.includes(orderStatus)) {
      return Response.json(
        {
          success: false,
          message: "Invalid order status",
        },
        { status: 400 }
      );
    }

    // Update MongoDB
    const updatedOrder =
      await Order.findByIdAndUpdate(
        id,
        {
          orderStatus,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedOrder) {
      return Response.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // Emit real-time event to this order's room
    if (global.io) {
      global.io
        .to(`order:${updatedOrder._id}`)
        .emit("order-status-updated", {
          _id: String(updatedOrder._id),
          orderStatus: updatedOrder.orderStatus,
        });
    }

    return Response.json(
      {
        success: true,
        message: "Order status updated successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "UPDATE ORDER ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Failed to update order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}