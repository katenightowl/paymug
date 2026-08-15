import Link from "next/link";
import type { StorefrontNavigationProps } from "./StorefrontMenus.types";

export function StorefrontNavigation({
  pages,
  affiliatesEnabled,
  showDashboard = false,
}: StorefrontNavigationProps) {
  return (
    <nav
      className="flex flex-wrap items-center justify-end *:px-6 *:py-2 divide-x divide-border"
      aria-label="Store navigation"
    >
      {pages.map((page) => (
        <Link
          key={page.id}
          href={`/${page.slug}`}
          className="text-sm font-medium text-foreground hover:text-accent-dark"
        >
          {page.navigationLabel || page.title}
        </Link>
      ))}
      {affiliatesEnabled && (
        <Link
          href="/affiliates"
          className="text-sm font-medium text-foreground hover:text-accent-dark"
        >
          Affiliate Program
        </Link>
      )}
      {showDashboard && (
        <Link
          href="/dashboard"
          className="text-sm font-medium text-foreground hover:text-accent-dark"
        >
          Dashboard
        </Link>
      )}
      <Link
        href="/customer/login"
        className="text-sm font-medium text-foreground hover:text-accent-dark"
      >
        Customer Portal
      </Link>
    </nav>
  );
}
