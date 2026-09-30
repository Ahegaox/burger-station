import { useEffect, useState } from "react";

import { CartContext } from "./CartContext";
import { MAX_QUANTITY, buildLineId, getLineTotalCents } from "./cartUtils";

const CART_KEY = "burger_cart";

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, { quantity = 1, extras = [], sauces = [] } = {}) {
    const lineId = buildLineId(product.id, extras, sauces);

    setItems((current) => {
      const existing = current.find((line) => line.lineId === lineId);
      if (existing) {
        return current.map((line) =>
          line.lineId === lineId
            ? { ...line, quantity: Math.min(line.quantity + quantity, MAX_QUANTITY) }
            : line
        );
      }
      return [
        ...current,
        { lineId, product, extras, sauces, quantity: Math.min(quantity, MAX_QUANTITY) },
      ];
    });
  }

  function removeItem(lineId) {
    setItems((current) => current.filter((line) => line.lineId !== lineId));
  }

  function updateQuantity(lineId, quantity) {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }
    setItems((current) =>
      current.map((line) =>
        line.lineId === lineId ? { ...line, quantity: Math.min(quantity, MAX_QUANTITY) } : line
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  function toOrderPayload() {
    return {
      items: items.map((line) => ({
        product_id: line.product.id,
        quantity: line.quantity,
        extra_ids: line.extras.map((extra) => extra.id),
        sauce_ids: line.sauces.map((sauce) => sauce.id),
      })),
    };
  }

  const totalItems = items.reduce((sum, line) => sum + line.quantity, 0);
  const totalCents = items.reduce((sum, line) => sum + getLineTotalCents(line), 0);

  const value = {
    items,
    totalItems,
    totalCents,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toOrderPayload,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}