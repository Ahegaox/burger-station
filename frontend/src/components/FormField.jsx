import { useId, useState } from "react";

import { AlertIcon, EyeIcon, EyeOffIcon } from "./icons";

export default function FormField({ label, error, type = "text", ...inputProps }) {
  const id = useId();
  const errorId = `${id}-error`;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
          className={`h-12 w-full rounded-xl border-[1.5px] bg-white/70 px-4 text-[15px] outline-none transition focus:border-tomato focus:bg-white/90 focus:ring-4 focus:ring-tomato/20 ${
            isPassword ? "pr-12" : ""
          } ${error ? "border-danger" : "border-petrol/20"}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-0.5 top-0.5 flex size-11 items-center justify-center rounded-lg text-ink-soft hover:text-ink"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-[13px] text-danger">
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  );
}