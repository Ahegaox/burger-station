import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "./useAuth";

export default function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="py-10 text-center">Cargando...</p>;
  if (isAuthenticated) {
    const from = location.state?.from?.pathname ?? "/menu";
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
}