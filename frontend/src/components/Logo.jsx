import { BurgerIcon } from "./icons";

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center justify-center bg-petrol text-cream ${
          compact ? "size-9 rounded-[11px]" : "size-11 rounded-[14px]"
        }`}
      >
        <BurgerIcon size={compact ? 22 : 26} />
      </div>
      <span
        className={`font-display font-bold tracking-tight text-petrol ${
          compact ? "text-[17px] sm:text-xl" : "text-2xl"
        }`}
      >
        The Burger Station
      </span>
    </div>
  );
}