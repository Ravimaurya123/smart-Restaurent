import connectDB from "../../../lib/mongodb";
import Product from "../../../models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const admin =
      searchParams.get("admin");

    let query = {};

    // Customer gets only available products
    if (admin !== "true") {
      query = {
        isAvailable: true,
      };
    }

    const products =
      await Product.find(query)
        .sort({
          createdAt: -1,
        })
        .lean();

    return Response.json(
      {
        success: true,
        products,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to fetch products",
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}