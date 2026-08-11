import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DashboardNav } from "@/components/DashboardNav";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { getSessionUser } from "@/lib/auth";
import {
  hasUnreadNotifications,
  listNotifications,
} from "@/lib/notifications";
import { getPayPalEnvironmentState } from "@/lib/paypal-environment";
import { getRequestOrigin } from "@/lib/request-origin.utils";
import { getSetupChecklist } from "@/lib/setup-checklist";
import { reconcileExpiredGitHubLicenses } from "@/lib/github-access";
import { listStoresByUser } from "@/lib/stores";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const stores = await listStoresByUser(user.id);
  if (stores.length === 0) redirect("/create-store");
  await reconcileExpiredGitHubLicenses(user.id);
  const requestOrigin = getRequestOrigin(await headers());
  const [
    environmentState,
    notifications,
    hasUnread,
    setupChecklist,
  ] =
    await Promise.all([
      getPayPalEnvironmentState(
        user.id,
        user.environment,
        user.activeStoreId
      ),
      listNotifications(user.id, 12, user.environment),
      hasUnreadNotifications(user.id, user.environment),
      getSetupChecklist(
        user.id,
        user.storeName,
        user.storeSlug,
        requestOrigin,
        user.activeStoreId,
        user.environment
      ),
    ]);
  const activeStore =
    stores.find((store) => store.id === user.activeStoreId) || stores[0];

  return (
    <div className="grid min-h-dvh grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto_minmax(0,1fr)] overflow-x-clip bg-white text-[#333] [--background:#fff] [--border:#e8e8ee] [--card:#fff] [--foreground:#27272f] [--muted:#85859d] lg:grid-cols-[15rem_minmax(0,1fr)] lg:grid-rows-[5.5rem_minmax(0,1fr)]">
      <DashboardNav
        storeName={user.storeName}
        storeSlug={user.storeSlug}
        activeStoreId={user.activeStoreId}
        stores={stores}
        userName={user.name}
        environment={environmentState.active}
        environmentAvailability={environmentState.availability}
        setupProgress={setupChecklist.progress}
        affiliatesEnabled={activeStore?.affiliatesEnabled ?? true}
        emailCampaignsEnabled={activeStore?.emailCampaignsEnabled ?? true}
      />
      <DashboardTopbar
        initialNotifications={notifications}
        initialHasUnread={hasUnread}
      />
      <main className="row-start-3 min-w-0 overflow-x-clip px-4 pb-7 [&_a]:cursor-pointer [&_button]:cursor-pointer sm:px-8 lg:col-start-2 lg:row-start-2 lg:px-10 lg:pb-10">
        {children}
      </main>
    </div>
  );
}
