import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";

import { api } from "../api/client";
import { useAuth } from "../auth/useAuth";
import GlassCard from "../components/GlassCard";
import { CheckIcon, MailIcon } from "../components/icons";
import { formatMoney, toCents } from "../utils/money";

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
      <GlassCard className="mx-auto mt-6 max-w-md p-8 text-center sm:p-10">
        <p role="alert" className="font-display text-2xl font-bold">
          {error}
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-tomato-dark px-6 font-semibold text-white transition hover:brightness-110"
        >
          Volver al menú
        </Link>
      </GlassCard>
    );
  }
  if (!order) return <p className="py-10 text-center text-ink-soft">Cargando pedido...</p>;

  const lines = order.items.map((item, index) => {
    const unitPrice = `${formatMoney(toCents(item.unit_price))} c/u`;
    const options = item.options.map((option) => option.product_name).join(", ");

    return {
      key: index,
      title: `${item.quantity} × ${item.product_name}`,
      detail: options ? `${options} · ${unitPrice}` : unitPrice,
      subtotalCents: toCents(item.subtotal),
    };
  });

  const createdAt = new Date(order.created_at).toLocaleString("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <GlassCard className="mx-auto flex max-w-[560px] flex-col items-center gap-5 p-6 sm:mt-2 sm:gap-[22px] sm:p-10">
      <div className="flex size-16 items-center justify-center rounded-full bg-petrol text-cream ring-8 ring-petrol/10 sm:size-[76px]">
        <CheckIcon size={34} strokeWidth={2.4} />
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-[30px] font-bold leading-[1.05] tracking-tight sm:text-[38px]">
          ¡Pedido confirmado!
        </h1>
        <p className="text-[15px] text-ink-soft">
          Pedido <strong className="font-semibold text-ink">#{order.id}</strong> · {createdAt}
        </p>
      </div>

      <p className="flex items-center gap-2.5 rounded-xl bg-petrol-tint px-3.5 py-2.5 text-[13px] leading-normal">
        <span className="shrink-0 text-petrol">
          <MailIcon />
        </span>
        <span>
          Te hemos enviado el resumen a{" "}
          <strong className="break-words font-semibold">{user.email}</strong>
        </span>
      </p>

      <div className="w-full">
        <ul className="divide-y divide-petrol/10 border-t border-petrol/10">
          {lines.map((line) => (
            <li key={line.key} className="flex justify-between gap-4 py-3.5">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-semibold">{line.title}</span>
                <span className="text-[13px] leading-snug text-ink-soft">{line.detail}</span>
              </div>
              <span className="font-semibold">{formatMoney(line.subtotalCents)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline justify-between border-t-[1.5px] border-dashed border-petrol/20 pt-3.5">
          <span className="font-semibold">Total</span>
          <span className="font-display text-[28px] font-bold tracking-tight text-petrol sm:text-3xl">
            {formatMoney(toCents(order.total))}
          </span>
        </div>
      </div>

      <Link
        to="/menu"
        className="flex h-[54px] w-full items-center justify-center rounded-[14px] bg-tomato-dark font-semibold text-white shadow-[0_10px_24px_rgba(201,67,30,0.28)] transition hover:brightness-110"
      >
        Hacer otro pedido
      </Link>
    </GlassCard>
  );
}
