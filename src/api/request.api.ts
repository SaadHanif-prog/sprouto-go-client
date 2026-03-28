import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

/* ================= TYPES ================= */

export type RequestStatus = "pending" | "in-progress" | "completed";
export type RequestPriority = "low" | "medium" | "high";

export interface UserInfo {
  _id: string;
  name: string;
  email?: string;
}

export interface SiteInfo {
  _id: string;
  name: string;
  url?: string;
}

export interface Request {
  _id: string;

  siteId: SiteInfo | string;
  userId: UserInfo | string;

  // 👇 NEW
  assignedTo?: UserInfo | null;

  title: string;
  description: string;

  priority: RequestPriority;
  status: RequestStatus;

  // 👇 FUTURE SAFE (won’t break if missing)
  messages?: any[];
  attachments?: any[];

  createdAt: string;
  updatedAt: string;
}

export interface GetRequestsResponse {
  success: boolean;
  data: Request[];
}

export interface CreateRequestPayload {
  siteId: string;
  title: string;
  description: string;
  priority: RequestPriority;
}

export interface CreateRequestResponse {
  success: boolean;
  data: Request;
}

// 👇 NEW
export interface AssignRequestPayload {
  developerId: string;
}

export interface AssignRequestResponse {
  success: boolean;
  data: Request;
}

/* ================= API ================= */

// GET REQUESTS
export const getRequests = async (
  siteId?: string
): Promise<GetRequestsResponse> => {
  const url = siteId
    ? `${ENDPOINTS.requests}?siteId=${siteId}`
    : `${ENDPOINTS.requests}`;

  const { data } = await apiClient.get<GetRequestsResponse>(url);
  return data;
};

// CREATE REQUEST
export const createRequest = async (
  payload: CreateRequestPayload
): Promise<CreateRequestResponse> => {
  const { data } = await apiClient.post<CreateRequestResponse>(
    `${ENDPOINTS.requests}`,
    payload
  );

  return data;
};

// ASSIGN DEVELOPER
export const assignRequest = async (
  requestId: string,
  payload: AssignRequestPayload
): Promise<AssignRequestResponse> => {
  const { data } = await apiClient.patch<AssignRequestResponse>(
    `${ENDPOINTS.requests}/${requestId}/assign`,
    payload
  );

  return data;
};