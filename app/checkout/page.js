"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cart,
    totalPrice,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
  });

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [orderId, setOrderId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================
  // ORDER PRICE CALCULATION
  // =========================================

  const tax = Math.round(
    totalPrice * 0.05
  );

  const deliveryFee =
    totalPrice >= 500 ? 0 : 40;

  const finalTotal =
    totalPrice +
    tax +
    deliveryFee;

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );

    setError("");
  };

  // =========================================
  // PLACE ORDER
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // =====================================
      // CHECK LOGIN
      // =====================================

      const token =
        localStorage.getItem(
          "smartRestaurantToken"
        );

      if (!token) {
        router.push("/login");
        return;
      }

      // =====================================
      // CHECK CART
      // =====================================

      if (cart.length === 0) {
        throw new Error(
          "Your cart is empty."
        );
      }

      // =====================================
      // VALIDATE PHONE
      // =====================================

      if (
        !/^[0-9]{10}$/.test(
          formData.phone
        )
      ) {
        throw new Error(
          "Please enter a valid 10-digit phone number."
        );
      }

      // =====================================
      // VALIDATE PINCODE
      // =====================================

      if (
        !/^[0-9]{6}$/.test(
          formData.pincode
        )
      ) {
        throw new Error(
          "Please enter a valid 6-digit pincode."
        );
      }

      // =====================================
      // PREPARE ORDER DATA
      // =====================================

      const orderData = {
        customer: {
          name:
            formData.name.trim(),

          phone:
            formData.phone.trim(),

          address:
            formData.address.trim(),

          city:
            formData.city.trim(),

          pincode:
            formData.pincode.trim(),
        },

        items: cart.map(
          (item) => ({
            foodId: Number(
              item.id
            ),

            name: item.name,

            price: Number(
              item.price
            ),

            quantity: Number(
              item.quantity
            ),

            image: item.image,

            category:
              item.category,
          })
        ),

        subtotal:
          Number(totalPrice),

        tax:
          Number(tax),

        deliveryFee:
          Number(deliveryFee),

        totalAmount:
          Number(finalTotal),

        paymentMethod:
          formData.paymentMethod,
      };

      console.log(
        "Sending Order:",
        orderData
      );

      // =====================================
      // SEND ORDER TO API
      // =====================================

      const response =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                orderData
              ),
          }
        );

      // =====================================
      // READ SERVER RESPONSE
      // =====================================

      const responseText =
        await response.text();

      let data = {};

      try {
        data =
          responseText
            ? JSON.parse(
                responseText
              )
            : {};
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      console.log(
        "Order API Response:",
        data
      );

      // =====================================
      // TOKEN EXPIRED / INVALID
      // =====================================

      if (
        response.status === 401
      ) {
        localStorage.removeItem(
          "smartRestaurantToken"
        );

        localStorage.removeItem(
          "smartRestaurantUser"
        );

        setError(
          "Your login session has expired. Please login again."
        );

        setTimeout(() => {
          router.push(
            "/login"
          );
        }, 1200);

        return;
      }

      // =====================================
      // API ERROR
      // =====================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to create order."
        );
      }

      // =====================================
      // CHECK ORDER
      // =====================================

      if (!data.order) {
        throw new Error(
          "Order was not created correctly."
        );
      }

      // =====================================
      // SUCCESS
      // =====================================

      setOrderId(
        data.order._id
      );

      setOrderPlaced(true);

      // Clear cart only after
      // successful order creation
      clearCart();

    } catch (error) {
      console.error(
        "CREATE ORDER ERROR:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // EMPTY CART
  // =========================================

  if (
    cart.length === 0 &&
    !orderPlaced
  ) {
    return (
      <main className="checkout-page empty-checkout">

        <h1>
          Your Cart is Empty 🛒
        </h1>

        <p>
          Please add some food before
          going to checkout.
        </p>

        <Link
          href="/menu"
          className="primary-btn"
        >
          Explore Menu
        </Link>

      </main>
    );
  }

  // =========================================
  // ORDER SUCCESS
  // =========================================

  if (orderPlaced) {
    return (
      <main className="checkout-page">

        <div className="order-success">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Order Placed Successfully!
          </h1>

          <p>
            Thank you,{" "}
            <strong>
              {formData.name}
            </strong>
            . Your order has been
            received.
          </p>

          <div className="success-details">

            <p>
              <strong>
                Order ID:
              </strong>{" "}
              {orderId}
            </p>

            <p>
              <strong>
                Payment:
              </strong>{" "}
              {formData.paymentMethod}
            </p>

            <p>
              <strong>
                Total:
              </strong>{" "}
              ₹{finalTotal}
            </p>

            <p>
              <strong>
                Delivery Address:
              </strong>{" "}
              {formData.address},{" "}
              {formData.city} -{" "}
              {formData.pincode}
            </p>

          </div>

          <div className="success-buttons">

            <Link
              href="/orders"
              className="primary-btn"
            >
              Track My Order
            </Link>

            <Link
              href="/menu"
              className="secondary-btn"
            >
              Order More Food
            </Link>

            <Link
              href="/"
              className="secondary-btn"
            >
              Go Home
            </Link>

          </div>

        </div>

      </main>
    );
  }

  // =========================================
  // CHECKOUT PAGE
  // =========================================

  return (
    <main className="checkout-page">

      {/* HEADER */}

      <section className="checkout-header">

        <p>
          CHECKOUT
        </p>

        <h1>
          Complete Your Order
        </h1>

        <span>
          Enter your details and choose
          your payment method.
        </span>

      </section>

      {/* CHECKOUT CONTAINER */}

      <section className="checkout-container">

        {/* ===================================
            LEFT SIDE
        =================================== */}

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          {/* DELIVERY INFORMATION */}

          <div className="checkout-card">

            <h2>
              Delivery Information
            </h2>

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />

            </div>

            <div className="form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                inputMode="numeric"
                required
                disabled={loading}
              />

            </div>

            <div className="form-group">

              <label>
                Delivery Address
              </label>

              <textarea
                name="address"
                placeholder="House number, street, area..."
                value={formData.address}
                onChange={handleChange}
                rows="4"
                required
                disabled={loading}
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

              </div>

              <div className="form-group">

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  placeholder="6-digit pincode"
                  value={
                    formData.pincode
                  }
                  onChange={
                    handleChange
                  }
                  maxLength="6"
                  inputMode="numeric"
                  required
                  disabled={loading}
                />

              </div>

            </div>

          </div>

          {/* =================================
              PAYMENT
          ================================= */}

          <div className="checkout-card">

            <h2>
              Payment Method
            </h2>

            <label className="payment-option">

              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={
                  formData.paymentMethod ===
                  "Cash on Delivery"
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              />

              <div>

                <strong>
                  Cash On Delivery
                </strong>

                <span>
                  Pay when your order Arrives.
                </span>

              </div>

            </label>

            <label className="payment-option">

              <input
                type="radio"
                name="paymentMethod"
                value="Online Payment"
                checked={
                  formData.paymentMethod ===
                  "Online Payment"
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              />

              <div>

                <strong>
                  Online Payment
                </strong>

                <span>
                  UPI, Card or Net Banking.
                </span>

              </div>

            </label>

          </div>

          {/* =================================
              ERROR
          ================================= */}

          {error && (
            <div
              className="checkout-error"
              style={{
                color: "#ff5c5c",

                background:
                  "#1a0d0d",

                border:
                  "1px solid #5c2020",

                padding: "15px",

                borderRadius:
                  "10px",

                marginBottom:
                  "15px",
              }}
            >

              <strong>
                Order Failed:
              </strong>

              <p
                style={{
                  margin:
                    "6px 0 0",
                }}
              >
                {error}
              </p>

            </div>
          )}

          {/* =================================
              PLACE ORDER
          ================================= */}

          <button
            type="submit"
            className="place-order-btn"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : `Place Order • ₹${finalTotal}`}
          </button>

        </form>

        {/* ===================================
            RIGHT SIDE
        =================================== */}

        <div className="checkout-summary">

          <h2>
            Order Summary
          </h2>

          {/* ITEMS */}

          <div className="checkout-items">

            {cart.map(
              (item) => (

                <div
                  className="checkout-item"
                  key={item.id}
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

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      ₹
                      {
                        item.price
                      }{" "}
                      ×{" "}
                      {
                        item.quantity
                      }
                    </p>

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

          {/* SUBTOTAL */}

          <div className="checkout-price-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹{totalPrice}
            </span>

          </div>

          {/* TAX */}

          <div className="checkout-price-row">

            <span>
              Tax (5%)
            </span>

            <span>
              ₹{tax}
            </span>

          </div>

          {/* DELIVERY */}

          <div className="checkout-price-row">

            <span>
              Delivery
            </span>

            <span>
              {deliveryFee === 0
                ? "FREE"
                : `₹${deliveryFee}`}
            </span>

          </div>

          <hr />

          {/* TOTAL */}

          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ₹{finalTotal}
            </strong>

          </div>

        </div>

      </section>

    </main>
  );
}