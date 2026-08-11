"use client";

import { CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { DashboardCalendar } from "./DashboardCalendar";
import {
  addMonths,
  formatRangeDate,
  getMonthKey,
  getPresetRange,
} from "./dashboard-filter.utils";
import { saveDashboardFilterPreference } from "./dashboard-filter-preference.utils";
import type { DashboardFilterProps } from "./dashboard-overview.types";

const presets = [
  { value: "today", label: "Today" },
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 3 months" },
  { value: "365", label: "Last 12 months" },
  { value: "month", label: "Month to date" },
  { value: "quarter", label: "Quarter to date" },
  { value: "year", label: "Year to date" },
  { value: "all", label: "All time" },
] as const;

export function DashboardDateRangePicker({
  startDate,
  endDate,
  interval,
  productId,
  earliestDate,
}: DashboardFilterProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(startDate);
  const [draftEnd, setDraftEnd] = useState(endDate);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [leftMonth, setLeftMonth] = useState(
    getMonthKey(new Date(`${startDate}T12:00:00Z`)),
  );

  function navigate(nextStart: string, nextEnd: string) {
    const nextState = {
      startDate: nextStart,
      endDate: nextEnd,
      interval,
      productId,
    };
    saveDashboardFilterPreference(nextState);
    router.refresh();
    setOpen(false);
  }

  function selectDate(date: string) {
    if (!selectingEnd) {
      setDraftStart(date);
      setDraftEnd(date);
      setSelectingEnd(true);
      return;
    }

    if (date < draftStart) {
      setDraftEnd(draftStart);
      setDraftStart(date);
    } else {
      setDraftEnd(date);
    }
    setSelectingEnd(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#333]"
        aria-expanded={open}
      >
        {formatRangeDate(startDate)} — {formatRangeDate(endDate)}
        <CaretDown size={14} weight="bold" className="text-[#9191aa]" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+1rem)] z-50 w-[min(64rem,calc(100vw-20rem))] overflow-hidden rounded-2xl border border-[#dedee7] max-w-220 bg-white shadow-[0_18px_45px_rgb(42_38_63/16%)]">
          <div className="grid lg:grid-cols-[10rem_1fr]">
            <div className="border-b border-[#e8e8ee] py-5 px-4 lg:border-b-0 lg:border-r">
              <div className="grid gap-1">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      const range = getPresetRange(preset.value, earliestDate);
                      navigate(range.startDate, range.endDate);
                    }}
                    className="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f7f7f8]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-[#e8e8ee] px-5 py-3">
                <button
                  type="button"
                  onClick={() => setLeftMonth((month) => addMonths(month, -1))}
                  className="grid h-9 w-9 place-items-center rounded-lg text-[#85859d] hover:bg-[#f7f7f8]"
                  aria-label="Previous months"
                >
                  <CaretLeft size={18} weight="bold" />
                </button>
                <p className="text-sm text-muted">
                  Select a start date, then an end date
                </p>
                <button
                  type="button"
                  onClick={() => setLeftMonth((month) => addMonths(month, 1))}
                  className="grid h-9 w-9 place-items-center rounded-lg text-[#85859d] hover:bg-[#f7f7f8]"
                  aria-label="Next months"
                >
                  <CaretRight size={18} weight="bold" />
                </button>
              </div>
              <div className="flex divide-x divide-[#e8e8ee]">
                <DashboardCalendar
                  month={leftMonth}
                  startDate={draftStart}
                  endDate={draftEnd}
                  onSelect={selectDate}
                />
                 <DashboardCalendar
                    month={addMonths(leftMonth, 1)}
                    startDate={draftStart}
                    endDate={draftEnd}
                    onSelect={selectDate}
                  />
              </div>
              <div className="flex items-center justify-between border-t border-[#e8e8ee] px-5 py-3">
                <p className="text-sm text-muted">
                  {formatRangeDate(draftStart)} — {formatRangeDate(draftEnd)}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate(draftStart, draftEnd)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
