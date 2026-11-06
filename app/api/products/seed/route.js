
import connectDB from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import { foodCatalog } from "../../../../data/menuCatalog";

export async function POST(request) {
  try {
    // Protect the seed API with a secret
    const { secret } = await request.json();

    if (
      !process.env.SEED_SECRET ||
      secret !== process.env.SEED_SECRET
    ) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    await connectDB();

    if (!Array.isArray(foodCatalog) || foodCatalog.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Food catalog is empty",
        },
        { status: 400 }
      );
    }

    const operations = foodCatalog.map((food) => ({
      updateOne: {
        filter: {
          name: food.name,
          category: food.category,
        },
        update: {
          $setOnInsert: {
            name: food.name,
            description: food.description,
            price: food.price,
            category: food.category,
            foodType: food.foodType,
            image: food.image,
            stock: food.stock,
            rating: food.rating,
            isAvailable: food.isAvailable,
          },
        },
        upsert: true,
      },
    }));

    const result = await Product.bulkWrite(operations);

    return Response.json(
      {
        success: true,
        message: "Food catalog processed successfully",
        totalItems: foodCatalog.length,
        inserted: result.upsertedCount,
        alreadyExisting: foodCatalog.length - result.upsertedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SEED PRODUCTS ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to seed food products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
