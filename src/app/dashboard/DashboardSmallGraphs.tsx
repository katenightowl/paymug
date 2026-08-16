"use client";

import { useEffect, useMemo, useState } from "react";
import { CustomSelect } from "@/components/CustomSelect";
import { DashboardMetricChart } from "./DashboardMetricChart";
import {
  createDashboardSmallGraphSlot,
  createDefaultDashboardSmallGraphSlots,
  readDashboardSmallGraphSlots,
  saveDashboardSmallGraphSlots,
} from "./dashboard-small-graphs.utils";
import type {
  DashboardSmallGraphsProps,
  DashboardSmallGraphSlot,
} from "./dashboard-overview.types";

export function DashboardSmallGraphs({
  metricGroups,
  currency,
}: DashboardSmallGraphsProps) {
  const [slots, setSlots] = useState<DashboardSmallGraphSlot[]>(() =>
    createDefaultDashboardSmallGraphSlots(metricGroups)
  );

  useEffect(() => {
    const storedSlots = readDashboardSmallGraphSlots(metricGroups);
    if (storedSlots) setSlots(storedSlots);
  }, [metricGroups]);

  const selectedMetricKeys = useMemo(
    () => new Set(slots.map((slot) => slot.metricKey)),
    [slots]
  );
  const availableMetrics = metricGroups.flatMap((group) =>
    group.metrics
      .filter((metric) => !selectedMetricKeys.has(metric.key))
      .map((metric) => ({
        value: metric.key,
        label: metric.label,
        groupKey: group.key,
      }))
  );

  function updateSlots(
    update: (current: DashboardSmallGraphSlot[]) => DashboardSmallGraphSlot[]
  ) {
    setSlots((current) => {
      const next = update(current);
      saveDashboardSmallGraphSlots(next);
      return next;
    });
  }

  function addGraph(metricKey: string) {
    const selected = availableMetrics.find(
      (metric) => metric.value === metricKey
    );
    if (!selected) return;
    updateSlots((current) => [
      ...current,
      createDashboardSmallGraphSlot(selected.groupKey, selected.value),
    ]);
  }

  function resetGraphs() {
    updateSlots(() => createDefaultDashboardSmallGraphSlots(metricGroups));
  }

  return (
    <section className="mt-10">
      {!!slots.length && (
        <div className="grid border-l border-t border-[#e8e8ee] md:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => {
            const group = metricGroups.find(
              (candidate) => candidate.key === slot.groupKey
            );
            if (!group) return null;
            return (
              <DashboardMetricChart
                key={slot.id}
                group={group}
                metricKey={slot.metricKey}
                currency={currency}
                onMetricChange={(metricKey) =>
                  updateSlots((current) =>
                    current.map((candidate) =>
                      candidate.id === slot.id
                        ? { ...candidate, metricKey }
                        : candidate
                    )
                  )
                }
                onRemove={() =>
                  updateSlots((current) =>
                    current.filter((candidate) => candidate.id !== slot.id)
                  )
                }
              />
            );
          })}
        </div>
      )}

      <div className="mt-3 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={resetGraphs}
          className="py-1 text-xs font-medium text-[#74748f] hover:text-[#333]"
        >
          Reset
        </button>
        <CustomSelect
          value=""
          onValueChange={addGraph}
          options={[
            { value: "", label: "Add Graph", disabled: true },
            ...availableMetrics.map(({ value, label }) => ({
              value,
              label,
            })),
          ]}
          disabled={!availableMetrics.length}
          variant="plain"
          ariaLabel="Add a small graph"
          triggerClassName="text-xs font-medium text-[#333] hover:text-accent-hover"
          menuClassName="bottom-[calc(100%+0.65rem)] left-auto right-0 top-auto w-74"
        />
      </div>
    </section>
  );
}
