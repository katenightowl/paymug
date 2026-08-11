import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { cardClass } from "@/components/ui.styles";
import { getSessionUser } from "@/lib/auth";
import { listStoresByUser } from "@/lib/stores";
import { FirstStoreForm } from "./FirstStoreForm";

export default async function CreateFirstStorePage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup");

  const stores = await listStoresByUser(user.id);
  if (stores.length > 0) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Logo />
      <div className={`${cardClass} mt-8 w-full max-w-md p-8`}>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Step 2 of 2
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Create your store
        </h1>
        <p className="mt-1 text-sm text-muted">
          Choose the name and public URL customers will see.
        </p>
        <FirstStoreForm />
      </div>
    </div>
  );
}
