import { Link } from "react-router";

import { getLineTotalCents } from "../cart/cartUtils";
import { useCart } from "../cart/useCart";
import { formatMoney } from "../utils/money";

export default function CartSummary() {
  const { items, totalCents, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-2 text-lg font-bold">Tu pedido</h2>
        <p className="text-sm text-gray-500">Todavía no has añadido nada.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-bold">Tu pedido</h2>

      <ul className="divide-y">
        {items.map((line) => {
          const options = [...line.extras, ...line.sauces].map((o) => o.name).join(", ");

          return (
            <li key={line.lineId} className="py-3">
              <div className="flex justify-between gap-2">
                <span className="font-medium">{line.product.name}</span>
                <span>{formatMoney(getLineTotalCents(line))}</span>
              </div>
              {options && <p className="text-xs text-gray-500">{options}</p>}

              <div className="mt-2 flex items-center gap-2 text-sm">
                <button
                  onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                  className="h-7 w-7 rounded-full bg-gray-200"
                  aria-label="Quitar uno"
                >
                  −
                </button>
                <span className="w-6 text-center">{line.quantity}</span>
                <button
                  onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                  className="h-7 w-7 rounded-full bg-gray-200"
                  aria-label="Añadir uno"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(line.lineId)}
                  className="ml-auto text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
        <span>Total</span>
        <span>{formatMoney(totalCents)}</span>
      </div>

      <Link
        to="/checkout"
        className="mt-4 block rounded-lg bg-orange-500 py-2 text-center font-semibold text-white hover:bg-orange-600"
      >
        Ir al checkout
      </Link>
    </div>
  );
}