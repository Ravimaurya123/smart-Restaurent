"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

const categories = [
  "All Items",
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
];

const categorySlides = [
  {
    title: "Delicious Pizza",
    subtitle: "Freshly baked, cheesy and full of flavour.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400",
  },
  {
    title: "Tasty Burgers",
    subtitle: "Big bites. Better flavours.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400",
  },
  {
    title: "Sweet Treats",
    subtitle: "Make every meal a little sweeter.",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1400",
  },
];

const nonVegOnlyCategories = [
  "Chicken Specials",
  "Mutton & Fish",
];

const vegOnlyCategories = [
  "Desserts",
  "Beverages",
];

function getFoodType(product) {
  if (nonVegOnlyCategories.includes(product.category)) {
    return "Non-Veg";
  }

  if (vegOnlyCategories.includes(product.category)) {
    return "Veg";
  }

  return product.foodType || "Veg";
}

export default function MenuPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All Items");
  const [selectedFoodType, setSelectedFoodType] =
    useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedProduct, setAddedProduct] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(data.products || []);
    } catch (err) {
      console.error("MENU PRODUCTS ERROR:", err);
      setError(err.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Automatic image slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) =>
        (current + 1) % categorySlides.length
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const availableFoodTypes = useMemo(() => {
    if (nonVegOnlyCategories.includes(selectedCategory)) {
      return ["All", "Non-Veg"];
    }

    if (vegOnlyCategories.includes(selectedCategory)) {
      return ["All", "Veg"];
    }

    return ["All", "Veg", "Non-Veg"];
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All Items") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedFoodType !== "All") {
      result = result.filter(
        (product) => getFoodType(product) === selectedFoodType
      );
    }

    const searchText = search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((product) => {
        const name = (product.name || "").toLowerCase();
        const description = (
          product.description || ""
        ).toLowerCase();
        const category = (
          product.category || ""
        ).toLowerCase();

        return (
          name.includes(searchText) ||
          description.includes(searchText) ||
          category.includes(searchText)
        );
      });
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedFoodType,
    search,
  ]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedFoodType("All");
  };

  const prepareCartProduct = (product) => ({
    id: product._id,
    name: product.name,
    price: Number(product.price),
    image: product.image,
    category: product.category,
    foodType: getFoodType(product),
    description: product.description,
    stock: Number(product.stock) || 0,
  });

  const handleAddToCart = (product) => {
    if (!product._id) {
      alert("This product is not saved in the database yet.");
      return;
    }

    if (!product.stock || product.stock <= 0) {
      alert("This item is currently out of stock.");
      return;
    }

    addToCart(prepareCartProduct(product));
    setAddedProduct(product._id);

    setTimeout(() => {
      setAddedProduct(null);
    }, 1500);
  };

  const handleBuyNow = (product) => {
    if (!product._id) {
      alert("This product is not saved in the database yet.");
      return;
    }

    if (!product.stock || product.stock <= 0) {
      alert("This item is currently out of stock.");
      return;
    }

    addToCart(prepareCartProduct(product));
    router.push("/checkout");
  };

  if (loading) {
    return (
      <main className="menu-page">
        <section className="menu-header">
          <p>SMART RESTAURANT</p>
          <h1>Our Menu</h1>
          <span>Loading delicious food...</span>
        </section>

        <div className="menu-loading">
          <div className="menu-spinner"></div>
          <p>Loading menu...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="menu-page">
        <section className="menu-header">
          <p>SMART RESTAURANT</p>
          <h1>Our Menu</h1>
        </section>

        <div className="menu-error">
          <div>⚠️</div>
          <h2>Unable to load menu</h2>
          <p>{error}</p>
          <button onClick={fetchProducts}>Try Again</button>
        </div>
      </main>
    );
  }

  const slide = categorySlides[activeSlide];

  return (
    <main className="menu-page">
      <section className="menu-header">
        <p>SMART RESTAURANT</p>
        <h1>Our Menu</h1>
        <span>
          Fresh food, delicious taste, delivered to your door.
        </span>
      </section>

      {/* FEATURED FOOD IMAGE SLIDER */}
      <section className="menu-hero-slider">
        <img src={slide.image} alt={slide.title} />

        <div className="menu-slider-overlay">
          <span>MADE FRESH FOR YOU</span>
          <h2>{slide.title}</h2>
          <p>{slide.subtitle}</p>

          <button
            onClick={() => {
              setSelectedCategory("All Items");
              setSelectedFoodType("All");
              document
                .querySelector(".menu-categories")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Menu
          </button>
        </div>

        <div className="menu-slider-dots">
          {categorySlides.map((item, index) => (
            <button
              key={item.title}
              className={
                activeSlide === index ? "active" : ""
              }
              onClick={() => setActiveSlide(index)}
              aria-label={`Show ${item.title}`}
            />
          ))}
        </div>

        <button
          className="menu-slide-arrow prev"
          onClick={() =>
            setActiveSlide(
              (activeSlide - 1 + categorySlides.length) %
                categorySlides.length
            )
          }
          aria-label="Previous slide"
        >
          ‹
        </button>

        <button
          className="menu-slide-arrow next"
          onClick={() =>
            setActiveSlide(
              (activeSlide + 1) % categorySlides.length
            )
          }
          aria-label="Next slide"
        >
          ›
        </button>
      </section>

      {/* SEARCH */}
      <section className="menu-controls">
        <div className="menu-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="menu-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "category-btn active"
                : "category-btn"
            }
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </section>

      {/* VEG / NON-VEG FILTER */}
      <section className="food-type-filters">
        {availableFoodTypes.map((type) => (
          <button
            key={type}
            className={[
              "food-type-btn",
              type === "Veg" ? "veg-filter" : "",
              type === "Non-Veg" ? "nonveg-filter" : "",
              selectedFoodType === type ? "active" : "",
            ].join(" ")}
            onClick={() => setSelectedFoodType(type)}
          >
            {type === "All"
              ? "All"
              : type === "Veg"
              ? "🟢 Veg"
              : "🔴 Non-Veg"}
          </button>
        ))}
      </section>

      {/* RESULT COUNT */}
      <div className="menu-result-count">
        Showing <strong>{filteredProducts.length}</strong> items
      </div>

      {/* PRODUCTS */}
      {filteredProducts.length === 0 ? (
        <div className="menu-empty">
          <div>🍽️</div>
          <h2>No Food Found</h2>
          <p>
            No products are available for this selection.
            Try another category or add products from Admin Panel.
          </p>
        </div>
      ) : (
        <section className="menu-grid">
          {filteredProducts.map((product) => {
            const foodType = getFoodType(product);
            const isOutOfStock =
              !product.stock || product.stock <= 0;

            return (
              <article
                className="food-card"
                key={product._id}
              >
                <div className="food-image">
                  <img
                    src={
                      product.image ||
                      "/images/food-placeholder.jpg"
                    }
                    alt={product.name}
                    loading="lazy"
                  />

                  <span
                    className={
                      foodType === "Veg"
                        ? "food-type-badge veg-badge"
                        : "food-type-badge nonveg-badge"
                    }
                  >
                    {foodType === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}
                  </span>

                  {product.rating > 0 && (
                    <span className="food-rating">
                      ⭐ {product.rating}
                    </span>
                  )}
                </div>

                <div className="food-content">
                  <div className="food-top">
                    <div>
                      <h3>{product.name}</h3>
                      <span>{product.category}</span>
                    </div>

                    <strong>₹{product.price}</strong>
                  </div>

                  <p>
                    {product.description ||
                      "Freshly prepared with quality ingredients."}
                  </p>

                  {isOutOfStock ? (
                    <div className="out-of-stock">
                      Out of Stock
                    </div>
                  ) : (
                    <>
                      <div className="food-stock-row">
                        <span className="stock-text">
                          {product.stock <= 5
                            ? `Only ${product.stock} left`
                            : "Available"}
                        </span>
                      </div>

                      <div className="food-action-buttons">
                        <button
                          className={
                            addedProduct === product._id
                              ? "add-cart-btn added"
                              : "add-cart-btn"
                          }
                          onClick={() =>
                            handleAddToCart(product)
                          }
                        >
                          {addedProduct === product._id
                            ? "✓ Added"
                            : "+ Add to Cart"}
                        </button>

                        <button
                          className="buy-now-btn"
                          onClick={() =>
                            handleBuyNow(product)
                          }
                        >
                          Buy Now
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}