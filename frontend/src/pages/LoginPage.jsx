import { useState } from "react";
import { Link } from "react-router";

import { useAuth } from "../auth/useAuth";
import FormField from "../components/FormField";

import GlassCard from "../components/GlassCard";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassCard className="w-full max-w-[420px] p-7 sm:p-10">
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight sm:text-[32px]">
          Bienvenido de nuevo
        </h1>
        <p className="text-[15px] text-ink-soft">Entra para pedir tu hamburguesa favorita.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="tu@correo.com"
          required
        />
        <FormField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1.5 h-[50px] rounded-xl bg-tomato-dark font-semibold text-white shadow-[0_8px_20px_rgba(201,67,30,0.28)] transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="font-semibold text-tomato-dark hover:text-petrol">
          Regístrate
        </Link>
      </p>
    </GlassCard>
  );
}