"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
];

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "smartRestaurantToken"
        );

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        "/api/orders/my-orders",
        {
          headers: {
            Authorization:
              "Bearer " + token,
          },
        }
      );

      const data =
        await response.json();

      if (
        response.status === 401
      ) {
        localStorage.removeItem(
          "smartRestaurantToken"
        );

        localStorage.removeItem(
          "smartRestaurantUser"
        );

        router.replace("/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch orders"
        );
      }

      setOrders(
        data.orders || []
      );
    } catch (error) {
      console.error(
        "MY ORDERS ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStatusIndex = (
    status
  ) => {
    return statuses.indexOf(status);
  };

  if (loading) {
    return (
      <main className="my-orders-page">

        <div className="my-orders-header">

          <p>SMART RESTAURANT</p>

          <h1>
            My Orders
          </h1>

          <span>
            Track all your restaurant
            orders in one place.
          </span>

        </div>

        <div className="orders-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading your orders...
          </p>
        </div>

      </main>
    );
  }

  if (error) {
    return (
      <main className="my-orders-page">

        <div className="my-orders-header">

          <p>SMART RESTAURANT</p>

          <h1>
            My Orders
          </h1>

        </div>

        <div className="orders-error">

          <div>
            ⚠️
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={fetchMyOrders}
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="my-orders-page">

      {/* HEADER */}

      <div className="my-orders-header">

        <div>

          <p>
            SMART RESTAURANT
          </p>

          <h1>
            My Orders
          </h1>

          <span>
            Track all your restaurant
            orders in one place.
          </span>

        </div>

        <Link
          href="/menu"
          className="orders-menu-btn"
        >
          + Order More
        </Link>

      </div>

      {/* EMPTY */}

      {orders.length === 0 ? (

        <div className="orders-empty">

          <div className="empty-orders-icon">
            📦
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any
            orders yet.
          </p>

          <Link
            href="/menu"
            className="orders-menu-btn"
          >
            Explore Menu
          </Link>

        </div>

      ) : (

        <div className="my-orders-list">

          {orders.map((order) => {

            const currentStatus =
              getStatusIndex(
                order.orderStatus
              );

            const isCancelled =
              order.orderStatus ===
              "Cancelled";

            return (
              <div
                className="my-order-card"
                key={order._id}
              >

                {/* ORDER HEADER */}

                <div className="my-order-top">

                  <div>

                    <p>
                      ORDER ID
                    </p>

                    <h2>
                      #{order._id.slice(-8)}
                    </h2>

                  </div>

                  <div className="my-order-date">

                    <span>
                      Ordered on
                    </span>

                    <strong>
                      {new Date(
                        order.createdAt
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </div>

                {/* STATUS */}

                <div className="tracking-section">

                  <div className="tracking-title">

                    <div>

                      <p>
                        ORDER TRACKING
                      </p>

                      <h3>
                        {isCancelled
                          ? "Order Cancelled"
                          : order.orderStatus}
                      </h3>

                    </div>

                    <span
                      className={`tracking-status ${
                        isCancelled
                          ? "cancelled"
                          : ""
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                  </div>

                  {!isCancelled && (

                    <div className="tracking">

                      {statuses.map(
                        (
                          status,
                          index
                        ) => {

                          const completed =
                            index <=
                            currentStatus;

                          const active =
                            index ===
                            currentStatus;

                          return (
                            <div
                              className={`tracking-step ${
                                completed
                                  ? "completed"
                                  : ""
                              } ${
                                active
                                  ? "active"
                                  : ""
                              }`}
                              key={
                                status
                              }
                            >

                              <div className="tracking-circle">

                                {completed
                                  ? "✓"
                                  : index + 1}

                              </div>

                              <span>
                                {status}
                              </span>

                            </div>
                          );
                        }
                      )}

                    </div>

                  )}

                </div>

                {/* CONTENT */}

                <div className="my-order-content">

                  {/* ITEMS */}

                  <div className="my-order-box">

                    <div className="my-order-box-title">

                      <span>
                        🍽️
                      </span>

                      <h3>
                        Order Items
                      </h3>

                    </div>

                    <div className="my-order-items">

                      {order.items?.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            className="my-order-item"
                            key={index}
                          >

                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                            />

                            <div>

                              <strong>
                                {item.name}
                              </strong>

                              <span>
                                ₹
                                {
                                  item.price
                                }{" "}
                                ×{" "}
                                {
                                  item.quantity
                                }
                              </span>

                            </div>

                            <strong>
                              ₹
                              {item.price *
                                item.quantity}
                            </strong>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                  {/* DELIVERY */}

                  <div className="my-order-box">

                    <div className="my-order-box-title">

                      <span>
                        📍
                      </span>

                      <h3>
                        Delivery Address
                      </h3>

                    </div>

                    <div className="delivery-details">

                      <strong>
                        {
                          order.customer
                            ?.name
                        }
                      </strong>

                      <p>
                        {
                          order.customer
                            ?.address
                        }
                      </p>

                      <p>
                        {
                          order.customer
                            ?.city
                        }{" "}
                        -{" "}
                        {
                          order.customer
                            ?.pincode
                        }
                      </p>

                      <span>
                        📞{" "}
                        {
                          order.customer
                            ?.phone
                        }
                      </span>

                    </div>

                  </div>

                  {/* BILL */}

                  <div className="my-order-box">

                    <div className="my-order-box-title">

                      <span>
                        💰
                      </span>

                      <h3>
                        Bill Summary
                      </h3>

                    </div>

                    <div className="my-bill">

                      <div>
                        <span>
                          Subtotal
                        </span>

                        <strong>
                          ₹
                          {
                            order.subtotal
                          }
                        </strong>
                      </div>

                      <div>
                        <span>
                          Tax
                        </span>

                        <strong>
                          ₹
                          {order.tax}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Delivery
                        </span>

                        <strong>
                          {order.deliveryFee ===
                          0
                            ? "FREE"
                            : "₹" +
                              order.deliveryFee}
                        </strong>
                      </div>

                      <hr />

                      <div className="my-bill-total">

                        <span>
                          Total
                        </span>

                        <strong>
                          ₹
                          {
                            order.totalAmount
                          }
                        </strong>

                      </div>

                      <div className="my-payment">

                        <span>
                          Payment
                        </span>

                        <strong>
                          {
                            order.paymentMethod
                          }
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </main>
  );
}