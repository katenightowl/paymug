"use client";

import { useMemo } from "react";
import { AreaChart } from "@/components/dashboard/charts";
import { CustomSelect } from "@/components/CustomSelect";
import { DeltaLine } from "./DashboardOverviewControls";
import { formatDashboardMetricValue } from "./dashboard-metric-chart.utils";
import { useDashboardMetricPreference } from "./dashboard-metric-preference.utils";
import type { DashboardPrimaryMetricChartProps } from "./dashboard-overview.types";

export function DashboardPrimaryMetricChart({
  metricGroups,
  defaultMetricKey,
  currency,
}: DashboardPrimaryMetricChartProps) {
  const metrics = useMemo(
    () => metricGroups.flatMap((group) => group.metrics),
    [metricGroups]
  );
  const [selectedMetricKey, selectMetric] = useDashboardMetricPreference(
    "main",
    defaultMetricKey,
    metrics
  );
  const metric =
    metrics.find((candidate) => candidate.key === selectedMetricKey) ||
    metrics[0];

  if (!metric) return null;

  return (
    <section className="pt-8">
      <CustomSelect
        value={metric.key}
        onValueChange={selectMetric}
        options={metrics.map((option) => ({
          value: option.key,
          label: option.label,
        }))}
        variant="plain"
        ariaLabel="Select main graph"
        triggerClassName="text-sm font-medium"
      />
      <div className="mt-3 flex flex-wrap items-center">
        <p className="text-3xl font-medium leading-none tracking-[-0.04em] tabular-nums">
          {formatDashboardMetricValue(metric.value, metric.format, currency)}
        </p>
        <DeltaLine delta={metric.delta} />
      </div>
      <p className="mt-2 text-sm text-muted">
        vs. {formatDashboardMetricValue(
          metric.previousValue,
          metric.format,
          currency
        )}{" "}
        last period
      </p>
      <div className="mt-7">
        <AreaChart
          data={metric.data}
          comparisonData={metric.comparisonData}
          height={260}
          color="#f5c518"
          comparisonColor="#f082dc"
          fillOpacity={0.025}
          showAxis={false}
          currency={currency}
          valueFormat={metric.format}
          emptyLabel=""
          title={metric.label}
          trendPercent={metric.delta}
        />
      </div>
    </section>
  );
}
