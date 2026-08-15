import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDescription } from "@/components/ProductDescription";
import { AppIcon } from "@/components/dashboard/Icon";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { StorefrontNavigation } from "@/components/StorefrontNavigation";
import { StoreTestModeRibbon } from "@/components/StoreTestModeRibbon";
import { getSessionUser } from "@/lib/auth";
import { findStorePageBySlug, listStorePages } from "@/lib/store-pages";
import { resolveStorefrontEnvironment } from "@/lib/storefront-environment.utils";
import { getPrimaryStore } from "@/lib/stores";
import { generatePublicStorePageMetadata } from "./page-metadata.utils";
import type { PublicStorePageProps } from "./page.types";

export const generateMetadata = generatePublicStorePageMetadata;

export default async function PublicStorePage({
  params,
}: PublicStorePageProps) {
  const { slug } = await params;
  const store = await getPrimaryStore();
  if (!store) notFound();
  const viewer = await getSessionUser();
  const environment = resolveStorefrontEnvironment(
    store.userId,
    viewer?.environment || "live",
    viewer?.id,
  );
  const [page, pages] = await Promise.all([
    findStorePageBySlug(store.userId, store.id, environment, slug),
    listStorePages(store.userId, store.id, environment),
  ]);
  if (!page || page.status !== "published") notFound();
  const publishedPages = pages.filter(
    (candidate) => candidate.status === "published",
  );
  const topPages = publishedPages.filter(
    (candidate) => candidate.navigation === "top",
  );
  const footerPages = publishedPages.filter(
    (candidate) => candidate.navigation === "footer",
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {environment === "sandbox" && <StoreTestModeRibbon />}
      <header className="mx-auto flex w-full max-w-5xl flex-col justify-between gap-6 px-4 py-8 sm:flex-row sm:items-center">
        <Link href="/" className="flex items-center gap-3">
          {store.logoImageUrl ? (
            <img
              src={store.logoImageUrl}
              alt={`${store.name} logo`}
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <AppIcon size={28} />
          )}
          <span className="text-lg font-bold tracking-tight">{store.name}</span>
        </Link>
        <StorefrontNavigation
          pages={topPages}
          affiliatesEnabled={store.affiliatesEnabled}
          showDashboard={viewer?.id === store.userId}
        />
      </header>
      <main className="flex-1 px-4 pb-24">
        <article className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-[42rem] py-12 sm:py-16">
            <h1 className="text-5xl font-bold leading-[1.04] tracking-[-0.045em] sm:text-6xl">
              {page.title}
            </h1>
            {page.description && (
              <p className="mt-6 text-xl leading-8 text-muted">
                {page.description}
              </p>
            )}
          </div>
          {page.coverImageUrl && (
            <img
              src={page.coverImageUrl}
              alt={`${page.title} cover`}
              className="aspect-[2.4/1] w-full rounded-2xl object-cover"
            />
          )}

          <div className="mx-auto max-w-[42rem] py-12 sm:py-16">
            <ProductDescription
              value={page.content}
              className="text-[1.08rem] leading-8 [&_h2]:mt-10 [&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:text-2xl [&_img]:my-8"
            />
          </div>
        </article>
      </main>
      <StorefrontFooter pages={footerPages} />
    </div>
  );
}
