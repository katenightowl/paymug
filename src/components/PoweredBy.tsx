import { AppIcon } from "./dashboard/Icon";

export default function Powered({ storeSlug = "" }) {
  return (
    <a href={`https://paymug.co/?ref=/s/${storeSlug}`} className="mx-6 flex items-center gap-1 py-4 text-[11px] font-medium text-[#9999aa]">
      <span>Powered by</span>
      <span className="font-semibold text-[#555563]">Paymug</span>
      <AppIcon size={16} />
    </a>
  );
}
