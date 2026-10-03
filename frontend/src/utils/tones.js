// Colores que se van alternando en las tarjetas de hamburguesa.
const TONES = [
  { bg: "bg-tomato-tint", text: "text-tomato-dark" },
  { bg: "bg-petrol-tint", text: "text-petrol" },
  { bg: "bg-mustard-tint", text: "text-mustard-dark" },
];

export function toneFor(index) {
  return TONES[Math.max(index, 0) % TONES.length];
}
