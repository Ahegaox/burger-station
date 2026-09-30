import { useEffect, useState } from "react";

import { api } from "../api/client";
import { useCart } from "../cart/useCart";
import CartSummary from "../components/CartSummary";
import { formatMoney, toCents } from "../utils/money";

function MenuSection({ title, products, onAdd }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col rounded-xl bg-white p-4 shadow">
            <div className="flex justify-between gap-2">
              <h3 className="font-semibold">{product.name}</h3>
              <span className="font-medium text-orange-600">
                {formatMoney(toCents(product.price))}
              </span>
            </div>
            {product.description && (
              <p className="mt-1 text-sm text-gray-600">{product.description}</p>
            )}
            <button
              onClick={() => onAdd(product)}
              className="mt-3 self-start rounded-lg bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Añadir
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MenuPage() {
  const { addItem } = useCart();
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getMenu()
      .then((data) => setMenu(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!menu) return <p>Cargando menú...</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <MenuSection title="Hamburguesas" products={menu.burgers} onAdd={addItem} />
        <MenuSection title="Papas" products={menu.sides} onAdd={addItem} />
        <MenuSection title="Bebidas" products={menu.drinks} onAdd={addItem} />
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <CartSummary />
      </aside>
    </div>
  );
}