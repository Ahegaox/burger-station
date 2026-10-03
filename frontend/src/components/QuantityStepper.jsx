const SIZES = {
  sm: { button: "size-9 text-base", value: "w-6 text-sm" },
  md: { button: "size-11 text-lg", value: "w-8 text-base" },
};

export default function QuantityStepper({ value, onDecrease, onIncrease, size = "sm" }) {
  const styles = SIZES[size];

  return (
    <div className="flex items-center gap-1 rounded-full bg-sand p-0.5">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Quitar uno"
        className={`rounded-full bg-white transition hover:bg-petrol hover:text-cream ${styles.button}`}
      >
        −
      </button>
      <span className={`text-center font-semibold ${styles.value}`}>{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Añadir uno"
        className={`rounded-full bg-white transition hover:bg-petrol hover:text-cream ${styles.button}`}
      >
        +
      </button>
    </div>
  );
}
