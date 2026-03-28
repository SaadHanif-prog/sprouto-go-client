import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

/* ================= TYPES ================= */

export interface GeoMarker {
  name: string;
  coordinates: [number, number];
  clicks: number;
  markerOffset: number;
}

export type ActivityType = "success" | "info" | "purple" | "warning";

export interface RecentActivity {
  title: string;
  desc: string;
  time: string;
  type: ActivityType;
}

export interface ChartDataPoint {
  name: string;
  searches: number;
  clicks: number;
}

export interface AiStats {
  totalSearches: number;
  totalClicks: number;
  uniqueVisitors: number;
  searchChange: string;
  clickChange: string;
  visitorChange: string;
  chartData: ChartDataPoint[];
  geoMarkers: GeoMarker[];
  recentActivities: RecentActivity[];
}

export interface GetAiStatsPayload {
  url: string;
}

export interface GetAiStatsResponse {
  success: boolean;
  data: AiStats;
}

/* ================= API ================= */

export const getAiStats = async (
  payload: GetAiStatsPayload
): Promise<GetAiStatsResponse> => {
  const { data } = await apiClient.post<GetAiStatsResponse>(
    ENDPOINTS.stats,
    payload
  );
  return data;
};