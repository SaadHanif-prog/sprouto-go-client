import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

/* ================= TYPES ================= */

export interface MonthlyTarget {
  _id: string;
  siteId: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  month: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTargetPayload {
  siteId: string;
  metric: string;
  targetValue: number;
  unit: string;
  month: string;
  url?: string; // optional — used by Gemini to estimate currentValue
}

export interface UpdateTargetPayload {
  metric?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  month?: string;
}

export interface GetTargetsResponse {
  success: boolean;
  data: MonthlyTarget[];
}

export interface TargetResponse {
  success: boolean;
  data: MonthlyTarget;
}

/* ================= API ================= */

export const getTargets = async (siteId: string): Promise<GetTargetsResponse> => {
  const { data } = await apiClient.get<GetTargetsResponse>(
    `${ENDPOINTS.targets}/${siteId}`
  );
  return data;
};

export const createTarget = async (
  payload: CreateTargetPayload
): Promise<TargetResponse> => {
  const { data } = await apiClient.post<TargetResponse>(ENDPOINTS.targets, payload);
  return data;
};

export const updateTarget = async (
  id: string,
  payload: UpdateTargetPayload
): Promise<TargetResponse> => {
  const { data } = await apiClient.put<TargetResponse>(
    `${ENDPOINTS.targets}/${id}`,
    payload
  );
  return data;
};

export const deleteTarget = async (id: string): Promise<{ success: boolean; message: string }> => {
  const { data } = await apiClient.delete(`${ENDPOINTS.targets}/${id}`);
  return data;
};