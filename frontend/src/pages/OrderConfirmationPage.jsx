import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";

import { api } from "../api/client";
import { useAuth } from "../auth/useAuth";
import OrderLines from "../components/OrderLines";
import { toCents } from "../utils/money";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const { user, token } = useAuth();
  const [order, setOrder] = useState(location.state?.order ?? null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order) return;
    api
      .getOrder(orderId, token)
      .then((data) => setOrder(data))
      .catch((err) => setError(err.message));
  }, [order, orderId, token]);

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/menu" className="mt-4 inline-block text-orange-600 underline">
          Volver al menú
        </Link>
      </div>
    );
  }
  if (!order) return <p>Cargando pedido...</p>;

  const lines = order.items.map((item, index) => ({
    key: index,
    name: item.product_name,
    options: item.options.map((option) => ({
      name: option.product_name,
      priceCents: toCents(option.price),
    })),
    quantity: item.quantity,
    unitCents: toCents(item.unit_price),
    subtotalCents: toCents(item.subtotal),
  }));

  const createdAt = new Date(order.created_at).toLocaleString("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
      <div className="text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-2 text-2xl font-bold">¡Pedido confirmado!</h1>
        <p className="mt-1 text-gray-600">
          Pedido <strong>#{order.id}</strong> · {createdAt}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Te hemos enviado el resumen a <strong>{user.email}</strong>.
        </p>
      </div>

      <div className="mt-6">
        <OrderLines lines={lines} totalCents={toCents(order.total)} />
      </div>

      <Link
        to="/menu"
        className="mt-6 block rounded-lg bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
      >
        Hacer otro pedido
      </Link>
    </div>
  );
}