import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    // Connect MongoDB
    await connectDB();

    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // Check fields
    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    // Find user
    const user = await User.findOne({ email });

    console.log("LOGIN EMAIL:", email);
    console.log("USER FOUND:", !!user);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found. Please register first.",
        },
        {
          status: 404,
        }
      );
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    console.log(
      "PASSWORD CORRECT:",
      isPasswordCorrect
    );

    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // JWT secret
    const secret = process.env.JWT_SECRET;

    console.log(
      "JWT SECRET EXISTS:",
      !!secret
    );

    if (!secret) {
      return Response.json(
        {
          success: false,
          message:
            "JWT_SECRET is missing in .env.local",
        },
        {
          status: 500,
        }
      );
    }

    // Create token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    return Response.json(
      {
        success: true,
        message: "Login successful",

        token,

        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("================================");
    console.error("LOGIN API ERROR:", error);
    console.error("ERROR MESSAGE:", error.message);
    console.error("================================");

    return Response.json(
      {
        success: false,
        message: error.message || "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}