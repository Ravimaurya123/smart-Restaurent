import connectDB from "../../../../lib/mongodb";
import Booking from "../../../../models/Booking";
import mongoose from "mongoose";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid booking ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const { status } = body;

    // Check valid status
    const validStatuses = [
      "Pending",
      "Confirmed",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return Response.json(
        {
          success: false,
          message: "Invalid booking status",
        },
        {
          status: 400,
        }
      );
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!booking) {
      return Response.json(
        {
          success: false,
          message: "Booking not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Booking status updated successfully",
        booking,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("UPDATE BOOKING STATUS ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update booking status",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}