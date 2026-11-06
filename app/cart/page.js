"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  if (cart.length === 0) {
    return (
      <main className="cart-page empty-cart">
        <h1>Your Cart is Empty 🛒</h1>

        <p>
          Looks like you haven't added anything yet.
        </p>

        <Link href="/menu" className="primary-btn">
          Explore Menu
        </Link>
      </main>
    );
  }

  const tax = Math.round(totalPrice * 0.05);
  const deliveryFee = totalPrice >= 500 ? 0 : 40;
  const finalTotal = totalPrice + tax + deliveryFee;

  return (
    <main className="cart-page">

      <div className="cart-header">
        <p>YOUR ORDER</p>
        <h1>Shopping Cart</h1>
      </div>


      <div className="cart-container">

        {/* Cart Items */}

        <div className="cart-items">

          {cart.map((item) => (
            <div className="cart-item" key={item.id}>

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-info">

                <h3>{item.name}</h3>

                <p>{item.category}</p>

                <strong>₹{item.price}</strong>

              </div>


              <div className="quantity">

                <button
                  onClick={() =>
                    decreaseQuantity(item.id)
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    increaseQuantity(item.id)
                  }
                >
                  +
                </button>

              </div>


              <div className="item-total">
                ₹{item.price * item.quantity}
              </div>


              <button
                className="remove-btn"
                onClick={() =>
                  removeFromCart(item.id)
                }
              >
                ✕
              </button>

            </div>
          ))}

        </div>


        {/* Summary */}

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="summary-row">
            <span>Tax (5%)</span>
            <span>₹{tax}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>
              {deliveryFee === 0
                ? "FREE"
                : `₹${deliveryFee}`}
            </span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{finalTotal}</strong>
          </div>

          <Link
            href="/checkout"
            className="checkout-btn"
          >
            Proceed to Checkout
          </Link>

        </div>

      </div>

    </main>
  );
}