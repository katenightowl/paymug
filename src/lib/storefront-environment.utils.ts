import type { PayPalMode } from "./types";

export function resolveStorefrontEnvironment(
  sellerId: string,
  sellerEnvironment: PayPalMode,
  viewerId?: string,
): PayPalMode {
  return viewerId === sellerId ? sellerEnvironment : "live";
}
