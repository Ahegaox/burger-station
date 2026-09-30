import { useState } from "react";
import { Link } from "react-router";

import { useAuth } from "../auth/useAuth";
import FormField from "../components/FormField";

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
    <div className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-bold">Crear cuenta</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {submitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-orange-600 underline">Inicia sesión</Link>
      </p>
    </div>
  );
}