import { useState } from "react";
import { Link } from "react-router";

import { useAuth } from "../auth/useAuth";
import FormField from "../components/FormField";

import GlassCard from "../components/GlassCard";

const EMPTY_FORM = { name: "", email: "", password: "", confirmPassword: "" };

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres";
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Introduce un email válido";
  }
  if (form.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres";
  } else if (!/\p{L}/u.test(form.password) || !/\d/.test(form.password)) {
    errors.password = "La contraseña debe contener al menos una letra y un número";
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }
  return errors;
}

function errorsFromApi(details) {
  const errors = {};
  if (!Array.isArray(details)) return errors;
  for (const item of details) {
    const field = item.loc?.[1];
    if (field) errors[field] = item.msg.replace(/^Value error, /, "");
  }
  return errors;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email, form.password);
    } catch (err) {
      if (err.status === 422) {
        setFieldErrors(errorsFromApi(err.details));
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassCard className="w-full max-w-[420px] p-7 sm:p-10">
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight sm:text-[32px]">
          Crea tu cuenta
        </h1>
        <p className="text-[15px] text-ink-soft">Tarda menos que hacer una hamburguesa.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
        <FormField
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
          autoComplete="name"
        />
        <FormField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
          placeholder="tu@correo.com"
        />
        <FormField
          label="Contraseña"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        <FormField
          label="Repite la contraseña"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
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
          {submitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-semibold text-tomato-dark hover:text-petrol">
          Inicia sesión
        </Link>
      </p>
    </GlassCard>
  );
}