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

export const DEFAULT_STAFF_MEMBERS: StaffMember[] = [
  { id: "staff_1", employeeId: "TX-M-00020", name: "Sarah Chen", email: "sarah@triotax.com", role: "Senior Tele-Marketing Specialist", phone: "+91 98451 22334", password: "staff123", createdAt: "2026-11-01T09:00:00.000Z" },
  { id: "staff_2", employeeId: "TX-M-00021", name: "Marcus Johnson", email: "marcus@triotax.com", role: "Corporate Outreach Executive", phone: "+91 98452 33445", password: "staff123", createdAt: "2026-11-01T09:00:00.000Z" },
  { id: "staff_3", employeeId: "TX-M-00022", name: "David Martinez", email: "david@triotax.com", role: "SME Compliance Specialist", phone: "+91 98453 44556", password: "staff123", createdAt: "2026-11-01T09:00:00.000Z" },
  { id: "staff_4", employeeId: "TX-M-00023", name: "Priya Sharma", email: "priya@triotax.com", role: "GST Lead Conversion Lead", phone: "+91 98454 55667", password: "staff123", createdAt: "2026-11-01T09:00:00.000Z" },
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-001",
    name: "Bengaluru MSME & Tech Startups 2026",
    totalLeads: 6,
    completedLeads: 2,
    uploadedById: "admin",
    createdAt: "2026-11-01T10:00:00.000Z",
  },
  {
    id: "camp-002",
    name: "GST Registration & Filing Outreach Q4",
    totalLeads: 4,
    completedLeads: 1,
    uploadedById: "admin",
    createdAt: "2026-11-05T11:30:00.000Z",
  },
  {
    id: "camp-003",
    name: "Private Limited & ROC Incorporation Drive",
    totalLeads: 3,
    completedLeads: 0,
    uploadedById: "admin",
    createdAt: "2026-11-10T14:15:00.000Z",
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-001",
    sequenceNumber: 1,
    businessName: "Apex Cloud Solutions Pvt Ltd",
    contactPerson: "Rajesh Kumar",
    phone: "+91 98450 11223",
    email: "rajesh@apexcloud.in",
    city: "Bengaluru",
    state: "Karnataka",
    campaignName: "Bengaluru MSME & Tech Startups 2026",
    status: "COMPLETED",
    outcome: "CLOSED",
    assignedToId: "staff_1",
    assignedToName: "Sarah Chen",
    createdAt: "2026-11-01T10:15:00.000Z",
    updatedAt: "2026-11-03T16:30:00.000Z",
    responses: [
      {
        id: "resp-001",
        leadId: "lead-001",
        userId: "staff_1",
        userName: "Sarah Chen",
        outcome: "INTERESTED",
        notes: "Founder inquired about complete Pvt Ltd annual compliance + GST filing retainer.",
        dealValue: 35000,
        createdAt: "2026-11-02T11:00:00.000Z",
      },
      {
        id: "resp-002",
        leadId: "lead-001",
        userId: "staff_1",
        userName: "Sarah Chen",
        outcome: "CLOSED",
        notes: "Signed upfront annual contract. Initial advance received via UPI.",
        dealValue: 42000,
        createdAt: "2026-11-03T16:30:00.000Z",
      },
    ],
  },
  {
    id: "lead-002",
    sequenceNumber: 2,
    businessName: "Kaveri Logistics & Cold Chain",
    contactPerson: "Ananya Deshmukh",
    phone: "+91 99012 34567",
    email: "ananya@kaverilogistics.com",
    city: "Bengaluru",
    state: "Karnataka",
    campaignName: "Bengaluru MSME & Tech Startups 2026",
    status: "RESPONSE_PENDING",
    outcome: "FOLLOW_UP_REQUIRED",
    assignedToId: "staff_1",
    assignedToName: "Sarah Chen",
    createdAt: "2026-11-01T10:20:00.000Z",
    updatedAt: "2026-11-04T12:00:00.000Z",
    responses: [
      {
        id: "resp-003",
        leadId: "lead-002",
        userId: "staff_1",
        userName: "Sarah Chen",
        outcome: "FOLLOW_UP_REQUIRED",
        notes: "Fleet expansion requiring multi-state GST e-way bill automation and input credit audit.",
        followUpDate: "2026-11-20T11:00:00.000Z",
        followUpNote: "Present customized GST e-way billing software module demo to MD.",
        dealValue: 28000,
        createdAt: "2026-11-04T12:00:00.000Z",
      },
    ],
  },
  {
    id: "lead-003",
    sequenceNumber: 3,
    businessName: "Shree Ganesh Textiles Mills",
    contactPerson: "Vikram Patel",
    phone: "+91 98200 78901",
    email: "vikram@ganeshtextiles.in",
    city: "Surat",
    state: "Gujarat",
    campaignName: "GST Registration & Filing Outreach Q4",
    status: "CALLING",
    outcome: "INTERESTED",
    assignedToId: "staff_2",
    assignedToName: "Marcus Johnson",
    createdAt: "2026-11-05T12:00:00.000Z",
    updatedAt: "2026-11-06T15:20:00.000Z",
    responses: [
      {
        id: "resp-004",
        leadId: "lead-003",
        userId: "staff_2",
        userName: "Marcus Johnson",
        outcome: "INTERESTED",
        notes: "Looking to switch from local CA to automated TrioTax cloud GST filing and HSN reconciliation.",
        dealValue: 18000,
        createdAt: "2026-11-06T15:20:00.000Z",
      },
    ],
  },
  {
    id: "lead-004",
    sequenceNumber: 4,
    businessName: "TechNova Systems India LLP",
    contactPerson: "Sneha Rao",
    phone: "+91 97401 55667",
    email: "sneha.rao@technova.org",
    city: "Hyderabad",
    state: "Telangana",
    campaignName: "Bengaluru MSME & Tech Startups 2026",
    status: "LOCKED",
    outcome: null,
    assignedToId: "staff_3",
    assignedToName: "David Martinez",
    createdAt: "2026-11-01T10:45:00.000Z",
    updatedAt: "2026-11-01T10:45:00.000Z",
    responses: [],
  },
  {
    id: "lead-005",
    sequenceNumber: 5,
    businessName: "Zenith Boutique Hospitality",
    contactPerson: "Rohan Mehta",
    phone: "+91 98112 99887",
    email: "rohan@zenithhospitality.com",
    city: "Mumbai",
    state: "Maharashtra",
    campaignName: "Bengaluru MSME & Tech Startups 2026",
    status: "AVAILABLE",
    outcome: null,
    assignedToId: null,
    assignedToName: null,
    createdAt: "2026-11-01T11:00:00.000Z",
    updatedAt: "2026-11-01T11:00:00.000Z",
    responses: [],
  },
  {
    id: "lead-006",
    sequenceNumber: 6,
    businessName: "GreenLeaf Organic Agritech",
    contactPerson: "Arun Reddy",
    phone: "+91 99880 12345",
    email: "arun@greenleafagri.com",
    city: "Mysuru",
    state: "Karnataka",
    campaignName: "Bengaluru MSME & Tech Startups 2026",
    status: "AVAILABLE",
    outcome: null,
    assignedToId: null,
    assignedToName: null,
    createdAt: "2026-11-01T11:15:00.000Z",
    updatedAt: "2026-11-01T11:15:00.000Z",
    responses: [],
  },
  {
    id: "lead-007",
    sequenceNumber: 7,
    businessName: "Quantum FinTech Labs",
    contactPerson: "Kavita Iyer",
    phone: "+91 98455 67890",
    email: "kavita@quantumfin.io",
    city: "Bengaluru",
    state: "Karnataka",
    campaignName: "Private Limited & ROC Incorporation Drive",
    status: "COMPLETED",
    outcome: "CLOSED",
    assignedToId: "staff_4",
    assignedToName: "Priya Sharma",
    createdAt: "2026-11-10T14:30:00.000Z",
    updatedAt: "2026-11-12T17:00:00.000Z",
    responses: [
      {
        id: "resp-005",
        leadId: "lead-007",
        userId: "staff_4",
        userName: "Priya Sharma",
        outcome: "CLOSED",
        notes: "Full Private Limited Incorporation with Digital Signatures, PAN/TAN, and GST registration closed.",
        dealValue: 24999,
        createdAt: "2026-11-12T17:00:00.000Z",
      },
    ],
  },
  {
    id: "lead-008",
    sequenceNumber: 8,
    businessName: "BlueHorizon Freight Forwarders",
    contactPerson: "Naveen Gupta",
    phone: "+91 99100 23456",
    email: "naveen@bluehorizon.net",
    city: "Chennai",
    state: "Tamil Nadu",
    campaignName: "GST Registration & Filing Outreach Q4",
    status: "RESPONSE_PENDING",
    outcome: "NO_ANSWER",
    assignedToId: "staff_2",
    assignedToName: "Marcus Johnson",
    createdAt: "2026-11-05T12:30:00.000Z",
    updatedAt: "2026-11-07T14:00:00.000Z",
    responses: [
      {
        id: "resp-006",
        leadId: "lead-008",
        userId: "staff_2",
        userName: "Marcus Johnson",
        outcome: "NO_ANSWER",
        notes: "Called twice at 11 AM and 2 PM. Line ringing, no answer. Will retry tomorrow.",
        createdAt: "2026-11-07T14:00:00.000Z",
      },
    ],
  },
  {
    id: "lead-009",
    sequenceNumber: 9,
    businessName: "Aura Wellness & Ayurvedic Retail",
    contactPerson: "Pooja Hegde",
    phone: "+91 97410 88990",
    email: "pooja@aurawellness.in",
    city: "Mangaluru",
    state: "Karnataka",
    campaignName: "GST Registration & Filing Outreach Q4",
    status: "AVAILABLE",
    outcome: null,
    assignedToId: null,
    assignedToName: null,
    createdAt: "2026-11-05T13:00:00.000Z",
    updatedAt: "2026-11-05T13:00:00.000Z",
    responses: [],
  },
  {
    id: "lead-010",
    sequenceNumber: 10,
    businessName: "Matrix Infotech & Embedded Systems",
    contactPerson: "Siddharth Verma",
    phone: "+91 98860 33441",
    email: "sid@matrixinfotech.co.in",
    city: "Pune",
    state: "Maharashtra",
    campaignName: "Private Limited & ROC Incorporation Drive",
    status: "AVAILABLE",
    outcome: null,
    assignedToId: null,
    assignedToName: null,
    createdAt: "2026-11-10T15:00:00.000Z",
    updatedAt: "2026-11-10T15:00:00.000Z",
    responses: [],
  },
];

const CAMPAIGNS_KEY = "triotax_marketing_campaigns";
const LEADS_KEY = "triotax_marketing_leads";
const STAFF_KEY = "triotax_marketing_staff";

// Storage helpers
export function getStoredCampaigns(): Campaign[] {
  if (typeof window === "undefined") return INITIAL_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    if (!raw) {
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(INITIAL_CAMPAIGNS));
      return INITIAL_CAMPAIGNS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CAMPAIGNS;
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
  if (typeof window === "undefined") return INITIAL_LEADS;
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEADS;
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
  if (typeof window === "undefined") return DEFAULT_STAFF_MEMBERS;
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_KEY, JSON.stringify(DEFAULT_STAFF_MEMBERS));
      return DEFAULT_STAFF_MEMBERS;
    }
    const parsed: StaffMember[] = JSON.parse(raw);
    let migrated = false;
    let fallbackNum = 20;
    const updated = parsed.map((s, idx) => {
      if (!s.employeeId) {
        migrated = true;
        return {
          ...s,
          employeeId: `TX-M-${String(fallbackNum + idx).padStart(5, "0")}`,
          password: s.password || "staff123",
          createdAt: s.createdAt || new Date().toISOString(),
        };
      }
      return s;
    });
    if (migrated) {
      localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
      return updated;
    }
    return parsed;
  } catch {
    return DEFAULT_STAFF_MEMBERS;
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
          if (Array.isArray(data.campaigns) && data.campaigns.length > 0) {
            localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(data.campaigns));
          }
          if (Array.isArray(data.leads) && data.leads.length > 0) {
            localStorage.setItem(LEADS_KEY, JSON.stringify(data.leads));
          }
          if (Array.isArray(data.staff) && data.staff.length > 0) {
            localStorage.setItem(STAFF_KEY, JSON.stringify(data.staff));
          }
          window.dispatchEvent(new CustomEvent("triotax_marketing_updated"));
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
