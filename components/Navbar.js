"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedUser =
      localStorage.getItem(
        "smartRestaurantUser"
      );

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(
          "smartRestaurantUser"
        );
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(
      "smartRestaurantToken"
    );

    localStorage.removeItem(
      "smartRestaurantUser"
    );

    setUser(null);

    router.push("/");
    router.refresh();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link href="/" className="logo">
          🍽️ Smart<span>Restaurant</span>
        </Link>

        <div className="nav-links">

          <Link href="/">
            Home
          </Link>

          <Link href="/menu">
            Menu
          </Link>

          <Link href="/booking">
            Book Table
          </Link>

          {mounted && user ? (
            <>
              {user.role === "customer" && (
                <Link href="/orders">
                  My Orders
                </Link>
              )}

              {user.role === "admin" && (
                <Link href="/admin">
                  Admin
                </Link>
              )}

              <span className="navbar-user">
                Hi, {user.name}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              Login
            </Link>
          )}

          <Link
            href="/cart"
            className="cart-btn"
          >
            🛒 Cart
          </Link>

        </div>

      </div>
    </nav>
  );
}