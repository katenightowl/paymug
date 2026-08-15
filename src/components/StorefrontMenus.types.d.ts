import type { StorePage } from "@/lib/store-pages.types";

export interface StorefrontNavigationProps {
  pages: StorePage[];
  affiliatesEnabled: boolean;
  showDashboard?: boolean;
}

export interface StorefrontFooterProps {
  pages: StorePage[];
}
