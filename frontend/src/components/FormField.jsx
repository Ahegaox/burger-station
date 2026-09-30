export default function FormField({ label, error, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        {...inputProps}
        className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}