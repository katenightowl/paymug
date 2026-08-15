import { notFound } from "next/navigation";
import { PageEditor } from "@/app/dashboard/pages/PageEditor";
import { getSessionUser } from "@/lib/auth";

export default async function NewPageEditorPage() {
  if (!(await getSessionUser())) notFound();
  return <PageEditor />;
}
