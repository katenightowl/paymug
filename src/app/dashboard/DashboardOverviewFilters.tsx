"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/CustomSelect";
import { DashboardDateRangePicker } from "./DashboardDateRangePicker";
import {
  dashboardFilterStatesMatch,
  hasDashboardFilterCookie,
  readDashboardFilterPreference,
  saveDashboardFilterPreference,
} from "./dashboard-filter-preference.utils";
import type {
  DashboardFilterProps,
  DashboardInterval,
} from "./dashboard-overview.types";

export function DashboardOverviewFilters(props: DashboardFilterProps) {
  const router = useRouter();

  useEffect(() => {
    const currentState = {
      startDate: props.startDate,
      endDate: props.endDate,
      interval: props.interval,
      productId: props.productId,
    };
    const storedState = readDashboardFilterPreference(
      props.products.map((product) => product.id)
    );
    if (
      storedState &&
      !hasDashboardFilterCookie() &&
      !dashboardFilterStatesMatch(currentState, storedState)
    ) {
      saveDashboardFilterPreference(storedState);
      router.refresh();
      return;
    }
    saveDashboardFilterPreference(currentState);
  }, [
    props.endDate,
    props.interval,
    props.productId,
    props.products,
    props.startDate,
    router,
  ]);

  function updateFilter(
    interval: DashboardInterval,
    productId: string
  ) {
    const nextState = {
      startDate: props.startDate,
      endDate: props.endDate,
      interval,
      productId,
    };
    saveDashboardFilterPreference(nextState);
    router.refresh();
  }

  return (
    <div className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-[#e8e8ee]">
      <div className="flex flex-wrap items-center gap-7">
        <DashboardDateRangePicker {...props} />
        <CustomSelect
          value={props.interval}
          onValueChange={(value) =>
            updateFilter(value as DashboardInterval, props.productId)
          }
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
          ]}
          variant="plain"
          ariaLabel="Graph interval"
          triggerClassName="text-sm font-medium"
        />
        <CustomSelect
          value={props.productId}
          onValueChange={(value) => updateFilter(props.interval, value)}
          options={[
            { value: "all", label: "All products" },
            ...props.products.map((product) => ({
              value: product.id,
              label: product.name,
            })),
          ]}
          variant="plain"
          ariaLabel="Product"
          triggerClassName="max-w-56 text-sm font-medium"
        />
      </div>
      <div className="flex items-center gap-5 text-sm text-[#74748f]">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-accent" />
          Chosen period
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-[#f082dc]" />
          Last period
        </span>
      </div>
    </div>
  );
}
