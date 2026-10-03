import { useEffect, useState } from "react";

import { api } from "../api/client";
import { useCart } from "../cart/useCart";
import BurgerCustomizer from "../components/BurgerCustomizer";
import CartSummary from "../components/CartSummary";
import { BurgerIcon, PlusIcon } from "../components/icons";
import Modal from "../components/Modal";
import { formatMoney, toCents } from "../utils/money";
import { toneFor } from "../utils/tones";

const SECTIONS = [
  { id: "hamburguesas", label: "Hamburguesas" },
  { id: "papas", label: "Papas" },
  { id: "bebidas", label: "Bebidas" },
];

function MenuSection({ id, title, children }) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-4">
      <h2 className="font-display text-[26px] font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function BurgerCard({ burger, tone, onCustomize }) {
  return (
    <article className="flex overflow-hidden rounded-[20px] border border-petrol/10 bg-white sm:flex-col">
      <div
        className={`flex w-24 shrink-0 items-center justify-center sm:h-28 sm:w-full ${tone.bg} ${tone.text}`}
      >
        <BurgerIcon size={48} strokeWidth={1.4} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-[18px]">
        <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">{burger.name}</h3>
        <p className="flex-1 text-[13px] leading-normal text-ink-soft sm:text-sm">
          {burger.description}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="font-display text-lg font-bold text-petrol sm:text-xl">
            {formatMoney(toCents(burger.price))}
          </span>
          <button
            type="button"
            onClick={() => onCustomize(burger)}
            className="h-11 rounded-[10px] bg-tomato-dark px-4 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Personalizar
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductRow({ product, onAdd }) {
  return (
    <li className="flex min-h-16 items-center justify-between gap-3 rounded-[14px] border border-petrol/10 bg-white py-2 pl-[18px] pr-2.5">
      <span className="text-[15px] font-medium leading-tight">{product.name}</span>
      <span className="flex shrink-0 items-center gap-3">
        <span className="font-semibold text-petrol">{formatMoney(toCents(product.price))}</span>
        <button
          type="button"
          onClick={() => onAdd(product)}
          aria-label={`Añadir ${product.name}`}
          className="flex size-11 items-center justify-center rounded-full border-[1.5px] border-petrol text-petrol transition hover:bg-petrol hover:text-cream"
        >
          <PlusIcon />
        </button>
      </span>
    </li>
  );
}

export default function MenuPage() {
  const { addItem, totalItems, totalCents } = useCart();
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);
  const [selectedBurger, setSelectedBurger] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    api
      .getMenu()
      .then((data) => setMenu(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
        {error}
      </p>
    );
  }
  if (!menu) return <p className="py-10 text-center text-ink-soft">Cargando menú...</p>;

  function handleConfirmBurger(options) {
    addItem(selectedBurger, options);
    setSelectedBurger(null);
  }

  const selectedIndex = selectedBurger
    ? menu.burgers.findIndex((burger) => burger.id === selectedBurger.id)
    : -1;

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mb-5 flex flex-col gap-2 sm:mb-6">
        <h1 className="font-display text-[32px] font-bold leading-[1.05] tracking-tight sm:text-[44px]">
          ¿Qué te apetece hoy?
        </h1>
        <p className="hidden text-ink-soft sm:block">
          Elige tu hamburguesa, personalízala a tu gusto y complétala con papas y bebida.
        </p>
      </div>

      <nav aria-label="Secciones del menú" className="mb-8 flex gap-2 overflow-x-auto">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="flex h-10 shrink-0 items-center rounded-full border border-petrol/15 bg-white px-4 text-sm font-medium transition hover:border-petrol hover:bg-petrol hover:text-cream"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-11">
          <MenuSection id="hamburguesas" title="Hamburguesas">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {menu.burgers.map((burger, index) => (
                <BurgerCard
                  key={burger.id}
                  burger={burger}
                  tone={toneFor(index)}
                  onCustomize={setSelectedBurger}
                />
              ))}
            </div>
          </MenuSection>

          <MenuSection id="papas" title="Papas">
            <ul className="grid gap-3 sm:grid-cols-2">
              {menu.sides.map((product) => (
                <ProductRow key={product.id} product={product} onAdd={addItem} />
              ))}
            </ul>
          </MenuSection>

          <MenuSection id="bebidas" title="Bebidas">
            <ul className="grid gap-3 sm:grid-cols-2">
              {menu.drinks.map((product) => (
                <ProductRow key={product.id} product={product} onAdd={addItem} />
              ))}
            </ul>
          </MenuSection>
        </div>

        <aside className="hidden rounded-[20px] border border-petrol/10 bg-white p-[22px] shadow-[0_16px_40px_rgba(15,76,92,0.08)] lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto">
          <CartSummary />
        </aside>
      </div>

      {totalItems > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-4 bottom-5 z-20 flex h-[60px] items-center justify-between rounded-2xl bg-petrol pl-5 pr-2 text-cream shadow-[0_14px_34px_rgba(11,53,64,0.35)] lg:hidden"
        >
          <span className="flex items-center gap-2.5 text-[15px] font-semibold">
            <span className="flex h-[26px] min-w-[26px] items-center justify-center rounded-full bg-tomato-dark px-1.5 text-[13px] text-white">
              {totalItems}
            </span>
            Ver pedido
          </span>
          <span className="flex h-11 items-center rounded-xl bg-white/15 px-3.5 font-display text-lg font-bold">
            {formatMoney(totalCents)}
          </span>
        </button>
      )}

      {cartOpen && (
        <Modal
          onClose={() => setCartOpen(false)}
          labelledBy="cart-sheet-title"
          className="sm:max-w-[480px]"
        >
          <div className="overflow-y-auto p-5">
            <CartSummary titleId="cart-sheet-title" onClose={() => setCartOpen(false)} />
          </div>
        </Modal>
      )}

      {selectedBurger && (
        <BurgerCustomizer
          burger={selectedBurger}
          tone={toneFor(selectedIndex)}
          extras={menu.extras}
          sauces={menu.sauces}
          rules={menu.rules}
          onClose={() => setSelectedBurger(null)}
          onConfirm={handleConfirmBurger}
        />
      )}
    </div>
  );
}
