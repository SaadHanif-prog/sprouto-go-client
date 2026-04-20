import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

/* ================= TYPES ================= */

export type RequestStatus = "pending" | "in-progress" | "completed";
export type RequestPriority = string;

export interface UserInfo {
  _id: string;
  firstname: string;
  surname: string;
  email?: string;
}

export interface SiteInfo {
  _id: string;
  name: string;
  url?: string;
}

export interface Attachment {
  _id: string;
  url: string;
  public_id: string;
  original_name: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

export interface Request {
  _id: string;
  siteId: SiteInfo | string;
  userId: UserInfo | string;
  assignedTo?: UserInfo | null;
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  messages?: any[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface GetRequestsResponse {
  success: boolean;
  data: Request[];
}

export interface CreateRequestPayload {
  siteId?: string;
  title: string;
  description: string;
  priority: RequestPriority;
}

export interface CreateRequestResponse {
  success: boolean;
  data: Request;
}

export interface AssignRequestPayload {
  developerId: string;
}

export interface AssignRequestResponse {
  success: boolean;
  data: Request;
}
export interface CompleteRequestResponse {
  success: boolean;
  data: Request;
}

// GET REQUESTS
export const getRequests = async (
  siteId?: string,
): Promise<GetRequestsResponse> => {
  const url = siteId
    ? `${ENDPOINTS.requests}?siteId=${siteId}`
    : `${ENDPOINTS.requests}`;

  const { data } = await apiClient.get<GetRequestsResponse>(url);
  return data;
};

// CREATE REQUEST (optional file → multipart/form-data)
export const createRequest = async (
  payload: CreateRequestPayload,
  file?: File,
): Promise<CreateRequestResponse> => {
  const formData = new FormData();

  if (payload.siteId) {
    formData.append("siteId", payload.siteId);
  }

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("priority", payload.priority);

  if (file) {
    formData.append("file", file);
  }

  const { data } = await apiClient.post<CreateRequestResponse>(
    ENDPOINTS.requests,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

// ASSIGN DEVELOPER
export const assignRequest = async (
  requestId: string,
  payload: AssignRequestPayload,
): Promise<AssignRequestResponse> => {
  const { data } = await apiClient.patch<AssignRequestResponse>(
    `${ENDPOINTS.requests}/${requestId}/assign`,
    payload,
  );

  return data;
};

export const completeRequest = async (
  requestId: string,
): Promise<CompleteRequestResponse> => {
  const { data } = await apiClient.patch<CompleteRequestResponse>(
    `${ENDPOINTS.requests}/${requestId}/complete`,
  );
  return data;
};


export const uploadRequestAttachment = async (requestId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const { data } = await apiClient.post(
    `${ENDPOINTS.requests}/${requestId}/attachments`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};