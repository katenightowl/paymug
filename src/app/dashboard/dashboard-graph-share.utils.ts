import { formatDashboardMetricValue } from "./dashboard-metric-chart.utils";
import type { CreateDashboardGraphShareImageInput } from "./dashboard-graph-share.types";

const SHARE_WIDTH = 1200;
const SHARE_HEIGHT = 675;

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not create the graph image"));
    }, "image/png");
  });
}

function loadDashboardGraphShareIcon(
  iconSvg: SVGSVGElement
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const serializedIcon = iconSvg.cloneNode(true) as SVGSVGElement;
    serializedIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const iconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      new XMLSerializer().serializeToString(serializedIcon)
    )}`;
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Could not render the Paymug app icon"));
    image.src = iconUrl;
  });
}

export async function createDashboardGraphShareImage({
  metric,
  currency,
  background,
  chartCanvas,
  iconSvg,
}: CreateDashboardGraphShareImageInput) {
  const canvas = document.createElement("canvas");
  canvas.width = SHARE_WIDTH;
  canvas.height = SHARE_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image export is unavailable");

  const gradient = context.createLinearGradient(0, 0, SHARE_WIDTH, SHARE_HEIGHT);
  gradient.addColorStop(0, background.colors[0]);
  gradient.addColorStop(0.52, background.colors[1]);
  gradient.addColorStop(1, background.colors[2]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, SHARE_WIDTH, SHARE_HEIGHT);

  context.fillStyle = background.textColor;
  context.font = "400 28px Inter, Arial, sans-serif";
  context.fillText(metric.label, 76, 70);
  context.font = "700 70px Inter, Arial, sans-serif";
  context.fillText(
    formatDashboardMetricValue(metric.value, metric.format, currency),
    76,
    165
  );
  context.drawImage(chartCanvas, 78, 185, 1044, 390);

  const footerLabel = "Powered by Paymug";
  const icon = await loadDashboardGraphShareIcon(iconSvg);
  context.textAlign = "left";
  context.fillStyle = background.textColor;
  context.font = "400 20px Inter, Arial, sans-serif";
  context.fillText(footerLabel, 76, 622);
  const footerLabelWidth = context.measureText(footerLabel).width;
  context.drawImage(icon, 76 + footerLabelWidth + 12, 600, 28, 28);

  return canvasToBlob(canvas);
}

export function downloadDashboardGraphShareImage(
  blob: Blob,
  metricLabel: string
) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${
    metricLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "paymug-graph"
  }.png`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
