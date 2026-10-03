import { useId, useState } from "react";

import { MAX_QUANTITY, getUnitPriceCents } from "../cart/cartUtils";
import { formatMoney, toCents } from "../utils/money";
import { CheckIcon, CloseIcon } from "./icons";
import Modal from "./Modal";
import QuantityStepper from "./QuantityStepper";

function toggleId(ids, id, max) {
  if (ids.includes(id)) return ids.filter((currentId) => currentId !== id);
  if (ids.length >= max) return ids;
  return [...ids, id];
}

function OptionGroup({ title, options, selectedIds, max, onToggle }) {
  const headingId = useId();
  const limitReached = selectedIds.length >= max;

  return (
    <div role="group" aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 id={headingId} className="font-display text-[19px] font-bold">
          {title}
        </h3>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            limitReached ? "bg-petrol text-cream" : "bg-petrol-tint text-petrol"
          }`}
        >
          {selectedIds.length} de {max}
          {limitReached && " · máximo alcanzado"}
        </span>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((option) => {
          const checked = selectedIds.includes(option.id);
          const disabled = !checked && limitReached;

          let stateClasses = "cursor-pointer border-petrol/15 bg-white hover:border-petrol/40";
          if (checked) stateClasses = "cursor-pointer border-tomato bg-tomato-tint/50";
          if (disabled) stateClasses = "border-petrol/10 bg-sand/50 opacity-50";

          return (
            <label
              key={option.id}
              className={`relative flex min-h-[52px] items-center justify-between gap-3 rounded-xl border-[1.5px] px-3.5 py-2 transition ${stateClasses}`}
            >
              <span className="flex items-center gap-2.5 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(option.id)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`flex size-5 shrink-0 items-center justify-center rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-petrol peer-focus-visible:ring-offset-2 ${
                    checked ? "bg-tomato-dark text-white" : "border-[1.5px] border-petrol/35 bg-white"
                  }`}
                >
                  {checked && <CheckIcon size={13} />}
                </span>
                {option.name}
              </span>

              {option.price > 0 ? (
                <span className="shrink-0 text-[13px] text-ink-soft">
                  +{formatMoney(toCents(option.price))}
                </span>
              ) : (
                <span className="shrink-0 text-xs font-semibold text-petrol">Gratis</span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function BurgerCustomizer({
  burger,
  tone,
  extras,
  sauces,
  rules,
  onClose,
  onConfirm,
}) {
  const [extraIds, setExtraIds] = useState([]);
  const [sauceIds, setSauceIds] = useState([]);
  const [quantity, setQuantity] = useState(1);

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
    <Modal onClose={onClose} labelledBy="customizer-title" className="sm:max-w-[600px]">
      <div
        className={`flex items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6 ${tone.bg}`}
      >
        <div className="flex flex-col gap-1.5">
          <h2
            id="customizer-title"
            className="font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[30px]"
          >
            {burger.name}
          </h2>
          <p className="text-[13px] leading-normal text-ink-soft sm:text-sm">{burger.description}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/70 transition hover:bg-white"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto px-5 py-5 sm:px-7">
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
      </div>

      <div className="flex items-center gap-3 border-t border-petrol/10 px-5 pb-6 pt-4 sm:px-7">
        <QuantityStepper
          size="md"
          value={quantity}
          onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          onIncrease={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
        />
        <button
          type="button"
          onClick={handleConfirm}
          className="flex h-[52px] flex-1 items-center justify-between rounded-xl bg-tomato-dark px-4 font-semibold text-white shadow-[0_8px_20px_rgba(201,67,30,0.25)] transition hover:brightness-110 sm:px-5"
        >
          <span>
            Añadir<span className="hidden sm:inline"> al pedido</span>
          </span>
          <span>{formatMoney(totalCents)}</span>
        </button>
      </div>
    </Modal>
  );
}
