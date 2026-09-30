import { toCents } from "../utils/money";

export const MAX_QUANTITY = 20;

function sortedIds(products) {
  return products
    .map((product) => product.id)
    .sort((a, b) => a - b)
    .join(",");
}

export function buildLineId(productId, extras, sauces) {
  return `${productId}|${sortedIds(extras)}|${sortedIds(sauces)}`;
}

export function getUnitPriceCents(line) {
  const options = [...line.extras, ...line.sauces];
  return options.reduce(
    (sum, option) => sum + toCents(option.price),
    toCents(line.product.price)
  );
}

export function getLineTotalCents(line) {
  return getUnitPriceCents(line) * line.quantity;
}