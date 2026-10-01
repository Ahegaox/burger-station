import { useEffect, useState } from "react";

import { MAX_QUANTITY, getUnitPriceCents } from "../cart/cartUtils";
import { formatMoney, toCents } from "../utils/money";

function toggleId(ids, id, max) {
  if (ids.includes(id)) return ids.filter((currentId) => currentId !== id);
  if (ids.length >= max) return ids;
  return [...ids, id];
}

function OptionGroup({ title, options, selectedIds, max, onToggle }) {
  const limitReached = selectedIds.length >= max;

  return (
    <fieldset className="mt-5">
      <legend className="font-semibold">{title}</legend>
      <p className="mb-2 text-xs text-gray-500">
        Elige hasta {max} ({selectedIds.length}/{max})
      </p>

      <div className="space-y-2">
        {options.map((option) => {
          const checked = selectedIds.includes(option.id);
          const disabled = !checked && limitReached;

          return (
            <label
              key={option.id}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                checked ? "border-orange-500 bg-orange-50" : "border-gray-200"
              } ${disabled ? "opacity-40" : "cursor-pointer"}`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(option.id)}
                  className="h-4 w-4 accent-orange-500"
                />
                {option.name}
              </span>
              <span className="text-sm text-gray-600">
                {option.price > 0 ? `+${formatMoney(toCents(option.price))}` : "Gratis"}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function BurgerCustomizer({ burger, extras, sauces, rules, onClose, onConfirm }) {
  const [extraIds, setExtraIds] = useState([]);
  const [sauceIds, setSauceIds] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const selectedExtras = extras.filter((extra) => extraIds.includes(extra.id));
  const selectedSauces = sauces.filter((sauce) => sauceIds.includes(sauce.id));

  const unitCents = getUnitPriceCents({
    product: burger,
    extras: selectedExtras,
    sauces: selectedSauces,
  });
  const totalCents = unitCents * quantity;

  function handleConfirm() {
    onConfirm({ quantity, extras: selectedExtras, sauces: selectedSauces });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="customizer-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="customizer-title" className="text-xl font-bold">{burger.name}</h2>
            <p className="mt-1 text-sm text-gray-600">{burger.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-700"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <OptionGroup
          title="Extras"
          options={extras}
          selectedIds={extraIds}
          max={rules.max_extras}
          onToggle={(id) => setExtraIds((current) => toggleId(current, id, rules.max_extras))}
        />
        <OptionGroup
          title="Salsas"
          options={sauces}
          selectedIds={sauceIds}
          max={rules.max_sauces}
          onToggle={(id) => setSauceIds((current) => toggleId(current, id, rules.max_sauces))}
        />

        <div className="sticky bottom-0 mt-6 flex items-center gap-3 bg-white pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-9 w-9 rounded-full bg-gray-200"
              aria-label="Quitar uno"
            >
              −
            </button>
            <span className="w-6 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
              className="h-9 w-9 rounded-full bg-gray-200"
              aria-label="Añadir uno"
            >
              +
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-orange-500 py-2.5 font-semibold text-white hover:bg-orange-600"
          >
            Añadir · {formatMoney(totalCents)}
          </button>
        </div>
      </div>
    </div>
  );
}