import { Link, Outlet, useNavigate } from "react-router";

import { useAuth } from "../auth/useAuth";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/menu" className="text-xl font-bold text-orange-600">
            🍔 The Burger Station
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            {user ? (
              <>
                <span className="hidden sm:inline">Hola, {user.name}</span>
                <button onClick={handleLogout} className="hover:text-orange-600">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-orange-600">Entrar</Link>
                <Link to="/register" className="hover:text-orange-600">Registrarse</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}