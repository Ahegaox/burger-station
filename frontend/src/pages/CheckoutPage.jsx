import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { api } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { getLineTotalCents, getUnitPriceCents } from "../cart/cartUtils";
import { useCart } from "../cart/useCart";
import GlassCard from "../components/GlassCard";
import { ArrowLeftIcon, MailIcon } from "../components/icons";
import OrderLines from "../components/OrderLines";
import { formatMoney, toCents } from "../utils/money";

function EmailNotice({ email }) {
  return (
    <p className="flex items-start gap-2.5 rounded-xl bg-petrol-tint px-3.5 py-3 text-[13px] leading-normal">
      <span className="mt-px shrink-0 text-petrol">
        <MailIcon />
      </span>
      <span>
        Te enviaremos la confirmación a <strong className="break-words font-semibold">{email}</strong>
      </span>
    </p>
  );
}

export default function CheckoutPage() {
  const { user, token, logout } = useAuth();
  const { items, totalItems, totalCents, toOrderPayload, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <GlassCard className="mx-auto mt-6 max-w-md p-8 text-center sm:p-10">
        <h1 className="font-display text-[28px] font-bold tracking-tight">Tu pedido está vacío</h1>
        <p className="mt-2 text-ink-soft">Añade algo del menú para empezar.</p>
        <Link
          to="/menu"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-tomato-dark px-6 font-semibold text-white transition hover:brightness-110"
        >
          Ver el menú
        </Link>
      </GlassCard>
    );
  }

  const lines = items.map((line) => ({
    key: line.lineId,
    name: line.product.name,
    category: line.product.category,
    options: [...line.extras, ...line.sauces].map((option) => ({
      name: option.name,
      priceCents: toCents(option.price),
    })),
    quantity: line.quantity,
    unitCents: getUnitPriceCents(line),
    subtotalCents: getLineTotalCents(line),
  }));

  const burgersCents = items
    .filter((line) => line.product.category === "burger")
    .reduce((sum, line) => sum + getLineTotalCents(line), 0);
  const othersCents = totalCents - burgersCents;

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
    <div className="flex flex-col gap-4 sm:gap-6">
      <Link
        to="/menu"
        className="flex h-11 items-center gap-1.5 self-start text-sm font-semibold text-petrol transition hover:text-tomato-dark"
      >
        <ArrowLeftIcon />
        Seguir pidiendo
      </Link>

      <h1 className="font-display text-[32px] font-bold leading-[1.05] tracking-tight sm:text-[44px]">
        Revisa tu pedido
      </h1>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <div className="flex flex-col gap-4">
          <section className="rounded-[20px] border border-petrol/10 bg-white px-4 sm:px-7 sm:py-2">
            <OrderLines lines={lines} />
          </section>
          <div className="lg:hidden">
            <EmailNotice email={user.email} />
          </div>
        </div>

        <GlassCard className="sticky bottom-4 flex flex-col gap-4 p-5 lg:bottom-auto lg:top-24 lg:gap-[18px] lg:p-[26px]">
          <h2 className="hidden font-display text-[22px] font-bold lg:block">Resumen</h2>

          <dl className="hidden flex-col gap-2.5 text-[15px] lg:flex">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Productos</dt>
              <dd>{totalItems}</dd>
            </div>
            {burgersCents > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink-soft">Hamburguesas</dt>
                <dd>{formatMoney(burgersCents)}</dd>
              </div>
            )}
            {othersCents > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink-soft">Acompañamientos y bebidas</dt>
                <dd>{formatMoney(othersCents)}</dd>
              </div>
            )}
          </dl>

          <div className="flex items-baseline justify-between lg:border-t-[1.5px] lg:border-dashed lg:border-petrol/20 lg:pt-4">
            <span className="font-semibold lg:text-[17px]">Total</span>
            <span className="font-display text-[28px] font-bold tracking-tight text-petrol lg:text-4xl">
              {formatMoney(totalCents)}
            </span>
          </div>

          <div className="hidden lg:block">
            <EmailNotice email={user.email} />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="h-14 rounded-[14px] bg-tomato-dark text-[17px] font-semibold text-white shadow-[0_10px_24px_rgba(201,67,30,0.3)] transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? "Enviando pedido..." : "Confirmar pedido"}
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
