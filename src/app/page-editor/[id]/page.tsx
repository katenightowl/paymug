import { notFound } from "next/navigation";
import { PageEditor } from "@/app/dashboard/pages/PageEditor";
import { getSessionUser } from "@/lib/auth";
import { findStorePage } from "@/lib/store-pages";
import type { PageEditorRouteProps } from "./page.types";

export default async function EditPageEditorPage({ params }: PageEditorRouteProps) {
  const user = await getSessionUser();
  if (!user) notFound();
  const { id } = await params;
  const page = await findStorePage(id, user.id);
  if (
    !page ||
    page.storeId !== user.activeStoreId ||
    page.environment !== user.environment
  ) {
    notFound();
  }
  return <PageEditor page={page} />;
}
