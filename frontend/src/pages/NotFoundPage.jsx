import { Link } from "react-router";

import GlassCard from "../components/GlassCard";

export default function NotFoundPage() {
  return (
    <GlassCard className="w-full max-w-[420px] p-10 text-center">
      <p className="font-display text-6xl font-bold text-petrol">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold">Página no encontrada</h1>
      <Link
        to="/menu"
        className="mt-6 inline-flex h-12 items-center rounded-xl bg-tomato-dark px-6 font-semibold text-white hover:brightness-110"
      >
        Volver al menú
      </Link>
    </GlassCard>
  );
}