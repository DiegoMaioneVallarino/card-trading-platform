import type { CardListing } from "../listings/listing.types";
import type { CartLine } from "./cart.store";
export const money = (value: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);
export function resolveCart(items: CartLine[], listings: CardListing[]) {
  return items.map((line) => ({ ...line, listing: listings.find((listing) => listing.id === line.listingId) }))
    .filter((line): line is CartLine & { listing: CardListing } => Boolean(line.listing))
    .filter((line) => line.listing.status === "active" && line.listing.quantity > 0);
}
export function cartSubtotal(lines: ReturnType<typeof resolveCart>) {
  return lines.reduce((sum, line) => sum + line.listing.price * Math.min(line.quantity, line.listing.quantity), 0);
}
