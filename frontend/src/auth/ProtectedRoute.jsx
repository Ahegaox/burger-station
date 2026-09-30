import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "./useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="py-10 text-center">Cargando...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}