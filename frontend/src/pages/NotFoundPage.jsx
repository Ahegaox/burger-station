import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold">Página no encontrada</h1>
      <Link to="/menu" className="mt-4 inline-block text-orange-600 underline">
        Volver al menú
      </Link>
    </div>
  );
}