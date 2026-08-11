import { CreateStoreForm } from "@/components/dashboard/CreateStoreForm";
import {
  dashboardPageClass,
  dashboardPageCopyClass,
} from "@/components/dashboard/dashboard.styles";

export default function NewStorePage() {
  return (
    <div className={`${dashboardPageClass} !max-w-xl`}>
      <h1 className="sr-only">Create store</h1>
      <p className={dashboardPageCopyClass}>Create another storefront</p>
      <CreateStoreForm />
    </div>
  );
}
