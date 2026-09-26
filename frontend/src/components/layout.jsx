import { Link, Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="min-h-screen bg-orange-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/menu" className="text-xl font-bold text-orange-600">
            🍔 The Burger Station
          </Link>
          <div className="flex gap-4 text-sm font-medium">
            <Link to="/login" className="hover:text-orange-600">Entrar</Link>
            <Link to="/register" className="hover:text-orange-600">Registrarse</Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}