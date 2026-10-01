import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { api } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { getLineTotalCents, getUnitPriceCents } from "../cart/cartUtils";
import { useCart } from "../cart/useCart";
import OrderLines from "../components/OrderLines";
import { toCents } from "../utils/money";

export default function CheckoutPage() {
  const { user, token, logout } = useAuth();
  const { items, totalCents, toOrderPayload, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 text-center shadow">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-gray-600">Añade algo del menú para hacer tu pedido.</p>
        <Link
          to="/menu"
          className="mt-4 inline-block rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
        >
          Ver el menú
        </Link>
      </div>
    );
  }

  const lines = items.map((line) => ({
    key: line.lineId,
    name: line.product.name,
    options: [...line.extras, ...line.sauces].map((option) => ({
      name: option.name,
      priceCents: toCents(option.price),
    })),
    quantity: line.quantity,
    unitCents: getUnitPriceCents(line),
    subtotalCents: getLineTotalCents(line),
  }));

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);
    try {
      const order = await api.createOrder(toOrderPayload(), token);
      navigate(`/orders/${order.id}`, { state: { order } });
      clearCart();
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Resumen del pedido</h1>
        <Link to="/menu" className="text-sm text-orange-600 underline">
          Modificar pedido
        </Link>
      </div>

      <OrderLines lines={lines} totalCents={totalCents} />

      <p className="mt-6 text-sm text-gray-600">
        Enviaremos la confirmación del pedido a <strong>{user.email}</strong>.
      </p>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={submitting}
        className="mt-4 w-full rounded-lg bg-orange-500 py-3 text-lg font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {submitting ? "Enviando pedido..." : "Confirmar pedido"}
      </button>
    </div>
  );
}