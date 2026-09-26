import { useState } from "react";

function ProductCard({ name, price }) {
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-gray-600">${price.toFixed(2)}</p>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => setQuantity(quantity - 1)}
          disabled={quantity === 0}
          className="h-8 w-8 rounded-full bg-gray-200 disabled:opacity-40"
        >
          −
        </button>
        <span className="w-6 text-center">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="h-8 w-8 rounded-full bg-orange-500 text-white"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <main className="min-h-screen bg-orange-50 p-6">
      <h1 className="mb-6 text-3xl font-bold text-orange-600">The Burger Station</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard name="La Montañesa" price={9.5} />
        <ProductCard name="El Ranchero" price={10} />
        <ProductCard name="Mar y Tierra" price={13} />
      </div>
    </main>
  );
}