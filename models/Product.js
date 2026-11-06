import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Pizza",
        "Burgers",
        "Sandwiches",
        "Momos",
        "Pasta",
        "Chinese",
        "Fries & Starters",
        "Rolls & Wraps",
        "Chicken Specials",
        "Mutton & Fish",
        "Indian Meals",
        "Street Food",
        "Maggi & Snacks",
        "Desserts",
        "Beverages",
      ],
    },

    foodType: {
      type: String,
      enum: ["Veg", "Non-Veg"],
      default: "Veg",
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

export default Product;