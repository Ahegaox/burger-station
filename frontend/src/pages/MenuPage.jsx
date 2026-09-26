import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function MenuPage() {
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
    <div>
      <h1 className="mb-4 text-2xl font-bold">Menú</h1>
      <ul className="space-y-1">
        {menu.burgers.map((burger) => (
          <li key={burger.id}>
            {burger.name} — ${burger.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}