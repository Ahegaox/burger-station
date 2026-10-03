const VARIANTS = {
  strong: { petrol: "opacity-55", tomato: "opacity-50", mustard: "opacity-30" },
  soft: { petrol: "opacity-35", tomato: "opacity-30", mustard: "opacity-0" },
};

export default function BackgroundOrbs({ variant = "strong" }) {
  const v = VARIANTS[variant];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className={`absolute -left-40 -top-48 size-[340px] rounded-full bg-petrol blur-[70px] sm:size-[620px] sm:blur-[90px] ${v.petrol}`}
      />
      <div
        className={`absolute -bottom-40 -right-36 size-[300px] rounded-full bg-tomato blur-[70px] sm:size-[520px] sm:blur-[90px] ${v.tomato}`}
      />
      <div
        className={`absolute right-[18%] top-20 hidden size-[300px] rounded-full bg-mustard blur-[80px] sm:block ${v.mustard}`}
      />
    </div>
  );
}