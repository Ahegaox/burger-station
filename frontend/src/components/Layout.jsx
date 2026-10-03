import { Link, Outlet, useMatch, useNavigate } from "react-router";

import { useAuth } from "../auth/useAuth";
import { useCart } from "../cart/useCart";
import BackgroundOrbs from "./BackgroundOrbs";
import { BagIcon } from "./icons";
import Logo from "./Logo";

export default function Layout() {
  const { user, logout } = useAuth();
  const { totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const isConfirmation = useMatch("/orders/:orderId") !== null;

  function handleLogout() {
    logout();
    clearCart();
    navigate("/login");
  }

  return (
    <div className="min-h-dvh">
      <BackgroundOrbs variant={isConfirmation ? "strong" : "soft"} />

      <header className="sticky top-0 z-30 border-b border-petrol/10 bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-4 sm:h-[72px] sm:px-6">
          <Link to="/menu">
            <Logo compact />
          </Link>

          <div className="flex items-center gap-2 sm:gap-5">
            <span className="hidden text-sm text-ink-soft md:inline">
              Hola, <strong className="font-semibold text-ink">{user.name}</strong>
            </span>

            <Link
              to="/checkout"
              className="hidden h-10 items-center gap-2 rounded-full bg-petrol px-4 text-sm font-semibold text-cream transition hover:brightness-110 sm:flex"
            >
              <BagIcon />
              Pedido
              {totalItems > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-tomato-dark px-1.5 text-xs text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="h-11 rounded-lg px-2 text-sm font-medium text-ink-soft transition hover:text-ink"
            >
              Salir
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
