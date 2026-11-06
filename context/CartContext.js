"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext =
  createContext();

export function CartProvider({
  children,
}) {
  const [cart, setCart] =
    useState([]);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);

    const savedCart =
      localStorage.getItem(
        "smartRestaurantCart"
      );

    if (savedCart) {
      try {
        setCart(
          JSON.parse(savedCart)
        );
      } catch {
        localStorage.removeItem(
          "smartRestaurantCart"
        );
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    localStorage.setItem(
      "smartRestaurantCart",
      JSON.stringify(cart)
    );
  }, [cart, mounted]);

  // ADD TO CART
  const addToCart = (food) => {
    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item.id === food.id
        );

      if (existingItem) {
        // Stock limit
        if (
          existingItem.quantity >=
          food.stock
        ) {
          return currentCart;
        }

        return currentCart.map(
          (item) =>
            item.id === food.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                  stock:
                    food.stock,
                }
              : item
        );
      }

      // Product has no stock
      if (
        !food.stock ||
        food.stock <= 0
      ) {
        return currentCart;
      }

      return [
        ...currentCart,
        {
          ...food,
          quantity: 1,
          stock: food.stock,
        },
      ];
    });
  };

  // INCREASE
  const increaseQuantity = (
    id
  ) => {
    setCart((currentCart) =>
      currentCart.map(
        (item) => {
          if (item.id !== id) {
            return item;
          }

          if (
            item.quantity >=
            item.stock
          ) {
            return item;
          }

          return {
            ...item,
            quantity:
              item.quantity + 1,
          };
        }
      )
    );
  };

  // DECREASE
  const decreaseQuantity = (
    id
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  // REMOVE
  const removeFromCart = (
    id
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // CLEAR
  const clearCart = () => {
    setCart([]);
  };

  // TOTAL ITEMS
  const totalItems =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  // TOTAL PRICE
  const totalPrice =
    cart.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

        totalItems,

        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(
    CartContext
  );
}