"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

export default function MenuPage() {
  const {
    addToCart,
  } = useCart();

  const [products, setProducts] =
    useState([]);

  const [filteredProducts, setFilteredProducts] =
    useState([]);

  const [categories, setCategories] =
    useState(["All"]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [addedProduct, setAddedProduct] =
    useState(null);

  // Fetch products from MongoDB
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch("/api/products");

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch products"
        );
      }

      const productList =
        data.products || [];

      setProducts(productList);
      setFilteredProducts(
        productList
      );

      // Create unique categories
      const uniqueCategories = [
        "All",
        ...new Set(
          productList.map(
            (product) =>
              product.category
          )
        ),
      ];

      setCategories(
        uniqueCategories
      );
    } catch (error) {
      console.error(
        "MENU PRODUCTS ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to load menu"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search + Category Filter
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (
      selectedCategory !== "All"
    ) {
      result =
        result.filter(
          (product) =>
            product.category ===
            selectedCategory
        );
    }

    // Search filter
    if (search.trim()) {
      const searchText =
        search
          .toLowerCase()
          .trim();

      result =
        result.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(
                searchText
              ) ||
            product.description
              .toLowerCase()
              .includes(
                searchText
              ) ||
            product.category
              .toLowerCase()
              .includes(
                searchText
              )
        );
    }

    setFilteredProducts(
      result
    );
  }, [
    search,
    selectedCategory,
    products,
  ]);

  const handleAddToCart = (
    product
  ) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      stock: product.stock,
  });

    setAddedProduct(
      product._id
    );

    setTimeout(() => {
      setAddedProduct(null);
    }, 1500);
  };

  if (loading) {
    return (
      <main className="menu-page">

        <section className="menu-header">
          <p>SMART RESTAURANT</p>

          <h1>
            Our Menu
          </h1>

          <span>
            Loading delicious food...
          </span>
        </section>

        <div className="menu-loading">
          <div className="menu-spinner"></div>

          <p>
            Loading menu...
          </p>
        </div>

      </main>
    );
  }

  if (error) {
    return (
      <main className="menu-page">

        <section className="menu-header">
          <p>SMART RESTAURANT</p>

          <h1>
            Our Menu
          </h1>
        </section>

        <div className="menu-error">

          <div>
            ⚠️
          </div>

          <h2>
            Unable to load menu
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={
              fetchProducts
            }
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="menu-page">

      {/* HEADER */}

      <section className="menu-header">

        <p>
          SMART RESTAURANT
        </p>

        <h1>
          Our Menu
        </h1>

        <span>
          Fresh food, delicious taste,
          delivered to your door.
        </span>

      </section>

      {/* SEARCH */}

      <section className="menu-controls">

        <div className="menu-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </section>

      {/* CATEGORIES */}

      <section className="menu-categories">

        {categories.map(
          (category) => (

            <button
              key={category}
              className={
                selectedCategory ===
                category
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() =>
                setSelectedCategory(
                  category
                )
              }
            >
              {category}
            </button>

          )
        )}

      </section>

      {/* PRODUCTS */}

      {filteredProducts.length ===
      0 ? (

        <div className="menu-empty">

          <div>
            🍽️
          </div>

          <h2>
            No Food Found
          </h2>

          <p>
            Try another search or
            category.
          </p>

        </div>

      ) : (

        <section className="menu-grid">

          {filteredProducts.map(
            (product) => (

              <div
                className="food-card"
                key={product._id}
              >

                {/* IMAGE */}

                <div className="food-image">

                  <img
                    src={
                      product.image
                    }
                    alt={
                      product.name
                    }
                  />

                  {product.rating >
                    0 && (

                    <span className="food-rating">
                      ⭐{" "}
                      {
                        product.rating
                      }
                    </span>

                  )}

                </div>

                {/* CONTENT */}

                <div className="food-content">

                  <div className="food-top">

                    <div>

                      <h3>
                        {
                          product.name
                        }
                      </h3>

                      <span>
                        {
                          product.category
                        }
                      </span>

                    </div>

                    <strong>
                      ₹
                      {
                        product.price
                      }
                    </strong>

                  </div>

                  <p>
                    {
                      product.description
                    }
                  </p>

                  {/* STOCK */}

                  {product.stock ===
                  0 ? (

                    <div className="out-of-stock">
                      Out of Stock
                    </div>

                  ) : (

                    <div className="food-bottom">

                      <span className="stock-text">
                        {product.stock <=
                        5
                          ? `Only ${product.stock} left`
                          : "Available"}
                      </span>

                      <button
                        className={
                          addedProduct ===
                          product._id
                            ? "add-cart-btn added"
                            : "add-cart-btn"
                        }
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                      >
                        {addedProduct ===
                        product._id
                          ? "✓ Added"
                          : "+ Add to Cart"}
                      </button>

                    </div>

                  )}

                </div>

              </div>

            )
          )}

        </section>

      )}

    </main>
  );
}