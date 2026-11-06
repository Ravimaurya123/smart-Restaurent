"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({
  children,
}) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "smartRestaurantToken"
      );

    const savedUser =
      localStorage.getItem(
        "smartRestaurantUser"
      );

    if (!token || !savedUser) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role !== "admin") {
        router.replace("/");
        return;
      }

      setAllowed(true);
    } catch {
      localStorage.removeItem(
        "smartRestaurantToken"
      );

      localStorage.removeItem(
        "smartRestaurantUser"
      );

      router.replace("/login");
    } finally {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <span>🔐</span>

            <h1>Checking Access...</h1>

            <p>
              Please wait while we verify your account.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!allowed) {
    return null;
  }

  return children;
}