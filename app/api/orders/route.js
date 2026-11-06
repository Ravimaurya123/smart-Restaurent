import connectDB from "../../../lib/mongodb";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import { verifyToken } from "../../../lib/auth";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({})
      .sort({
        createdAt: -1,
      })
      .lean();

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
      "GET ORDERS ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request
) {
  try {
    await connectDB();

    // =========================
    // AUTHENTICATION
    // =========================

    const authHeader =
      request.headers.get(
        "authorization"
      );

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

    const token =
      authHeader.replace(
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

    // =========================
    // REQUEST DATA
    // =========================

    const body =
      await request.json();

    const {
      customer,
      items,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      paymentMethod,
    } = body;

    // =========================
    // BASIC VALIDATION
    // =========================

    if (
      !customer ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      subtotal === undefined ||
      tax === undefined ||
      deliveryFee === undefined ||
      totalAmount === undefined ||
      !paymentMethod
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid order data",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // CUSTOMER VALIDATION
    // =========================

    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.pincode
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Please provide complete customer details",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^[0-9]{10}$/.test(
        customer.phone
      )
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Please enter a valid 10-digit phone number",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^[0-9]{6}$/.test(
        customer.pincode
      )
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Please enter a valid 6-digit pincode",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // PAYMENT VALIDATION
    // =========================

    const validPaymentMethods = [
      "Cash on Delivery",
      "Online Payment",
    ];

    if (
      !validPaymentMethods.includes(
        paymentMethod
      )
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid payment method",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // STOCK VALIDATION
    // =========================

    for (const item of items) {
      if (!item.foodId) {
        return Response.json(
          {
            success: false,
            message:
              "Invalid product ID",
          },
          {
            status: 400,
          }
        );
      }

      const product =
        await Product.findById(
          item.foodId
        );

      if (!product) {
        return Response.json(
          {
            success: false,
            message:
              `Product "${item.name}" no longer exists`,
          },
          {
            status: 404,
          }
        );
      }

      if (!product.isAvailable) {
        return Response.json(
          {
            success: false,
            message:
              `${product.name} is currently unavailable`,
          },
          {
            status: 400,
          }
        );
      }

      if (
        product.stock <
        Number(item.quantity)
      ) {
        return Response.json(
          {
            success: false,
            message:
              `Only ${product.stock} ${product.name} available`,
          },
          {
            status: 400,
          }
        );
      }
    }

    // =========================
    // REDUCE STOCK
    // =========================

    for (const item of items) {
      const product =
        await Product.findById(
          item.foodId
        );

      product.stock =
        product.stock -
        Number(item.quantity);

      if (product.stock === 0) {
        product.isAvailable = false;
      }

      await product.save();
    }

    // =========================
    // CREATE ORDER
    // =========================

    const orderData = {
      userId:
        decoded.userId,

      customer: {
        name:
          customer.name.trim(),

        phone:
          customer.phone.trim(),

        address:
          customer.address.trim(),

        city:
          customer.city.trim(),

        pincode:
          customer.pincode.trim(),
      },

      items,

      subtotal:
        Number(subtotal),

      tax:
        Number(tax),

      deliveryFee:
        Number(deliveryFee),

      totalAmount:
        Number(totalAmount),

      paymentMethod,

      paymentStatus:
        "Pending",

      orderStatus:
        "Pending",
    };

    const order =
      await Order.create(
        orderData
      );

    return Response.json(
      {
        success: true,
        message:
          "Order placed successfully",

        order,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to create order",

        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}