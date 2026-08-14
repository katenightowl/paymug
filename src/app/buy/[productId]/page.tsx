import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDescription } from "@/components/ProductDescription";
import { cardClass } from "@/components/ui.styles";
import { getSessionUser } from "@/lib/auth";
import { findProductById, findUserById } from "@/lib/db";
import {
  getPayPalCredentials,
  getStripeCredentials,
} from "@/lib/payment-credentials";
import {
  formatProductBillingSummary,
  formatProductPriceSuffix,
  isSubscriptionProduct,
} from "@/lib/product-billing";
import {
  formatLicenseUpdatePeriodLabel,
  isPerpetualLicenseProduct,
} from "@/lib/license-entitlements";
import { calculateCheckoutPricing } from "@/lib/product-pricing";
import { getStoreById } from "@/lib/stores";
import { CheckoutClient } from "./CheckoutClient";
import { formatProductPageMoney } from "./product-page.utils";
import { generateProductMetadata } from "./page-metadata.utils";
import type { BuyPageProps } from "./page.types";

export const generateMetadata = generateProductMetadata;

export default async function BuyPage({ params, searchParams }: BuyPageProps) {
  const { productId } = await params;
  const { cancelled, discount, preview, ref } = await searchParams;

  const product = await findProductById(productId);
  if (!product) notFound();
  const isPreview =
    product.status !== "published" || product.environment === "sandbox";
  if (isPreview) {
    if (product.status !== "published" && preview === undefined) notFound();
    const user = await getSessionUser();
    if (user?.id !== product.userId) notFound();
  }

  const [seller, store] = await Promise.all([
    findUserById(product.userId),
    getStoreById(product.storeId, product.userId),
  ]);
  if (!seller || !store) notFound();

  const paypal =
    store.paymentGateway === "paypal"
      ? await getPayPalCredentials(
          product.userId,
          product.environment,
          product.storeId,
        )
      : undefined;
  const stripe =
    store.paymentGateway === "stripe"
      ? await getStripeCredentials(
          product.userId,
          product.environment,
          product.storeId,
        )
      : undefined;
  const initialPricing = calculateCheckoutPricing(product);
  const isSandbox = product.environment === "sandbox";
  const perpetualLicense = isPerpetualLicenseProduct(product);
  const priceSuffix = perpetualLicense ? "" : formatProductPriceSuffix(product);
  const billingSummary = formatProductBillingSummary(product);
  const perpetualUpdateSummary = perpetualLicense
    ? `Includes ${formatLicenseUpdatePeriodLabel(
        product.licenseUpdatePeriodUnit || "year",
        product.licenseUpdatePeriodCount,
      )} of product updates`
    : undefined;

  return (
    <div className="min-h-screen bg-white">
      {isPreview && (
        <div className="bg-amber-100 px-6 py-2 text-center text-sm text-amber-900">
          Preview — this is a{" "}
          {product.environment === "sandbox" ? "test" : "draft"} product
        </div>
      )}
      {isSandbox && (
        <div className="px-6 py-2 bg-amber-300 text-sm text-center">
          This store is still in sandbox mode
        </div>
      )}

      <main className="mx-auto grid max-w-5xl px-4 pb-10 pt-5 lg:grid-cols-5">
        <div className="lg:col-span-3 lg:sticky lg:top-6 lg:self-start">
          <div className="pr-8 lg:pr-14">
            <header className="mx-auto flex w-full max-w-5xl items-center justify-between pb-4 mb-4 border-b border-border">
              <div className="flex h-8 items-center">
                <Link
                  className="flex flex-row items-end gap-2"
                  href={`/s/${store.slug}`}
                  aria-label={`${store.name} store`}
                >
                  {store.logoImageUrl && (
                    <img
                      src={store.logoImageUrl}
                      alt={`${store.name} logo`}
                      className="h-6 w-6 rounded-lg object-cover"
                    />
                  )}
                  {store.name}
                </Link>
              </div>
            </header>

            <div className="mb-6 flex items-start justify-between gap-6">
              <h1 className="min-w-0 text-2xl font-bold tracking-tight sm:text-3xl">
                {product.name}
              </h1>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-bold sm:text-3xl">
                  {formatProductPageMoney(product.price, product.currency)}
                  {priceSuffix}
                </p>
                {perpetualUpdateSummary ? (
                  <p className="mt-1 max-w-56 text-xs leading-5 text-muted">
                    {perpetualUpdateSummary}
                  </p>
                ) : billingSummary ? (
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {billingSummary}
                  </p>
                ) : null}
              </div>
            </div>

            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="aspect-video w-full object-cover rounded-xl mb-6"
              />
            )}
            {product.description && (
              <ProductDescription
                value={product.description}
                className="mt-6"
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className={`${cardClass} sticky top-6 overflow-hidden`}>
            {/* <h2 className="font-semibold px-6 py-3 border-b border-border">
              Checkout
            </h2> */}

            {cancelled && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Payment was cancelled. You can try again below.
              </p>
            )}

            <CheckoutClient
              productId={product.id}
              productName={product.name}
              productPrice={product.price}
              affiliateRef={ref?.trim() || undefined}
              initialDiscountCode={discount?.trim() || undefined}
              initialTransactionFeeAmount={initialPricing.transactionFeeAmount}
              paypalClientId={paypal?.clientId}
              stripeEnabled={Boolean(stripe)}
              mode={paypal?.mode || stripe?.mode || "sandbox"}
              currency={product.currency}
              isSubscription={isSubscriptionProduct(product)}
              billingSummary={billingSummary}
              priceSuffix={priceSuffix}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
