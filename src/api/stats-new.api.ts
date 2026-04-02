import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

// ================= TYPES =================
export interface GetAiStatsPayload {
  siteId: string;
}

export interface AiStatsResponse {
  success: boolean;
  data: {
    totalSearches: number;
    totalClicks: number;
    uniqueVisitors: number;

    searchChange: string;
    clickChange: string;
    visitorChange: string;

    chartData: {
      name: string;
      searches: number;
      clicks: number;
    }[];

    geoMarkers: {
      name: string;
      coordinates: [number, number];
      clicks: number;
      markerOffset: number;
    }[];

    recentActivities: {
      title: string;
      desc: string;
      time: string;
      type: string;
    }[];
  };
}

// ================= CONNECT GOOGLE =================
export const connectGoogle = async (): Promise<void> => {
  const response = await fetch(
    "https://sprouto-go-server.onrender.com/api/v1/google/connect-google",
    {
      method: "GET",
      credentials: "include", 
    }
  );

  const { url } = await response.json();
  window.location.href = url; 
};

// ================= GET AI STATS =================
export const getAiStats = async (
  payload: GetAiStatsPayload
): Promise<AiStatsResponse> => {
  const { data } = await apiClient.post<AiStatsResponse>(
    `${ENDPOINTS.statsnew}/stats`,
    payload
  );
  return data;
};