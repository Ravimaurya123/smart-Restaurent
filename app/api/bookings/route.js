import connectDB from "../../../lib/mongodb";
import Booking from "../../../models/Booking";

export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    return Response.json(
      {
        success: true,
        bookings,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch bookings",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      phone,
      date,
      time,
      guests,
      request: specialRequest,
    } = body;

    if (
      !name ||
      !phone ||
      !date ||
      !time ||
      !guests
    ) {
      return Response.json(
        {
          success: false,
          message: "Please fill all required fields",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return Response.json(
        {
          success: false,
          message: "Please enter a valid 10-digit phone number",
        },
        {
          status: 400,
        }
      );
    }

    const booking = await Booking.create({
      name: name.trim(),
      phone: phone.trim(),
      date,
      time,
      guests: Number(guests),
      request: specialRequest?.trim() || "",
      status: "Pending",
    });

    return Response.json(
      {
        success: true,
        message: "Table booked successfully",
        booking,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create booking",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}