"use client";

import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
  rating: "",
  isAvailable: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch products"
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error(
        "Fetch products error:",
        error
      );

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const url = editingId
        ? "/api/products/" + editingId
        : "/api/products";

      const method = editingId
        ? "PATCH"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          image: form.image,
          stock: Number(form.stock),
          rating:
            form.rating === ""
              ? 0
              : Number(form.rating),
          isAvailable:
            form.isAvailable,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save product"
        );
      }

      alert(
        editingId
          ? "Product updated successfully"
          : "Product added successfully"
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      fetchProducts();
    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description:
        product.description || "",
      price: product.price ?? "",
      category:
        product.category || "",
      image: product.image || "",
      stock: product.stock ?? "",
      rating: product.rating ?? "",
      isAvailable:
        product.isAvailable !== false,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        "/api/products/" + id,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete product"
        );
      }

      alert(
        "Product deleted successfully"
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const categories = [
    "All",
    ...new Set(
      products.map(
        (product) => product.category
      )
    ),
  ];

  const filteredProducts =
    products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        categoryFilter === "All" ||
        product.category ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  if (loading) {
    return (
      <AdminGuard>

        <main className="admin-products-page">

          <div className="admin-products-header">

            <div>

              <p>ADMIN PANEL</p>

              <h1>
                Product Management
              </h1>

              <span>
                Manage restaurant products,
                pricing and stock.
              </span>

            </div>

          </div>

          <div className="admin-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading products...
            </p>

          </div>

        </main>

      </AdminGuard>
    );
  }

  return (
    <AdminGuard>

      <main className="admin-products-page">

        {/* HEADER */}

        <div className="admin-products-header">

          <div>

            <p>ADMIN PANEL</p>

            <h1>
              Product Management
            </h1>

            <span>
              Manage restaurant products,
              pricing and stock.
            </span>

          </div>

          <button
            className="add-product-btn"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
          >
            + Add Product
          </button>

        </div>

        {/* STATS */}

        <div className="product-stats">

          <div className="product-stat-card">

            <span>📦</span>

            <div>

              <small>
                Total Products
              </small>

              <strong>
                {products.length}
              </strong>

            </div>

          </div>

          <div className="product-stat-card">

            <span>✅</span>

            <div>

              <small>
                Available
              </small>

              <strong>
                {
                  products.filter(
                    (product) =>
                      product.isAvailable
                  ).length
                }
              </strong>

            </div>

          </div>

          <div className="product-stat-card">

            <span>⚠️</span>

            <div>

              <small>
                Low Stock
              </small>

              <strong>
                {
                  products.filter(
                    (product) =>
                      product.stock > 0 &&
                      product.stock <= 5
                  ).length
                }
              </strong>

            </div>

          </div>

          <div className="product-stat-card">

            <span>❌</span>

            <div>

              <small>
                Out of Stock
              </small>

              <strong>
                {
                  products.filter(
                    (product) =>
                      product.stock === 0
                  ).length
                }
              </strong>

            </div>

          </div>

        </div>

        {/* ADD / EDIT FORM */}

        {showForm && (

          <div className="product-form-card">

            <div className="product-form-header">

              <div>

                <h2>
                  {editingId
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p>
                  Enter product information
                  below.
                </p>

              </div>

              <button
                className="close-form-btn"
                onClick={handleCancel}
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="product-form"
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Pizza, Burger, Indian..."
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="299"
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="20"
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Rating
                  </label>

                  <input
                    type="number"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="4.5"
                    min="0"
                    max="5"
                    step="0.1"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    required
                  />

                </div>

                <div className="form-group full-width">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter product description..."
                    rows="4"
                    required
                  />

                </div>

                <div className="availability-checkbox">

                  <label>

                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={
                        form.isAvailable
                      }
                      onChange={handleChange}
                    />

                    <span>
                      Product is available
                    </span>

                  </label>

                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-product-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-product-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Add Product"}
                </button>

              </div>

            </form>

          </div>

        )}

        {/* SEARCH + FILTER */}

        <div className="products-toolbar">

          <div className="product-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="category-filter">

            <label>
              Category:
            </label>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
            >

              {categories.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>

                )
              )}

            </select>

          </div>

        </div>

        {/* PRODUCTS */}

        {filteredProducts.length === 0 ? (

          <div className="admin-empty-products">

            <div>
              📦
            </div>

            <h2>
              No Products Found
            </h2>

            <p>
              Add a product or change
              your search.
            </p>

          </div>

        ) : (

          <div className="products-grid">

            {filteredProducts.map(
              (product) => (

                <div
                  className="product-admin-card"
                  key={product._id}
                >

                  <div className="admin-product-image">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <span
                      className={
                        product.isAvailable
                          ? "available-badge"
                          : "unavailable-badge"
                      }
                    >
                      {product.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </div>

                  <div className="admin-product-content">

                    <div className="product-card-top">

                      <div>

                        <span className="product-category">
                          {product.category}
                        </span>

                        <h3>
                          {product.name}
                        </h3>

                      </div>

                      <strong className="product-price">
                        ₹{product.price}
                      </strong>

                    </div>

                    <p className="product-description">
                      {product.description}
                    </p>

                    <div className="product-rating">

                      <span>
                        ⭐
                      </span>

                      <strong>
                        {product.rating ||
                          "0.0"}
                      </strong>

                      <span>
                        / 5
                      </span>

                    </div>

                    <div className="product-stock">

                      <span>
                        Stock
                      </span>

                      <strong
                        className={
                          product.stock === 0
                            ? "out-stock"
                            : product.stock <= 5
                            ? "low-stock"
                            : "good-stock"
                        }
                      >
                        {product.stock}
                      </strong>

                    </div>

                    <div className="product-actions">

                      <button
                        className="edit-product-btn"
                        onClick={() =>
                          handleEdit(product)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-product-btn"
                        disabled={
                          deletingId ===
                          product._id
                        }
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                      >
                        {deletingId ===
                        product._id
                          ? "Deleting..."
                          : "🗑️ Delete"}
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </main>

    </AdminGuard>
  );
}