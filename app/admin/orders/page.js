"use client";

import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/orders");
      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Server returned:", text);

        throw new Error(
          "Invalid server response. Status: " +
          response.status
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const token = localStorage.getItem(
        "smartRestaurantToken"
      );

      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderStatus: status,
        }),
      });

      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch (error) {
        throw new Error(
          "Server did not return valid JSON. Status: " +
          response.status
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update order"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === id
            ? {
              ...order,
              orderStatus:
                result.order?.orderStatus || status,
            }
            : order
        )
      );

      alert("Order status updated successfully");
    } catch (error) {
      console.error("Update status error:", error);
      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <main className="admin-orders-page">

          <div className="admin-orders-header">

            <p>ADMIN PANEL</p>

            <h1>
              Orders Management
            </h1>

            <span>
              Manage customer orders and
              update their status.
            </span>

          </div>

          <div className="admin-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading orders...
            </p>

          </div>

        </main>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>

      <main className="admin-orders-page">

        {/* HEADER */}

        <div className="admin-orders-header">

          <div>

            <p>ADMIN PANEL</p>

            <h1>
              Orders Management
            </h1>

            <span>
              Manage customer orders and
              update their status.
            </span>

          </div>

          <div className="orders-count-box">

            <span>
              Total Orders
            </span>

            <strong>
              {orders.length}
            </strong>

          </div>

        </div>

        {/* STATS */}

        {orders.length > 0 && (

          <div className="order-stats">

            <div className="order-stat-card">

              <div className="stat-icon">
                📦
              </div>

              <div>

                <span>
                  Total Orders
                </span>

                <strong>
                  {orders.length}
                </strong>

              </div>

            </div>

            <div className="order-stat-card pending-card">

              <div className="stat-icon">
                ⏳
              </div>

              <div>

                <span>
                  Pending
                </span>

                <strong>
                  {
                    orders.filter(
                      (order) =>
                        order.orderStatus ===
                        "Pending"
                    ).length
                  }
                </strong>

              </div>

            </div>

            <div className="order-stat-card preparing-card">

              <div className="stat-icon">
                👨‍🍳
              </div>

              <div>

                <span>
                  Preparing
                </span>

                <strong>
                  {
                    orders.filter(
                      (order) =>
                        order.orderStatus ===
                        "Preparing"
                    ).length
                  }
                </strong>

              </div>

            </div>

            <div className="order-stat-card delivered-card">

              <div className="stat-icon">
                ✅
              </div>

              <div>

                <span>
                  Delivered
                </span>

                <strong>
                  {
                    orders.filter(
                      (order) =>
                        order.orderStatus ===
                        "Delivered"
                    ).length
                  }
                </strong>

              </div>

            </div>

          </div>

        )}

        {/* EMPTY */}

        {orders.length === 0 ? (

          <div className="admin-empty-orders">

            <div className="empty-order-icon">
              📦
            </div>

            <h2>
              No Orders Found
            </h2>

            <p>
              Customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-orders-list">

            {orders.map((order) => (

              <div
                className="admin-order-card"
                key={order._id}
              >

                {/* ORDER HEADER */}

                <div className="admin-order-top">

                  <div className="order-id-section">

                    <p className="order-label">
                      ORDER ID
                    </p>

                    <h2>
                      #{order._id.slice(-8)}
                    </h2>

                  </div>

                  <div className="order-date">

                    <span>
                      Placed on
                    </span>

                    <strong>
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>

                {/* ORDER CONTENT */}

                <div className="admin-order-grid">

                  {/* CUSTOMER */}

                  <div className="order-customer order-box">

                    <div className="section-title">

                      <span className="section-icon">
                        👤
                      </span>

                      <h3>
                        Customer Details
                      </h3>

                    </div>

                    <div className="customer-info">

                      <div>

                        <span>
                          Name
                        </span>

                        <strong>
                          {order.customer?.name}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Phone
                        </span>

                        <strong>
                          {order.customer?.phone}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Address
                        </span>

                        <strong>
                          {order.customer?.address}
                        </strong>

                      </div>

                      <div className="two-column">

                        <div>

                          <span>
                            City
                          </span>

                          <strong>
                            {order.customer?.city}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Pincode
                          </span>

                          <strong>
                            {order.customer?.pincode}
                          </strong>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ITEMS */}

                  <div className="order-items order-box">

                    <div className="section-title">

                      <span className="section-icon">
                        🍽️
                      </span>

                      <h3>
                        Order Items
                      </h3>

                    </div>

                    <div className="items-list">

                      {order.items?.map(
                        (item, index) => (

                          <div
                            className="admin-order-item"
                            key={index}
                          >

                            <img
                              src={item.image}
                              alt={item.name}
                            />

                            <div className="item-details">

                              <strong>
                                {item.name}
                              </strong>

                              <p>
                                ₹{item.price} ×{" "}
                                {item.quantity}
                              </p>

                            </div>

                            <strong className="item-price">
                              ₹
                              {item.price *
                                item.quantity}
                            </strong>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                  {/* BILL */}

                  <div className="order-bill order-box">

                    <div className="section-title">

                      <span className="section-icon">
                        💰
                      </span>

                      <h3>
                        Bill Details
                      </h3>

                    </div>

                    <div className="bill-details">

                      <p>

                        <span>
                          Subtotal
                        </span>

                        <strong>
                          ₹{order.subtotal}
                        </strong>

                      </p>

                      <p>

                        <span>
                          Tax
                        </span>

                        <strong>
                          ₹{order.tax}
                        </strong>

                      </p>

                      <p>

                        <span>
                          Delivery
                        </span>

                        <strong
                          className={
                            order.deliveryFee ===
                              0
                              ? "free-delivery"
                              : ""
                          }
                        >

                          {order.deliveryFee ===
                            0
                            ? "FREE"
                            : "₹" +
                            order.deliveryFee}

                        </strong>

                      </p>

                      <hr />

                      <p className="bill-total">

                        <span>
                          Total
                        </span>

                        <strong>
                          ₹{order.totalAmount}
                        </strong>

                      </p>

                      <div className="payment-method">

                        <span>
                          Payment
                        </span>

                        <strong>
                          {order.paymentMethod}
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

                {/* STATUS */}

                <div className="order-status-section">

                  <div className="status-left">

                    <span className="status-icon">
                      🔄
                    </span>

                    <div>

                      <label>
                        Order Status
                      </label>

                      <span className="status-description">
                        Update the current order progress
                      </span>

                    </div>

                  </div>

                  <div className="status-right">

                    <select
                      className={`order-status-select status-${(
                        order.orderStatus ||
                        "Pending"
                      )
                        .toLowerCase()
                        .replaceAll(
                          " ",
                          "-"
                        )}`}
                      value={
                        order.orderStatus ||
                        "Pending"
                      }
                      disabled={
                        updatingId ===
                        order._id
                      }
                      onChange={(e) =>
                        updateOrderStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Preparing">
                        Preparing
                      </option>

                      <option value="Ready">
                        Ready
                      </option>

                      <option value="Out for Delivery">
                        Out for Delivery
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                    {updatingId ===
                      order._id && (

                        <span className="updating-text">
                          Updating...
                        </span>

                      )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </AdminGuard>
  );
}