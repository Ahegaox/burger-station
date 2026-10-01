import { formatMoney } from "../utils/money";

export default function OrderLines({ lines, totalCents }) {
  return (
    <div>
      <div className="hidden grid-cols-[1fr_60px_100px_100px] gap-x-4 border-b pb-2 text-sm text-gray-500 sm:grid">
        <span>Producto</span>
        <span className="text-center">Cant.</span>
        <span className="text-right">Precio unit.</span>
        <span className="text-right">Subtotal</span>
      </div>

      <ul className="divide-y">
        {lines.map((line) => (
          <li
            key={line.key}
            className="grid grid-cols-[1fr_auto] gap-x-4 py-3 sm:grid-cols-[1fr_60px_100px_100px] sm:items-center"
          >
            <div>
              <p className="font-medium">{line.name}</p>
              {line.options.length > 0 && (
                <ul className="mt-1 text-xs text-gray-500">
                  {line.options.map((option) => (
                    <li key={option.name}>
                      + {option.name}
                      {option.priceCents > 0 && ` (${formatMoney(option.priceCents)})`}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-1 text-sm text-gray-500 sm:hidden">
                {line.quantity} × {formatMoney(line.unitCents)}
              </p>
            </div>

            <span className="hidden text-center sm:block">{line.quantity}</span>
            <span className="hidden text-right sm:block">{formatMoney(line.unitCents)}</span>
            <span className="text-right font-medium">{formatMoney(line.subtotalCents)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex justify-between border-t pt-3 text-lg font-bold">
        <span>Total</span>
        <span>{formatMoney(totalCents)}</span>
      </div>
    </div>
  );
}