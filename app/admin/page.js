"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "../../components/AdminGuard";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersResponse, productsResponse] =
        await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products?admin=true"),
        ]);

      const ordersData =
        await ordersResponse.json();

      const productsData =
        await productsResponse.json();

      if (!ordersResponse.ok) {
        throw new Error(
          ordersData.message ||
            "Failed to fetch orders"
        );
      }

      if (!productsResponse.ok) {
        throw new Error(
          productsData.message ||
            "Failed to fetch products"
        );
      }

      setOrders(ordersData.orders || []);
      setProducts(productsData.products || []);
    } catch (error) {
      console.error(
        "DASHBOARD ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =========================
  // STATISTICS
  // =========================

  const totalOrders = orders.length;

  // Cancelled orders ko revenue me include nahi karna
  const totalRevenue = orders.reduce(
    (total, order) => {
      if (
        order.orderStatus ===
        "Cancelled"
      ) {
        return total;
      }

      return (
        total +
        Number(order.totalAmount || 0)
      );
    },
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.orderStatus === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.orderStatus === "Delivered"
  ).length;

  const preparingOrders = orders.filter(
    (order) =>
      order.orderStatus ===
        "Preparing" ||
      order.orderStatus ===
        "Confirmed" ||
      order.orderStatus === "Ready"
  ).length;

  const cancelledOrders = orders.filter(
    (order) =>
      order.orderStatus === "Cancelled"
  ).length;

  const totalProducts = products.length;

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.stock) > 0 &&
        Number(product.stock) <= 5
    );

  const outOfStockProducts =
    products.filter(
      (product) =>
        Number(product.stock) === 0
    );

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminGuard>
      <main className="admin-dashboard">

        {/* =========================
            HEADER
        ========================= */}

        <section className="admin-dashboard-header">

          <div>
            <p>
              SMART RESTAURANT
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <span>
              Manage your restaurant
              from one place.
            </span>
          </div>

          <button
            type="button"
            className="admin-refresh-btn"
            onClick={fetchDashboardData}
          >
            ↻ Refresh
          </button>

        </section>

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="admin-dashboard-loading">

            <div className="admin-spinner"></div>

            <p>
              Loading dashboard...
            </p>

          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (
          <div className="admin-dashboard-error">

            <div>
              ⚠️
            </div>

            <h2>
              Unable to load dashboard
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDashboardData}
            >
              Try Again
            </button>

          </div>
        )}

        {/* =========================
            DASHBOARD
        ========================= */}

        {!loading && !error && (
          <>

            {/* =========================
                ORDER STATS
            ========================= */}

            <section className="admin-stats-grid">

              {/* TOTAL ORDERS */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  📦
                </div>

                <div>
                  <span>
                    Total Orders
                  </span>

                  <strong>
                    {totalOrders}
                  </strong>
                </div>

              </div>

              {/* TOTAL REVENUE */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  💰
                </div>

                <div>
                  <span>
                    Total Revenue
                  </span>

                  <strong>
                    ₹
                    {totalRevenue.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

              </div>

              {/* PENDING */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  ⏳
                </div>

                <div>
                  <span>
                    Pending Orders
                  </span>

                  <strong>
                    {pendingOrders}
                  </strong>
                </div>

              </div>

              {/* DELIVERED */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  ✅
                </div>

                <div>
                  <span>
                    Delivered
                  </span>

                  <strong>
                    {deliveredOrders}
                  </strong>
                </div>

              </div>

            </section>

            {/* =========================
                SECONDARY STATS
            ========================= */}

            <section className="admin-secondary-stats">

              {/* ACTIVE ORDERS */}

              <div className="admin-mini-card">

                <span>
                  🔥 Active Orders
                </span>

                <strong>
                  {preparingOrders}
                </strong>

                <small>
                  Confirmed, Preparing
                  or Ready
                </small>

              </div>

              {/* PRODUCTS */}

              <div className="admin-mini-card">

                <span>
                  🍽️ Total Products
                </span>

                <strong>
                  {totalProducts}
                </strong>

                <small>
                  Available products
                </small>

              </div>

              {/* LOW STOCK */}

              <div className="admin-mini-card warning">

                <span>
                  ⚠️ Low Stock
                </span>

                <strong>
                  {lowStockProducts.length}
                </strong>

                <small>
                  5 or fewer items
                  remaining
                </small>

              </div>

              {/* OUT OF STOCK */}

              <div className="admin-mini-card danger">

                <span>
                  🚫 Out of Stock
                </span>

                <strong>
                  {outOfStockProducts.length}
                </strong>

                <small>
                  Currently unavailable
                </small>

              </div>

            </section>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <section className="admin-dashboard-grid">

              {/* =========================
                  RECENT ORDERS
              ========================= */}

              <div className="admin-dashboard-card">

                <div className="admin-card-header">

                  <div>
                    <p>
                      ORDERS
                    </p>

                    <h2>
                      Recent Orders
                    </h2>
                  </div>

                  <Link
                    href="/admin/orders"
                    className="admin-view-btn"
                  >
                    View All
                  </Link>

                </div>

                {recentOrders.length === 0 ? (

                  <div className="admin-no-data">

                    <div>
                      📦
                    </div>

                    <p>
                      No orders yet
                    </p>

                  </div>

                ) : (

                  <div className="admin-recent-orders">

                    {recentOrders.map(
                      (order) => {

                        const orderStatus =
                          order.orderStatus ||
                          "Pending";

                        const statusClass =
                          orderStatus
                            .toLowerCase()
                            .replaceAll(
                              " ",
                              "-"
                            );

                        return (
                          <div
                            className="admin-order-row"
                            key={order._id}
                          >

                            {/* ORDER ID */}

                            <div className="admin-order-id">

                              <strong>
                                #
                                {String(
                                  order._id
                                ).slice(-8)}
                              </strong>

                              <span>
                                {order.customer
                                  ?.name ||
                                  "Customer"}
                              </span>

                            </div>

                            {/* AMOUNT */}

                            <div className="admin-order-amount">

                              <strong>
                                ₹
                                {Number(
                                  order.totalAmount ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>

                              <span>
                                {order.items
                                  ?.length ||
                                  0}{" "}
                                items
                              </span>

                            </div>

                            {/* STATUS */}

                            <span
                              className={`admin-order-status ${statusClass}`}
                            >
                              {orderStatus}
                            </span>

                          </div>
                        );
                      }
                    )}

                  </div>

                )}

              </div>

              {/* =========================
                  LOW STOCK
              ========================= */}

              <div className="admin-dashboard-card">

                <div className="admin-card-header">

                  <div>
                    <p>
                      INVENTORY
                    </p>

                    <h2>
                      Low Stock
                    </h2>
                  </div>

                  <Link
                    href="/admin/products"
                    className="admin-view-btn"
                  >
                    Products
                  </Link>

                </div>

                {lowStockProducts.length === 0 ? (

                  <div className="admin-no-data">

                    <div>
                      ✅
                    </div>

                    <p>
                      All products have
                      healthy stock.
                    </p>

                  </div>

                ) : (

                  <div className="admin-low-stock-list">

                    {lowStockProducts
                      .slice(0, 5)
                      .map((product) => (

                        <div
                          className="admin-stock-row"
                          key={product._id}
                        >

                          <div>

                            <strong>
                              {product.name}
                            </strong>

                            <span>
                              {product.category}
                            </span>

                          </div>

                          <div className="admin-stock-count">

                            <strong>
                              {product.stock}
                            </strong>

                            <span>
                              left
                            </span>

                          </div>

                        </div>

                      ))}

                  </div>

                )}

                {/* OUT OF STOCK ALERT */}

                {outOfStockProducts.length > 0 && (
                  <div className="admin-out-stock-alert">

                    ⚠️{" "}

                    <strong>
                      {
                        outOfStockProducts.length
                      }
                    </strong>{" "}

                    product(s)
                    out of stock

                  </div>
                )}

              </div>

            </section>

            {/* =========================
                QUICK ACTIONS
            ========================= */}

            <section className="admin-dashboard-card admin-quick-actions">

              <div className="admin-card-header">

                <div>

                  <p>
                    MANAGEMENT
                  </p>

                  <h2>
                    Quick Actions
                  </h2>

                </div>

              </div>

              <div className="admin-actions-grid">

                {/* MANAGE ORDERS */}

                <Link
                  href="/admin/orders"
                  className="admin-action-card"
                >

                  <span>
                    📦
                  </span>

                  <div>

                    <strong>
                      Manage Orders
                    </strong>

                    <small>
                      View and update
                      order status
                    </small>

                  </div>

                </Link>

                {/* MANAGE PRODUCTS */}

                <Link
                  href="/admin/products"
                  className="admin-action-card"
                >

                  <span>
                    🍔
                  </span>

                  <div>

                    <strong>
                      Manage Products
                    </strong>

                    <small>
                      Add, edit or remove
                      food items
                    </small>

                  </div>

                </Link>

                {/* MANAGE BOOKINGS */}

                <Link
                  href="/admin/booking"
                  className="admin-action-card"
                >

                  <span>
                    🪑
                  </span>

                  <div>

                    <strong>
                      Manage Bookings
                    </strong>

                    <small>
                      Manage table
                      reservations
                    </small>

                  </div>

                </Link>

                {/* CUSTOMER MENU */}

                <Link
                  href="/menu"
                  className="admin-action-card"
                >

                  <span>
                    👀
                  </span>

                  <div>

                    <strong>
                      View Customer Menu
                    </strong>

                    <small>
                      See public restaurant
                      menu
                    </small>

                  </div>

                </Link>

              </div>

            </section>

          </>
        )}

      </main>
    </AdminGuard>
  );
}