import type { FeatureRecord } from "@/lib/feature-records.types";
import type { Order, Product } from "@/lib/types";
import type { ChartPoint } from "@/components/dashboard/charts.types";

export type DashboardInterval = "daily" | "weekly" | "monthly";

export interface DashboardOverviewSearchParams {
  start?: string;
  end?: string;
  range?: string;
  interval?: string;
  product?: string;
}

export interface DashboardFilterState {
  startDate: string;
  endDate: string;
  interval: DashboardInterval;
  productId: string;
}

export type DashboardFilterPreference = DashboardFilterState;

export interface DashboardFilterProps extends DashboardFilterState {
  products: Array<Pick<Product, "id" | "name">>;
  earliestDate?: string;
}

export interface DashboardOverviewFiltersProps extends DashboardFilterProps {
  metricGroups: DashboardMetricGroup[];
  defaultMetricKey: string;
}

export interface DashboardShareButtonProps {
  startDate: string;
  endDate: string;
  interval: DashboardInterval;
  productId: string;
}

export interface DashboardCalendarProps {
  month: string;
  startDate: string;
  endDate: string;
  onSelect: (date: string) => void;
}

export interface DashboardMetricSeries {
  key: string;
  label: string;
  value: number;
  previousValue: number;
  delta: number | null;
  format: "money" | "number" | "percent";
  data: ChartPoint[];
  comparisonData: ChartPoint[];
}

export type DashboardMetricGroupKey =
  | "revenue"
  | "orders"
  | "subscriptions"
  | "affiliates"
  | "email";

export interface DashboardMetricGroup {
  key: DashboardMetricGroupKey;
  label: string;
  defaultMetricKey: string;
  metrics: DashboardMetricSeries[];
}

export interface DashboardSeriesBucket {
  startDate: string;
  endDate: string;
  label: string;
  value: number;
}

export interface PayPalPaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  currency?: string;
}

export interface DashboardOverviewData {
  currency: string;
  primary: DashboardMetricSeries;
  metricGroups: DashboardMetricGroup[];
}

export interface DashboardMetricChartProps {
  group: DashboardMetricGroup;
  metricKey: string;
  currency: string;
  onMetricChange(metricKey: string): void;
  onRemove(): void;
}

export interface DashboardSmallGraphSlot {
  id: string;
  groupKey: DashboardMetricGroupKey;
  metricKey: string;
}

export interface DashboardSmallGraphsProps {
  metricGroups: DashboardMetricGroup[];
  currency: string;
}

export interface DashboardPrimaryMetricChartProps {
  metricGroups: DashboardMetricGroup[];
  defaultMetricKey: string;
  currency: string;
}

export interface BuildDashboardOverviewInput {
  orders: Order[];
  subscriptions: FeatureRecord[];
  subscribers: FeatureRecord[];
  campaigns: FeatureRecord[];
  affiliateClicks: FeatureRecord[];
  affiliateReferrals: FeatureRecord[];
  affiliatePayouts: FeatureRecord[];
  startDate: string;
  endDate: string;
  interval: DashboardInterval;
  productId: string;
}
