import apiClient from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";


export type InvoiceType = "plan" | "addon";
export type InvoiceStatus = "active" | "cancelled" | "expired";
export type BillingCycle = "monthly" | "annually";

export interface BilledTo {
  title: string;
  firstname: string;
  surname: string;
  email: string;
  company: { name: string; number: string };
  address: { line1: string; city: string; county: string; postcode: string };
}

export interface Invoice {
  id: string;
  type: InvoiceType;
  name: string;
  /** Only present when type === "plan" */
  planId?: string;
  /** Only present when type === "addon" */
  addonId?: string;
  stripeSubscriptionId: string;
  billingCycle: BillingCycle;
  expiresAt: string; // ISO date string
  cancelAtPeriodEnd: boolean;
  billedTo: BilledTo;
}

export interface GetMyInvoicesResponse {
  invoices: Invoice[];
}


// GET /invoice/me  → returns the authenticated user's invoices
export const getMyInvoices = async (): Promise<GetMyInvoicesResponse> => {
  const { data } = await apiClient.get<GetMyInvoicesResponse>( `${ENDPOINTS.invoices}`,);
  return data;
};