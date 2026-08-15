"use client";

import { ShareNetwork } from "@phosphor-icons/react";
import { useState } from "react";
import { DashboardGraphShareModal } from "./DashboardGraphShareModal";
import type { DashboardGraphShareButtonProps } from "./dashboard-graph-share.types";

export function DashboardGraphShareButton({
  metric,
  currency,
  className = "",
}: DashboardGraphShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`pointer-events-none absolute z-20 grid h-9 w-9 place-items-center rounded-xl border border-[#dedee7] bg-white text-[#74748f] opacity-0 shadow-sm transition hover:border-[#cfcfda] hover:text-[#333] focus:pointer-events-auto focus:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 ${className}`}
        aria-label={`Share ${metric.label} graph`}
      >
        <ShareNetwork size={17} weight="bold" aria-hidden />
      </button>
      {open && (
        <DashboardGraphShareModal
          metric={metric}
          currency={currency}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
