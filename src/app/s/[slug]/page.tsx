import Link from "next/link";
import { notFound } from "next/navigation";
import { AppIcon } from "@/components/dashboard/Icon";
import { StoreSubscribeForm } from "@/components/StoreSubscribeForm";
import { cardClass } from "@/components/ui.styles";
import { findUserByStoreSlug, listProductsByUser } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { formatProductPriceSuffix } from "@/lib/product-billing";
import {
  formatLicenseUpdatePeriodLabel,
  isPerpetualLicenseProduct,
} from "@/lib/license-entitlements";
import { getProductDescriptionPlainText } from "@/components/product-description.utils";
import { getStoreById } from "@/lib/stores";
import Powered from "@/components/PoweredBy";
import { generateStorefrontMetadata } from "./page.utils";
import type { StorefrontPageProps } from "./page.types";

export const generateMetadata = generateStorefrontMetadata;

export default async function StorefrontPage({ params }: StorefrontPageProps) {
  const { slug } = await params;
  const seller = await findUserByStoreSlug(slug);
  if (!seller) notFound();
  const store = await getStoreById(seller.activeStoreId, seller.id);

  const products = (
    await listProductsByUser(seller.id, seller.activeStoreId, "live")
  ).filter((p) => p.status === "published");

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        {seller.storeCoverImageUrl && (
          <img
            src={seller.storeCoverImageUrl}
            alt={`${seller.storeName} store cover`}
            className="mb-8 aspect-[3/1] w-full rounded-2xl object-cover"
          />
        )}
        <header className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="flex max-w-xl flex-col items-start">
            {store?.logoImageUrl ? (
              <img
                src={store.logoImageUrl}
                alt={`${store.name} logo`}
                className="h-12 w-12 rounded-xl object-cover"
              />
            ) : (
              <AppIcon size={48} />
            )}
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {seller.storeName}
            </h1>
            <p className="mt-2 whitespace-pre-line text-muted">
              {store?.description || `Digital products from ${seller.name}`}
            </p>
          </div>
          <nav
            className="flex flex-rows items-end gap-6"
            aria-label="Store navigation"
          >
            <Link
              href="/customer/login"
              className="text-sm font-medium text-foreground hover:underline"
            >
              Customer Portal
            </Link>

            {store?.affiliatesEnabled && (
              <Link
                href={`/s/${slug}/affiliates`}
                className="text-sm font-medium text-foreground hover:underline"
              >
                Affiliate Program
              </Link>
            )}
          </nav>
        </header>

        {products.length === 0 ? (
          <div
            className={`${cardClass} mt-10 px-6 py-14 text-center text-sm text-muted`}
          >
            No products published yet.
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/buy/${p.id}`}
                className={`${cardClass} group flex flex-col p-5 transition hover:border-accent/50 hover:shadow-md`}
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="aspect-[16/9] w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-28 items-center justify-center rounded-xl bg-accent-soft text-3xl">
                    📦
                  </div>
                )}
                <h2 className="mt-4 font-semibold group-hover:underline">
                  {p.name}
                </h2>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">
                  {getProductDescriptionPlainText(p.description) ||
                    "Digital product"}
                </p>
                <p className="mt-4 text-lg font-bold">
                  {formatMoney(p.price, p.currency)}
                  {formatProductPriceSuffix(p)}
                </p>
                {isPerpetualLicenseProduct(p) && (
                  <p className="mt-1 text-xs text-muted">
                    Lifetime use · {formatLicenseUpdatePeriodLabel(
                      p.licenseUpdatePeriodUnit || "year",
                      p.licenseUpdatePeriodCount,
                    )} of updates
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        <section className={`${cardClass} mt-10 p-6 sm:p-8`}>
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold">Store updates</h2>
            <p className="mt-1 text-sm text-muted">
              Get new product announcements and offers from {seller.storeName}.
            </p>
          </div>
          <div className="mt-5 max-w-xl">
            <StoreSubscribeForm storeSlug={seller.storeSlug} />
          </div>
        </section>
      </main>
      <footer className="border-t border-border bg-card">
        <Powered storeSlug={seller.storeSlug} />
      </footer>
    </div>
  );
}
