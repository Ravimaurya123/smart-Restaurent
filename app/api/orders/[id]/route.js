import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    console.log("PATCH ORDER ID:", id);

    const body = await request.json();

    console.log("PATCH BODY:", body);

    const { orderStatus } = body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        {
          status: 400,
        }
      );
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: orderStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully",
        order: order,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order status",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}