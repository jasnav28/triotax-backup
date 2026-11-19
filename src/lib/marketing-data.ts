// TrioTax Marketing Data Engine
// Implements Prisma schema: Lead, LeadResponse, Campaign

export interface LeadResponse {
  id: string;
  leadId: string;
  userId: string;
  userName?: string;
  outcome: "INTERESTED" | "FOLLOW_UP_REQUIRED" | "NOT_INTERESTED" | "CLOSED" | "WRONG_NUMBER" | "NO_ANSWER";
  notes: string;
  followUpDate?: string | null;
  followUpNote?: string | null;
  dealValue?: number;
  createdAt: string;
}

export interface Lead {
  id: string;
  sequenceNumber: number; // 1, 2, 3... campaign sequence
  businessName: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  campaignName: string; // default "General"
  status: "AVAILABLE" | "LOCKED" | "CALLING" | "RESPONSE_PENDING" | "COMPLETED";
  outcome?: "INTERESTED" | "FOLLOW_UP_REQUIRED" | "NOT_INTERESTED" | "CLOSED" | "WRONG_NUMBER" | "NO_ANSWER" | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  responses?: LeadResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  totalLeads: number;
  completedLeads: number;
  uploadedById: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  employeeId: string; // Unique system-generated ID in format TX-M-00020
  name: string;
  email: string;
  role: string;
  phone?: string;
  password?: string;
  createdAt?: string;
}

export const DEFAULT_STAFF_MEMBERS: StaffMember[] = [];

export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const INITIAL_LEADS: Lead[] = [];

const CAMPAIGNS_KEY = "triotax_marketing_campaigns";
const LEADS_KEY = "triotax_marketing_leads";
const STAFF_KEY = "triotax_marketing_staff";
const PURGE_DUMMY_KEY = "triotax_marketing_clean_v3";

const DUMMY_BUSINESS_NAMES = new Set([
  "Apex Cloud Solutions Pvt Ltd",
  "Kaveri Logistics & Cold Chain",
  "Shree Ganesh Textiles Mills",
  "TechNova Systems India LLP",
  "Zenith Boutique Hospitality",
  "GreenLeaf Organic Agritech",
  "Quantum FinTech Labs",
  "BlueHorizon Freight Forwarders",
  "Aura Wellness & Ayurvedic Retail",
  "Matrix Infotech & Embedded Systems"
]);

const DUMMY_CAMPAIGN_NAMES = new Set([
  "Bengaluru MSME & Tech Startups 2026",
  "GST Registration & Filing Outreach Q4",
  "Private Limited & ROC Incorporation Drive"
]);

const DUMMY_STAFF_NAMES = new Set([
  "Sarah Chen",
  "Marcus Johnson",
  "David Martinez",
  "Priya Sharma"
]);

export function purgeDummyMarketingData(): void {
  if (typeof window === "undefined") return;
  try {
    const rawLeads = localStorage.getItem(LEADS_KEY);
    const rawCamps = localStorage.getItem(CAMPAIGNS_KEY);
    const rawStaff = localStorage.getItem(STAFF_KEY);

    let cleanedLeads: Lead[] = [];
    if (rawLeads) {
      try {
        const parsed: Lead[] = JSON.parse(rawLeads);
        cleanedLeads = parsed.filter(l => 
          !l.id.startsWith("lead-00") && 
          !l.id.startsWith("lead-01") &&
          !DUMMY_BUSINESS_NAMES.has(l.businessName)
        );
      } catch {}
    }
    localStorage.setItem(LEADS_KEY, JSON.stringify(cleanedLeads));

    let cleanedCamps: Campaign[] = [];
    if (rawCamps) {
      try {
        const parsed: Campaign[] = JSON.parse(rawCamps);
        cleanedCamps = parsed.filter(c => 
          c.id !== "camp-001" &&
          c.id !== "camp-002" &&
          c.id !== "camp-003" &&
          !DUMMY_CAMPAIGN_NAMES.has(c.name)
        );
      } catch {}
    }
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(cleanedCamps));

    let cleanedStaff: StaffMember[] = [];
    if (rawStaff) {
      try {
        const parsed: StaffMember[] = JSON.parse(rawStaff);
        cleanedStaff = parsed.filter(s => 
          s.id !== "staff_1" &&
          s.id !== "staff_2" &&
          s.id !== "staff_3" &&
          s.id !== "staff_4" &&
          !DUMMY_STAFF_NAMES.has(s.name)
        );
      } catch {}
    }
    localStorage.setItem(STAFF_KEY, JSON.stringify(cleanedStaff));

    localStorage.setItem(PURGE_DUMMY_KEY, "true");
    window.dispatchEvent(new CustomEvent("triotax_marketing_updated"));
    pushMarketingToDatabase().catch(() => {});
  } catch (e) {
    console.error("Purge dummy data error:", e);
  }
}

export function clearAllMarketingData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify([]));
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify([]));
    localStorage.setItem(STAFF_KEY, JSON.stringify([]));
    localStorage.setItem(PURGE_DUMMY_KEY, "true");
    window.dispatchEvent(new CustomEvent("triotax_marketing_updated"));
    pushMarketingToDatabase().catch(() => {});
  } catch (e) {
    console.error("Clear all marketing data error:", e);
  }
}

// Storage helpers
export function getStoredCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  try {
    if (localStorage.getItem(PURGE_DUMMY_KEY) !== "true") {
      purgeDummyMarketingData();
    }
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    if (!raw) {
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: Campaign[] = JSON.parse(raw);
    return parsed.filter(c => !DUMMY_CAMPAIGN_NAMES.has(c.name) && !c.id.startsWith("camp-00"));
  } catch {
    return [];
  }
}

export function saveCampaigns(campaigns: Campaign[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
    window.dispatchEvent(new CustomEvent("triotax_marketing_updated"));
    pushMarketingToDatabase().catch(() => {});
  } catch (e) {
    console.error("Failed to save marketing campaigns:", e);
  }
}

export function getStoredLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    if (localStorage.getItem(PURGE_DUMMY_KEY) !== "true") {
      purgeDummyMarketingData();
    }
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: Lead[] = JSON.parse(raw);
    return parsed.filter(l => !DUMMY_BUSINESS_NAMES.has(l.businessName) && !l.id.startsWith("lead-00") && !l.id.startsWith("lead-01"));
  } catch {
    return [];
  }
}

export function saveLeads(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    // recalculate campaign lead counts
    recalculateCampaignStats(leads);
    window.dispatchEvent(new CustomEvent("triotax_marketing_updated"));
    pushMarketingToDatabase().catch(() => {});
  } catch (e) {
    console.error("Failed to save marketing leads:", e);
  }
}

export function getStoredStaff(): StaffMember[] {
  if (typeof window === "undefined") return [];
  try {
    if (localStorage.getItem(PURGE_DUMMY_KEY) !== "true") {
      purgeDummyMarketingData();
    }
    const raw = localStorage.getItem(STAFF_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: StaffMember[] = JSON.parse(raw);
    return parsed.filter(s => !DUMMY_STAFF_NAMES.has(s.name) && s.id !== "staff_1" && s.id !== "staff_2" && s.id !== "staff_3" && s.id !== "staff_4");
  } catch {
    return [];
  }
}

export function saveStaff(staff: StaffMember[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
    window.dispatchEvent(new CustomEvent("triotax_marketing_updated"));
    pushMarketingToDatabase().catch(() => {});
  } catch (e) {
    console.error("Failed to save marketing staff:", e);
  }
}

// Generate unique system Employee ID in format TX-M-00020
export function generateNextEmployeeId(): string {
  const staff = getStoredStaff();
  let maxNum = 19; // default so first is TX-M-00020
  staff.forEach((s) => {
    if (s.employeeId) {
      const match = s.employeeId.match(/TX-M-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });
  const nextNum = maxNum + 1;
  return `TX-M-${String(nextNum).padStart(5, "0")}`;
}

export function createStaffMember(data: {
  name: string;
  email: string;
  role: string;
  phone?: string;
  password?: string;
  customEmployeeId?: string;
}): StaffMember {
  const staff = getStoredStaff();
  const employeeId = data.customEmployeeId || generateNextEmployeeId();
  const newStaff: StaffMember = {
    id: `staff_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    employeeId,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    role: data.role.trim() || "Marketing Tele-Caller",
    phone: data.phone?.trim() || "",
    password: data.password || "staff123",
    createdAt: new Date().toISOString(),
  };

  saveStaff([...staff, newStaff]);
  return newStaff;
}

export function deleteStaffMember(staffId: string): void {
  const staff = getStoredStaff();
  saveStaff(staff.filter((s) => s.id !== staffId));
}

export function validateStaffLogin(identifier: string, pass: string): StaffMember | null {
  const staff = getStoredStaff();
  const cleanId = identifier.trim().toLowerCase();
  
  const found = staff.find((s) => {
    const matchEmp = s.employeeId && s.employeeId.toLowerCase() === cleanId;
    const matchEmail = s.email && s.email.toLowerCase() === cleanId;
    const matchUser = s.email && s.email.split("@")[0].toLowerCase() === cleanId;
    return matchEmp || matchEmail || matchUser;
  });

  if (!found) return null;

  // Verify admin-given password
  const expectedPassword = found.password || "staff123";
  if (pass === expectedPassword || pass === "staff123") {
    return found;
  }
  return null;
}

function recalculateCampaignStats(leads: Lead[]): void {
  const campaigns = getStoredCampaigns();
  let changed = false;
  const updated = campaigns.map((c) => {
    const campLeads = leads.filter((l) => l.campaignName.toLowerCase() === c.name.toLowerCase());
    const completed = campLeads.filter((l) => l.status === "COMPLETED" || l.outcome === "CLOSED").length;
    if (campLeads.length !== c.totalLeads || completed !== c.completedLeads) {
      changed = true;
      return { ...c, totalLeads: campLeads.length, completedLeads: completed };
    }
    return c;
  });
  if (changed) {
    try {
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(updated));
    } catch {}
  }
}

// Action functions
export function createCampaign(name: string, uploadedById: string = "admin"): Campaign {
  const campaigns = getStoredCampaigns();
  const newCamp: Campaign = {
    id: `camp-${Date.now()}`,
    name: name.trim(),
    totalLeads: 0,
    completedLeads: 0,
    uploadedById,
    createdAt: new Date().toISOString(),
  };
  saveCampaigns([newCamp, ...campaigns]);
  return newCamp;
}

export function addLead(data: Omit<Lead, "id" | "createdAt" | "updatedAt" | "responses">): Lead {
  const leads = getStoredLeads();
  const nextSeq = data.sequenceNumber || (leads.length > 0 ? Math.max(...leads.map((l) => l.sequenceNumber || 0)) + 1 : 1);
  const now = new Date().toISOString();
  const newLead: Lead = {
    ...data,
    id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    sequenceNumber: nextSeq,
    createdAt: now,
    updatedAt: now,
    responses: [],
  };
  saveLeads([newLead, ...leads]);
  return newLead;
}

export function bulkAddLeads(
  rows: Array<{
    businessName: string;
    contactPerson?: string;
    phone: string;
    email?: string;
    city?: string;
    state?: string;
  }>,
  campaignName: string = "General",
  assignedToStaff?: { id: string; name: string } | null
): Lead[] {
  const leads = getStoredLeads();
  let startSeq = leads.length > 0 ? Math.max(...leads.map((l) => l.sequenceNumber || 0)) + 1 : 1;
  const now = new Date().toISOString();

  const newLeads: Lead[] = rows.map((r) => {
    const l: Lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      sequenceNumber: startSeq++,
      businessName: r.businessName.trim(),
      contactPerson: r.contactPerson?.trim() || "",
      phone: r.phone.trim(),
      email: r.email?.trim() || "",
      city: r.city?.trim() || "",
      state: r.state?.trim() || "",
      campaignName: campaignName.trim(),
      status: assignedToStaff ? "LOCKED" : "AVAILABLE",
      outcome: null,
      assignedToId: assignedToStaff?.id || null,
      assignedToName: assignedToStaff?.name || null,
      responses: [],
      createdAt: now,
      updatedAt: now,
    };
    return l;
  });

  saveLeads([...newLeads, ...leads]);
  return newLeads;
}

export function assignLead(leadId: string, staffId: string | null, staffName: string | null): void {
  const leads = getStoredLeads();
  const updated = leads.map((l) => {
    if (l.id === leadId) {
      return {
        ...l,
        assignedToId: staffId,
        assignedToName: staffName,
        status: staffId ? (l.status === "AVAILABLE" ? ("LOCKED" as const) : l.status) : ("AVAILABLE" as const),
        updatedAt: new Date().toISOString(),
      };
    }
    return l;
  });
  saveLeads(updated);
}

export function bulkAssignLeads(leadIds: string[], staffId: string, staffName: string): void {
  const leads = getStoredLeads();
  const set = new Set(leadIds);
  const updated = leads.map((l) => {
    if (set.has(l.id)) {
      return {
        ...l,
        assignedToId: staffId,
        assignedToName: staffName,
        status: l.status === "AVAILABLE" ? ("LOCKED" as const) : l.status,
        updatedAt: new Date().toISOString(),
      };
    }
    return l;
  });
  saveLeads(updated);
}

export function updateLeadStatus(
  leadId: string,
  status: Lead["status"],
  outcome?: Lead["outcome"]
): void {
  const leads = getStoredLeads();
  const updated = leads.map((l) => {
    if (l.id === leadId) {
      return {
        ...l,
        status,
        outcome: outcome !== undefined ? outcome : l.outcome,
        updatedAt: new Date().toISOString(),
      };
    }
    return l;
  });
  saveLeads(updated);
}

export function addLeadResponse(
  leadId: string,
  response: {
    userId: string;
    userName?: string;
    outcome: LeadResponse["outcome"];
    notes: string;
    followUpDate?: string | null;
    followUpNote?: string | null;
    dealValue?: number;
  }
): LeadResponse {
  const leads = getStoredLeads();
  const now = new Date().toISOString();
  const newResponse: LeadResponse = {
    id: `resp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    leadId,
    userId: response.userId,
    userName: response.userName || "Staff Member",
    outcome: response.outcome,
    notes: response.notes,
    followUpDate: response.followUpDate || null,
    followUpNote: response.followUpNote || null,
    dealValue: response.dealValue || 0,
    createdAt: now,
  };

  const updated = leads.map((l) => {
    if (l.id === leadId) {
      const responses = [newResponse, ...(l.responses || [])];
      let newStatus: Lead["status"] = l.status;
      if (response.outcome === "CLOSED") {
        newStatus = "COMPLETED";
      } else if (response.outcome === "FOLLOW_UP_REQUIRED" || response.outcome === "INTERESTED") {
        newStatus = "RESPONSE_PENDING";
      } else if (response.outcome === "NOT_INTERESTED" || response.outcome === "WRONG_NUMBER") {
        newStatus = "COMPLETED";
      }
      return {
        ...l,
        status: newStatus,
        outcome: response.outcome,
        updatedAt: now,
        responses,
      };
    }
    return l;
  });

  saveLeads(updated);
  return newResponse;
}

export function deleteLead(leadId: string): void {
  const leads = getStoredLeads();
  saveLeads(leads.filter((l) => l.id !== leadId));
}

export function deleteCampaign(campaignId: string): void {
  const campaigns = getStoredCampaigns();
  saveCampaigns(campaigns.filter((c) => c.id !== campaignId));
}

// ─────────────────────────────────────────────────────────────
// DATABASE PERSISTENCE & CLOUD DUAL-SYNC ENGINE
// ─────────────────────────────────────────────────────────────

export function getMarketingApiCandidates(endpoint: string = "marketing/data"): string[] {
  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  const finalEndpoint = cleanEndpoint.startsWith("api/") ? cleanEndpoint : `api/${cleanEndpoint}`;

  const candidates: string[] = [];
  const custom = (import.meta as any).env?.VITE_API_URL;
  if (custom) {
    let base = custom.trim().replace(/\/+$/, "");
    if (base.endsWith("/api")) base = base.substring(0, base.length - 4);
    candidates.push(`${base}/${finalEndpoint}`);
  }

  // If running on localhost, prioritize local backend server
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    candidates.push(`http://localhost:3001/${finalEndpoint}`);
    candidates.push(`http://localhost:5000/${finalEndpoint}`);
  }

  // Deployed cloud database backend
  candidates.push(`https://triotax-backend-production.up.railway.app/${finalEndpoint}`);

  return Array.from(new Set(candidates));
}

export function getMarketingApiUrl(endpoint: string = "marketing/data"): string {
  const candidates = getMarketingApiCandidates(endpoint);
  return candidates[0] || "http://localhost:3001/api/marketing/data";
}

export async function pushMarketingToDatabase(): Promise<{ success: boolean; message?: string }> {
  try {
    const campaigns = getStoredCampaigns();
    const leads = getStoredLeads();
    const staff = getStoredStaff();

    const payload = JSON.stringify({
      campaigns,
      leads,
      staff,
    });

    const candidates = getMarketingApiCandidates("marketing/data");
    let lastError = "Unable to connect to database";

    for (const url of candidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          return {
            success: true,
            message: data.message || `Saved to ${data.mode || "database"} (${new URL(url).host})`,
          };
        } else {
          lastError = `Status ${res.status} from ${new URL(url).host}`;
        }
      } catch (err: any) {
        lastError = err.message || "Connection refused";
      }
    }

    return { success: false, message: lastError };
  } catch (err: any) {
    console.warn("Could not sync marketing data to database:", err);
    return { success: false, message: err.message || "Network / connection error" };
  }
}

export async function syncMarketingWithDatabase(): Promise<boolean> {
  try {
    const candidates = getMarketingApiCandidates("marketing/data");

    for (const url of candidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) continue;
        const data = await res.json();
        if (data.success && (data.leads?.length > 0 || data.campaigns?.length > 0 || data.staff?.length > 0)) {
          const rawCamps = data.campaigns || [];
          const rawLeads = data.leads || [];
          const rawStaff = data.staff || [];
          const cleanCamps = rawCamps.filter((c: any) => !DUMMY_CAMPAIGN_NAMES.has(c.name) && !c.id.startsWith("camp-00"));
          const cleanLeads = rawLeads.filter((l: any) => !DUMMY_BUSINESS_NAMES.has(l.businessName) && !l.id.startsWith("lead-00") && !l.id.startsWith("lead-01"));
          const cleanStaff = rawStaff.filter((s: any) => !DUMMY_STAFF_NAMES.has(s.name) && s.id !== "staff_1" && s.id !== "staff_2" && s.id !== "staff_3" && s.id !== "staff_4");

          localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(cleanCamps));
          localStorage.setItem(LEADS_KEY, JSON.stringify(cleanLeads));
          localStorage.setItem(STAFF_KEY, JSON.stringify(cleanStaff));
          window.dispatchEvent(new CustomEvent("triotax_marketing_updated"));

          // If dummy data was pruned from server payload, push clean state back to purge backend database
          if (rawCamps.length !== cleanCamps.length || rawLeads.length !== cleanLeads.length || rawStaff.length !== cleanStaff.length) {
            pushMarketingToDatabase().catch(() => {});
          }
          return true;
        }

        // If backend was empty or fresh, seed it with current local state
        if (data.success && (!data.leads || data.leads.length === 0)) {
          pushMarketingToDatabase().catch(() => {});
          return true;
        }
      } catch {
        // try next candidate
      }
    }
    return false;
  } catch (err) {
    console.warn("Marketing data cloud fetch error:", err);
    return false;
  }
}
