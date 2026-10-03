import { formatMoney } from "../utils/money";
import { BurgerIcon, DrinkIcon, FriesIcon } from "./icons";

const CATEGORY_STYLES = {
  burger: { Icon: BurgerIcon, className: "bg-tomato-tint text-tomato-dark" },
  side: { Icon: FriesIcon, className: "bg-mustard-tint text-mustard-dark" },
  drink: { Icon: DrinkIcon, className: "bg-petrol-tint text-petrol" },
};

const COLUMNS = "sm:grid-cols-[minmax(0,1fr)_80px_110px_110px]";

export default function OrderLines({ lines }) {
  return (
    <div>
      <div
        className={`hidden gap-x-4 border-b border-petrol/10 py-4 text-[13px] font-semibold text-ink-soft sm:grid ${COLUMNS}`}
      >
        <span>Producto</span>
        <span className="text-center">Cantidad</span>
        <span className="text-right">Precio unit.</span>
        <span className="text-right">Subtotal</span>
      </div>

      <ul className="divide-y divide-petrol/10">
        {lines.map((line) => {
          const category = CATEGORY_STYLES[line.category];

          return (
            <li
              key={line.key}
              className={`grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 py-4 sm:py-5 ${COLUMNS}`}
            >
              <div className="flex gap-3.5">
                {category && (
                  <div
                    className={`hidden size-12 shrink-0 items-center justify-center rounded-xl sm:flex ${category.className}`}
                  >
                    <category.Icon size={26} />
                  </div>
                )}

                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="font-semibold">{line.name}</span>
                  <span className="text-[13px] text-ink-soft sm:hidden">
                    {line.quantity} × {formatMoney(line.unitCents)}
                  </span>
                  {line.options.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                      {line.options.map((option) => (
                        <li
                          key={option.name}
                          className="rounded-full bg-sand px-2.5 py-0.5 text-xs text-ink-soft"
                        >
                          {option.name}
                          {option.priceCents > 0 && ` +${formatMoney(option.priceCents)}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <span className="hidden text-center font-semibold sm:block">{line.quantity}</span>
              <span className="hidden text-right text-ink-soft sm:block">
                {formatMoney(line.unitCents)}
              </span>
              <span className="text-right font-semibold">{formatMoney(line.subtotalCents)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
