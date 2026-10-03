import { Link } from "react-router";

import { getLineTotalCents } from "../cart/cartUtils";
import { useCart } from "../cart/useCart";
import { formatMoney } from "../utils/money";
import { ArrowRightIcon, CloseIcon } from "./icons";
import QuantityStepper from "./QuantityStepper";

export default function CartSummary({ titleId, onClose }) {
  const { items, totalItems, totalCents, updateQuantity, removeItem } = useCart();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id={titleId} className="font-display text-[22px] font-bold tracking-tight">
          Tu pedido
        </h2>

        <div className="flex items-center gap-2">
          {totalItems > 0 && (
            <span className="text-[13px] text-ink-soft">
              {totalItems} {totalItems === 1 ? "producto" : "productos"}
            </span>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex size-11 items-center justify-center rounded-full bg-sand transition hover:bg-petrol-tint"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl bg-sand/60 px-4 py-6 text-center text-sm text-ink-soft">
          Todavía no has añadido nada. Elige una hamburguesa para empezar.
        </p>
      ) : (
        <>
          <ul className="divide-y divide-petrol/10 border-t border-petrol/10">
            {items.map((line) => {
              const options = [...line.extras, ...line.sauces].map((o) => o.name).join(", ");

              return (
                <li key={line.lineId} className="flex flex-col gap-2 py-3.5">
                  <div className="flex justify-between gap-3 text-[15px] font-semibold">
                    <span>{line.product.name}</span>
                    <span>{formatMoney(getLineTotalCents(line))}</span>
                  </div>
                  {options && <p className="text-[13px] leading-snug text-ink-soft">{options}</p>}

                  <div className="flex items-center justify-between">
                    <QuantityStepper
                      value={line.quantity}
                      onDecrease={() => updateQuantity(line.lineId, line.quantity - 1)}
                      onIncrease={() => updateQuantity(line.lineId, line.quantity + 1)}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(line.lineId)}
                      className="h-9 px-1 text-[13px] text-ink-soft underline transition hover:text-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex items-baseline justify-between border-t-[1.5px] border-dashed border-petrol/20 pt-3.5">
            <span className="font-semibold">Total</span>
            <span className="font-display text-[28px] font-bold tracking-tight text-petrol">
              {formatMoney(totalCents)}
            </span>
          </div>

          <Link
            to="/checkout"
            className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-tomato-dark font-semibold text-white shadow-[0_8px_20px_rgba(201,67,30,0.25)] transition hover:brightness-110"
          >
            Ir al checkout
            <ArrowRightIcon />
          </Link>
        </>
      )}
    </div>
  );
}
