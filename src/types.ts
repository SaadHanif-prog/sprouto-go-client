export interface Site {
  id: string;
  name: string;
  url: string;
  plan: string;
  liveUrl?: string;
  gaMeasurementId?: string;
  clientId?: string;
}

export type RequestStatus = 'pending' | 'in-progress' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

export interface ChatMessage {
  id: string;
  sender: 'client' | 'developer';
  text: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'document';
  url?: string;
}

export type Role = 'client' | 'admin' | 'superadmin';

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  webhookUrl?: string;
  secretKey?: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  currency: string;
  desc: string;
  icon: string;
  webhookUrl?: string;
  secretKey?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  password?: string;
  plan: string;
  status: string;
  joined: string;
  companyDetails?: {
    name: string;
    number: string;
    addressLine1: string;
    addressLine2?: string;
    county?: string;
    city: string;
    postcode: string;
  };
}

export const mockPlans: Plan[] = [
  { id: 'starter', name: 'Starter', price: 159, currency: 'GBP', features: ['1 Site', 'Basic Support']},
  { id: 'pro', name: 'Pro', price: 249, currency: 'GBP', features: ['3 Sites', 'Priority Support']}
];

export const mockAddons: Addon[] = [
  { id: 'a1', name: 'SEO Audit', price: 150, currency: 'GBP', desc: 'Comprehensive SEO analysis', icon: 'Search', webhookUrl: '', secretKey: '' }
];

export const mockClients: Client[] = [
  { id: 'c1', name: 'Sprouto Main', email: 'hello@sprouto.com', plan: 'Pro', status: 'Active', joined: '2026-01-15' },
  { id: 'c2', name: 'Sprouto Blog', email: 'blog@sprouto.com', plan: 'Starter', status: 'Active', joined: '2026-02-20' }
];

export interface SiteRequest {
  id: string;
  siteId: string;
  clientName?: string;
  title: string;
  description: string;
  status: RequestStatus;
  priority: Priority;
  date: string;
  messages: ChatMessage[];
  attachments: Attachment[];
}
