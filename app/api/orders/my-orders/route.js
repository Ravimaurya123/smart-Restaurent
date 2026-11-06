import connectDB from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import { verifyToken } from "../../../../lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    // =========================================
    // GET AUTHORIZATION HEADER
    // =========================================

    const authHeader =
      request.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        {
          success: false,
          message:
            "Authorization token is required",
        },
        {
          status: 401,
        }
      );
    }

    // =========================================
    // GET TOKEN
    // =========================================

    const token = authHeader.replace(
      "Bearer ",
      ""
    );

    if (!token) {
      return Response.json(
        {
          success: false,
          message:
            "Authorization token is missing",
        },
        {
          status: 401,
        }
      );
    }

    // =========================================
    // VERIFY TOKEN
    // =========================================

    const decoded =
      verifyToken(token);

    if (!decoded) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid or expired token",
        },
        {
          status: 401,
        }
      );
    }

    // =========================================
    // FIND CUSTOMER ORDERS
    // =========================================

    const orders =
      await Order.find({
        userId: decoded.userId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    // =========================================
    // SUCCESS RESPONSE
    // =========================================

    return Response.json(
      {
        success: true,
        orders,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "MY ORDERS ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to fetch your orders",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}