import React, { useState, useEffect, useMemo } from "react";
import {
  Target,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Upload,
  UserCheck,
  ChevronDown,
  Trash2,
  ExternalLink,
  MessageSquare,
  IndianRupee,
  PhoneCall,
  Flame,
  ArrowRight,
  TrendingUp,
  X,
  RefreshCw,
  FolderPlus,
} from "lucide-react";
import {
  Lead,
  LeadResponse,
  Campaign,
  StaffMember,
  getStoredCampaigns,
  saveCampaigns,
  getStoredLeads,
  saveLeads,
  getStoredStaff,
  createCampaign,
  addLead,
  bulkAddLeads,
  assignLead,
  bulkAssignLeads,
  updateLeadStatus,
  addLeadResponse,
  deleteLead,
  deleteCampaign,
} from "@/lib/marketing-data";

export const AdminMarketingData: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  // Sub tab: "leads" | "campaigns" | "performance"
  const [currentSubTab, setCurrentSubTab] = useState<"leads" | "campaigns" | "performance">("leads");

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [selectedOutcomeFilter, setSelectedOutcomeFilter] = useState("all");
  const [selectedStaffFilter, setSelectedStaffFilter] = useState("all");

  // Selection for bulk actions
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bulkAssignStaffId, setBulkAssignStaffId] = useState("");

  // Modals
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [activeLeadForResponses, setActiveLeadForResponses] = useState<Lead | null>(null);

  // New Lead Form State
  const [newSeq, setNewSeq] = useState<number>(0);
  const [newBizName, setNewBizName] = useState("");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newCampaignName, setNewCampaignName] = useState("General");
  const [newStatus, setNewStatus] = useState<Lead["status"]>("AVAILABLE");
  const [newAssignedStaffId, setNewAssignedStaffId] = useState("");

  // New Campaign Form State
  const [newCampName, setNewCampName] = useState("");

  // Bulk Upload Form State
  const [bulkRawData, setBulkRawData] = useState("");
  const [bulkTargetCampaign, setBulkTargetCampaign] = useState("");
  const [bulkAssignToStaffId, setBulkAssignToStaffId] = useState("");
  const [bulkParsePreview, setBulkParsePreview] = useState<Array<{
    businessName: string;
    contactPerson: string;
    phone: string;
    email: string;
    city: string;
    state: string;
  }>>([]);

  // New Response Form (inside Responses Modal)
  const [respOutcome, setRespOutcome] = useState<LeadResponse["outcome"]>("INTERESTED");
  const [respNotes, setRespNotes] = useState("");
  const [respFollowUpDate, setRespFollowUpDate] = useState("");
  const [respFollowUpNote, setRespFollowUpNote] = useState("");
  const [respDealValue, setRespDealValue] = useState<string>("");

  // Load data & subscribe to updates
  const refreshData = () => {
    setCampaigns(getStoredCampaigns());
    setLeads(getStoredLeads());
    setStaffList(getStoredStaff());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener("triotax_marketing_updated", handleUpdate);
    return () => window.removeEventListener("triotax_marketing_updated", handleUpdate);
  }, []);

  // Set default sequence when opening add modal
  useEffect(() => {
    if (showAddLeadModal) {
      const maxSeq = leads.length > 0 ? Math.max(...leads.map((l) => l.sequenceNumber || 0)) : 0;
      setNewSeq(maxSeq + 1);
      if (campaigns.length > 0 && newCampaignName === "General") {
        setNewCampaignName(campaigns[0].name);
      }
    }
  }, [showAddLeadModal, leads, campaigns]);

  // Bulk parser helper
  useEffect(() => {
    if (!bulkRawData.trim()) {
      setBulkParsePreview([]);
      return;
    }
    const lines = bulkRawData.trim().split(/\r?\n/);
    const parsed: Array<{
      businessName: string;
      contactPerson: string;
      phone: string;
      email: string;
      city: string;
      state: string;
    }> = [];

    lines.forEach((line) => {
      if (!line.trim()) return;
      // Support comma or tab separated
      const delimiter = line.includes("\t") ? "\t" : ",";
      const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ""));
      if (parts.length > 0 && parts[0].toLowerCase() !== "business name" && parts[0].toLowerCase() !== "company") {
        parsed.push({
          businessName: parts[0] || "",
          contactPerson: parts[1] || "",
          phone: parts[2] || "",
          email: parts[3] || "",
          city: parts[4] || "",
          state: parts[5] || "",
        });
      }
    });
    setBulkParsePreview(parsed);
  }, [bulkRawData]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.businessName.toLowerCase().includes(q) ||
        (lead.contactPerson && lead.contactPerson.toLowerCase().includes(q)) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.city && lead.city.toLowerCase().includes(q)) ||
        (lead.state && lead.state.toLowerCase().includes(q)) ||
        lead.sequenceNumber.toString().includes(q);

      const matchesCampaign =
        selectedCampaignFilter === "all" ||
        lead.campaignName.toLowerCase() === selectedCampaignFilter.toLowerCase();

      const matchesStatus =
        selectedStatusFilter === "all" || lead.status === selectedStatusFilter;

      const matchesOutcome =
        selectedOutcomeFilter === "all" || lead.outcome === selectedOutcomeFilter;

      const matchesStaff =
        selectedStaffFilter === "all" ||
        (selectedStaffFilter === "unassigned"
          ? !lead.assignedToId
          : lead.assignedToId === selectedStaffFilter);

      return matchesSearch && matchesCampaign && matchesStatus && matchesOutcome && matchesStaff;
    });
  }, [leads, searchQuery, selectedCampaignFilter, selectedStatusFilter, selectedOutcomeFilter, selectedStaffFilter]);

  // Overall Metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const available = leads.filter((l) => l.status === "AVAILABLE").length;
    const callingOrLocked = leads.filter((l) => l.status === "CALLING" || l.status === "LOCKED").length;
    const responsePending = leads.filter((l) => l.status === "RESPONSE_PENDING").length;
    const completed = leads.filter((l) => l.status === "COMPLETED" || l.outcome === "CLOSED").length;
    const interested = leads.filter((l) => l.outcome === "INTERESTED").length;
    const closed = leads.filter((l) => l.outcome === "CLOSED").length;

    // Total deal value from all responses
    let totalPipelineValue = 0;
    leads.forEach((l) => {
      l.responses?.forEach((r) => {
        if (r.dealValue) totalPipelineValue += r.dealValue;
      });
    });

    return {
      total,
      available,
      callingOrLocked,
      responsePending,
      completed,
      interested,
      closed,
      totalPipelineValue,
    };
  }, [leads]);

  // Handle single lead submission
  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim() || !newPhone.trim()) {
      alert("Business Name and Phone number are required.");
      return;
    }

    const assignedStaff = staffList.find((s) => s.id === newAssignedStaffId);

    addLead({
      sequenceNumber: newSeq,
      businessName: newBizName,
      contactPerson: newContactPerson || undefined,
      phone: newPhone,
      email: newEmail || undefined,
      city: newCity || undefined,
      state: newState || undefined,
      campaignName: newCampaignName || "General",
      status: assignedStaff ? "LOCKED" : newStatus,
      outcome: null,
      assignedToId: assignedStaff?.id || null,
      assignedToName: assignedStaff?.name || null,
    });

    // Reset form
    setNewBizName("");
    setNewContactPerson("");
    setNewPhone("");
    setNewEmail("");
    setNewCity("");
    setNewState("");
    setNewAssignedStaffId("");
    setShowAddLeadModal(false);
  };

  // Handle bulk upload submission
  const handleBulkUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkParsePreview.length === 0) {
      alert("Please paste valid CSV or tabular data with at least one record.");
      return;
    }

    const targetCamp = bulkTargetCampaign.trim() || campaigns[0]?.name || "General";
    const assignedStaff = staffList.find((s) => s.id === bulkAssignToStaffId) || null;

    bulkAddLeads(bulkParsePreview, targetCamp, assignedStaff);
    setBulkRawData("");
    setBulkParsePreview([]);
    setShowBulkUploadModal(false);
  };

  // Handle create campaign
  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) {
      alert("Campaign Name is required.");
      return;
    }
    createCampaign(newCampName, "admin");
    setNewCampName("");
    setShowNewCampaignModal(false);
  };

  // Bulk assignment
  const handleExecuteBulkAssign = () => {
    if (selectedLeadIds.length === 0) {
      alert("Please select at least one lead from the table.");
      return;
    }
    if (!bulkAssignStaffId) {
      alert("Please choose a staff member to assign the leads to.");
      return;
    }
    const staff = staffList.find((s) => s.id === bulkAssignStaffId);
    if (!staff) return;

    bulkAssignLeads(selectedLeadIds, staff.id, staff.name);
    setSelectedLeadIds([]);
    setBulkAssignStaffId("");
  };

  // Add response to active lead
  const handleAddResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeadForResponses) return;
    if (!respNotes.trim()) {
      alert("Please write notes about this conversation or call.");
      return;
    }

    const val = parseFloat(respDealValue) || 0;

    addLeadResponse(activeLeadForResponses.id, {
      userId: "admin",
      userName: "Admin User",
      outcome: respOutcome,
      notes: respNotes.trim(),
      followUpDate: respOutcome === "FOLLOW_UP_REQUIRED" || respOutcome === "INTERESTED" ? respFollowUpDate : undefined,
      followUpNote: respFollowUpNote.trim() || undefined,
      dealValue: val > 0 ? val : undefined,
    });

    // Refresh active lead in modal
    const updated = getStoredLeads().find((l) => l.id === activeLeadForResponses.id);
    if (updated) setActiveLeadForResponses(updated);

    // Reset response inputs
    setRespNotes("");
    setRespFollowUpDate("");
    setRespFollowUpNote("");
    setRespDealValue("");
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Banner / Title Bar */}
      <div className="bg-gradient-to-r from-[#003153] to-[#014d7a] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-200 border border-white/15 mb-2">
            <Target size={14} className="text-sky-300" />
            <span>TrioTax Marketing CRM & Tele-Calling Console</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Marketing Data & Lead Management</h2>
          <p className="text-sm text-sky-100/80 mt-1 max-w-2xl">
            Upload contact data, organize structured campaigns, allocate sequence-based leads to marketing staff, and track call outcomes in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAddLeadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Single Lead</span>
          </button>
          <button
            onClick={() => setShowBulkUploadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet size={16} />
            <span>Bulk CSV / Paste</span>
          </button>
          <button
            onClick={() => setShowNewCampaignModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            <FolderPlus size={16} />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">Total Leads</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{metrics.total}</span>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">All Campaigns</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">Available (Unassigned)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{metrics.available}</span>
            <span className="text-[11px] font-semibold text-amber-600/80">Ready to pick</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">Calling / In-Progress</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{metrics.callingOrLocked}</span>
            <span className="text-[11px] font-semibold text-indigo-600/80">Active Dials</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">Follow-ups Pending</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-orange-600 dark:text-orange-400">{metrics.responsePending}</span>
            <span className="text-[11px] font-semibold text-orange-600/80">Scheduled</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">Closed Deals</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{metrics.closed}</span>
            <span className="text-[11px] font-semibold text-emerald-600/80">Won</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">Pipeline Deal Value</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center">
              <IndianRupee size={15} />
              {metrics.totalPipelineValue.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Total</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setCurrentSubTab("leads")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentSubTab === "leads"
              ? "bg-[#003153] text-white shadow-xs"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          <PhoneCall size={14} />
          <span>Leads Master Directory ({leads.length})</span>
        </button>

        <button
          onClick={() => setCurrentSubTab("campaigns")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentSubTab === "campaigns"
              ? "bg-[#003153] text-white shadow-xs"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          <FolderPlus size={14} />
          <span>Campaigns ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setCurrentSubTab("performance")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentSubTab === "performance"
              ? "bg-[#003153] text-white shadow-xs"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          <TrendingUp size={14} />
          <span>Staff Tele-Calling Performance</span>
        </button>
      </div>

      {/* SUB TAB 1: LEADS DIRECTORY */}
      {currentSubTab === "leads" && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search input */}
              <div className="md:col-span-4 relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by business, contact, phone, city, seq#..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 text-slate-800 dark:text-white outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              {/* Campaign Filter */}
              <div className="md:col-span-2">
                <select
                  value={selectedCampaignFilter}
                  onChange={(e) => setSelectedCampaignFilter(e.target.value)}
                  className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 text-slate-800 dark:text-white outline-none"
                >
                  <option value="all">All Campaigns ({campaigns.length})</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-2">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 text-slate-800 dark:text-white outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="LOCKED">LOCKED</option>
                  <option value="CALLING">CALLING</option>
                  <option value="RESPONSE_PENDING">RESPONSE PENDING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              {/* Outcome Filter */}
              <div className="md:col-span-2">
                <select
                  value={selectedOutcomeFilter}
                  onChange={(e) => setSelectedOutcomeFilter(e.target.value)}
                  className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 text-slate-800 dark:text-white outline-none"
                >
                  <option value="all">All Outcomes</option>
                  <option value="INTERESTED">INTERESTED</option>
                  <option value="FOLLOW_UP_REQUIRED">FOLLOW UP REQUIRED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="NOT_INTERESTED">NOT INTERESTED</option>
                  <option value="WRONG_NUMBER">WRONG NUMBER</option>
                  <option value="NO_ANSWER">NO ANSWER</option>
                </select>
              </div>

              {/* Assigned Staff Filter */}
              <div className="md:col-span-2">
                <select
                  value={selectedStaffFilter}
                  onChange={(e) => setSelectedStaffFilter(e.target.value)}
                  className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 text-slate-800 dark:text-white outline-none"
                >
                  <option value="all">All Staff</option>
                  <option value="unassigned">Unassigned (Free Leads)</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bulk Selection Actions */}
            {selectedLeadIds.length > 0 && (
              <div className="flex items-center justify-between p-2.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-lg text-xs">
                <span className="font-semibold text-sky-800 dark:text-sky-300">
                  {selectedLeadIds.length} lead(s) selected
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={bulkAssignStaffId}
                    onChange={(e) => setBulkAssignStaffId(e.target.value)}
                    className="py-1 px-2.5 text-xs rounded border border-sky-300 dark:border-sky-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-white outline-none"
                  >
                    <option value="">Assign to Staff Member...</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleExecuteBulkAssign}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded shadow-xs cursor-pointer transition-colors"
                  >
                    Apply Assignment
                  </button>
                  <button
                    onClick={() => setSelectedLeadIds([])}
                    className="px-2 py-1 text-slate-500 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Leads Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 font-bold border-b border-slate-200 dark:border-zinc-800">
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredLeads.length > 0 &&
                          selectedLeadIds.length === filteredLeads.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeadIds(filteredLeads.map((l) => l.id));
                          } else {
                            setSelectedLeadIds([]);
                          }
                        }}
                        className="rounded cursor-pointer"
                      />
                    </th>
                    <th className="p-3 w-14 text-center">Seq #</th>
                    <th className="p-3">Business / Entity</th>
                    <th className="p-3">Contact Person</th>
                    <th className="p-3">Phone & Email</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Campaign</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Outcome</th>
                    <th className="p-3">Assigned Staff</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="p-8 text-center text-slate-400 dark:text-zinc-500">
                        No leads found matching your search or filters. Click "+ Add Single Lead" or "Bulk CSV" to upload records.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const isSelected = selectedLeadIds.includes(lead.id);
                      return (
                        <tr
                          key={lead.id}
                          className={`hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors ${
                            isSelected ? "bg-sky-50/40 dark:bg-sky-950/20" : ""
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLeadIds([...selectedLeadIds, lead.id]);
                                } else {
                                  setSelectedLeadIds(selectedLeadIds.filter((id) => id !== lead.id));
                                }
                              }}
                              className="rounded cursor-pointer"
                            />
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-slate-600 dark:text-zinc-300">
                            #{lead.sequenceNumber}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {lead.businessName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Added {new Date(lead.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-3 text-slate-700 dark:text-zinc-300 font-medium">
                            {lead.contactPerson || "—"}
                          </td>
                          <td className="p-3 text-slate-700 dark:text-zinc-300">
                            <div className="flex items-center gap-1 font-mono font-semibold text-slate-900 dark:text-white">
                              <Phone size={11} className="text-emerald-600" />
                              <a href={`tel:${lead.phone}`} className="hover:underline">
                                {lead.phone}
                              </a>
                            </div>
                            {lead.email && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400 truncate max-w-[180px]">
                                <Mail size={10} className="text-slate-400" />
                                <a href={`mailto:${lead.email}`} className="hover:underline truncate">
                                  {lead.email}
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-zinc-400">
                            <div className="flex items-center gap-1">
                              <MapPin size={11} className="text-slate-400" />
                              <span>
                                {lead.city ? `${lead.city}, ` : ""}
                                {lead.state || "India"}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                              {lead.campaignName}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                lead.status === "AVAILABLE"
                                  ? "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                                  : lead.status === "LOCKED"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                                  : lead.status === "CALLING"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                  : lead.status === "RESPONSE_PENDING"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              }`}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td className="p-3">
                            {lead.outcome ? (
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  lead.outcome === "INTERESTED"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                    : lead.outcome === "CLOSED"
                                    ? "bg-emerald-600 text-white"
                                    : lead.outcome === "FOLLOW_UP_REQUIRED"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                    : lead.outcome === "WRONG_NUMBER"
                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                                    : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                                }`}
                              >
                                {lead.outcome.replace(/_/g, " ")}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <select
                              value={lead.assignedToId || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (!val) {
                                  assignLead(lead.id, null, null);
                                } else {
                                  const staff = staffList.find((s) => s.id === val);
                                  if (staff) assignLead(lead.id, staff.id, staff.name);
                                }
                              }}
                              className="py-1 px-2 text-[11px] rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white outline-none"
                            >
                              <option value="">Unassigned</option>
                              {staffList.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setActiveLeadForResponses(lead)}
                                className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                title="View Call History and Log Response"
                              >
                                <MessageSquare size={12} />
                                <span>Calls ({lead.responses?.length || 0})</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete lead "${lead.businessName}"?`)) {
                                    deleteLead(lead.id);
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: CAMPAIGNS */}
      {currentSubTab === "campaigns" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Marketing Campaigns</h3>
            <button
              onClick={() => setShowNewCampaignModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#003153] hover:bg-[#014d7a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Campaign</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaigns.map((camp) => {
              const campLeads = leads.filter(
                (l) => l.campaignName.toLowerCase() === camp.name.toLowerCase()
              );
              const completed = campLeads.filter(
                (l) => l.status === "COMPLETED" || l.outcome === "CLOSED"
              ).length;
              const percent = campLeads.length > 0 ? Math.round((completed / campLeads.length) * 100) : 0;

              return (
                <div
                  key={camp.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        Campaign
                      </span>
                      {camp.name !== "General" && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete campaign "${camp.name}"?`)) {
                              deleteCampaign(camp.id);
                            }
                          }}
                          className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete Campaign"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{camp.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                      Uploaded by <span className="font-semibold">{camp.uploadedById}</span> on{" "}
                      {new Date(camp.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-zinc-400">Campaign Completion</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {completed} / {campLeads.length} leads ({percent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCampaignFilter(camp.name);
                        setCurrentSubTab("leads");
                      }}
                      className="w-full mt-2 py-2 text-xs font-bold text-[#003153] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      View All Campaign Leads &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB TAB 3: STAFF PERFORMANCE */}
      {currentSubTab === "performance" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Marketing Staff Calling & Conversion Leaderboard
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 font-bold border-b border-slate-200 dark:border-zinc-800">
                    <th className="p-3">Staff Member</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-center">Leads Assigned</th>
                    <th className="p-3 text-center">Responses / Calls Logged</th>
                    <th className="p-3 text-center">Interested Leads</th>
                    <th className="p-3 text-center">Closed Deals</th>
                    <th className="p-3 text-right">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {staffList.map((staff) => {
                    const assigned = leads.filter((l) => l.assignedToId === staff.id);
                    let callsCount = 0;
                    let interestedCount = 0;
                    let closedCount = 0;
                    let revenue = 0;

                    leads.forEach((l) => {
                      l.responses?.forEach((r) => {
                        if (r.userId === staff.id) {
                          callsCount++;
                          if (r.outcome === "INTERESTED") interestedCount++;
                          if (r.outcome === "CLOSED") {
                            closedCount++;
                            if (r.dealValue) revenue += r.dealValue;
                          }
                        }
                      });
                    });

                    return (
                      <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                        <td className="p-3">
                          <div className="font-bold text-slate-900 dark:text-white">{staff.name}</div>
                          <div className="text-[11px] text-slate-400">{staff.email}</div>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-zinc-300">{staff.role}</td>
                        <td className="p-3 text-center font-bold text-slate-800 dark:text-zinc-200">
                          {assigned.length}
                        </td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">
                          {callsCount}
                        </td>
                        <td className="p-3 text-center font-bold text-amber-600 dark:text-amber-400">
                          {interestedCount}
                        </td>
                        <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {closedCount}
                        </td>
                        <td className="p-3 text-right font-black text-slate-900 dark:text-white">
                          ₹{revenue.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD SINGLE LEAD */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Marketing Lead</h3>
                <p className="text-xs text-slate-500">Assigns sequence number automatically for campaign calling</p>
              </div>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Sequence Number #
                  </label>
                  <input
                    type="number"
                    value={newSeq}
                    onChange={(e) => setNewSeq(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Campaign Name
                  </label>
                  <select
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98450 12345"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="info@business.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Bengaluru"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="Karnataka"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Assign to Marketing Staff Member (Optional)
                </label>
                <select
                  value={newAssignedStaffId}
                  onChange={(e) => setNewAssignedStaffId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="">Leave Unassigned (Available to Claim)</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003153] hover:bg-[#014d7a] text-white font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BULK CSV / PASTE LEADS */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Bulk Upload Contact Leads</h3>
                <p className="text-xs text-slate-500">Copy-paste from Excel or CSV with columns: Business Name, Contact, Phone, Email, City, State</p>
              </div>
              <button
                onClick={() => setShowBulkUploadModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBulkUploadSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Target Campaign *
                  </label>
                  <select
                    value={bulkTargetCampaign}
                    onChange={(e) => setBulkTargetCampaign(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Auto-Assign to Staff Member (Optional)
                  </label>
                  <select
                    value={bulkAssignToStaffId}
                    onChange={(e) => setBulkAssignToStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="">Leave Unassigned (Available)</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-zinc-300">
                    Paste CSV or Tab-Separated Data
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setBulkRawData(
                        `Apex Infotech, Vikram Singh, +91 98450 99881, vikram@apex.in, Bengaluru, Karnataka\nSai Ram Exports, Anjali Sharma, +91 99012 88772, anjali@sairam.com, Mumbai, Maharashtra\nDelta Logistics, Rohan Varma, +91 97411 77663, rohan@deltalogistics.in, Hyderabad, Telangana`
                      );
                    }}
                    className="text-sky-600 hover:underline text-[11px]"
                  >
                    Load Sample Data
                  </button>
                </div>
                <textarea
                  rows={6}
                  placeholder={`Business Name, Contact Person, Phone, Email, City, State\nAcme Corp, John Doe, +91 98765 43210, john@acme.com, Bengaluru, Karnataka`}
                  value={bulkRawData}
                  onChange={(e) => setBulkRawData(e.target.value)}
                  className="w-full p-3 font-mono text-[11px] rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              {/* Preview parsed rows */}
              {bulkParsePreview.length > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">
                  <span className="font-bold text-slate-800 dark:text-white block mb-2">
                    Parsed {bulkParsePreview.length} Record(s) for Import:
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-1">
                    {bulkParsePreview.map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-400 py-0.5 border-b border-slate-200/50 dark:border-zinc-700/50">
                        <span className="font-semibold text-slate-800 dark:text-white">{row.businessName}</span>
                        <span>{row.contactPerson}</span>
                        <span className="font-mono text-emerald-600">{row.phone}</span>
                        <span>{row.city}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBulkUploadModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkParsePreview.length === 0}
                  className="px-5 py-2 bg-[#003153] hover:bg-[#014d7a] disabled:opacity-50 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Import {bulkParsePreview.length} Leads
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE CAMPAIGN */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-zinc-800 flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Marketing Campaign</h3>
              <button
                onClick={() => setShowNewCampaignModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q1 GST Return Filing Drive 2027"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003153] hover:bg-[#014d7a] text-white font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CALL RESPONSES & AUDIT HISTORY */}
      {activeLeadForResponses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                    Seq #{activeLeadForResponses.sequenceNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeLeadForResponses.businessName}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Contact: {activeLeadForResponses.contactPerson || "N/A"} &bull; Phone: {activeLeadForResponses.phone} &bull; Campaign: {activeLeadForResponses.campaignName}
                </p>
              </div>
              <button
                onClick={() => setActiveLeadForResponses(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Add New Response Form */}
              <form onSubmit={handleAddResponseSubmit} className="p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <PhoneCall size={14} className="text-sky-600" />
                  Log Tele-Calling Response / Interaction
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Call Outcome *
                    </label>
                    <select
                      value={respOutcome}
                      onChange={(e) => setRespOutcome(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                    >
                      <option value="INTERESTED">INTERESTED</option>
                      <option value="FOLLOW_UP_REQUIRED">FOLLOW UP REQUIRED</option>
                      <option value="CLOSED">CLOSED (Deal Won!)</option>
                      <option value="NOT_INTERESTED">NOT INTERESTED</option>
                      <option value="WRONG_NUMBER">WRONG NUMBER</option>
                      <option value="NO_ANSWER">NO ANSWER / RINGING</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Deal Value (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 25000"
                      value={respDealValue}
                      onChange={(e) => setRespDealValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {(respOutcome === "FOLLOW_UP_REQUIRED" || respOutcome === "INTERESTED") && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Follow-up Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={respFollowUpDate}
                        onChange={(e) => setRespFollowUpDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Follow-up Reminder Note
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Call back with pricing sheet"
                        value={respFollowUpNote}
                        onChange={(e) => setRespFollowUpNote(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Call Discussion Notes *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe discussion, customer requirements, pain points, objection handling, or next steps..."
                    value={respNotes}
                    onChange={(e) => setRespNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    Save Call Log
                  </button>
                </div>
              </form>

              {/* Call History Timeline */}
              <div className="space-y-3">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
                  Interaction Timeline ({activeLeadForResponses.responses?.length || 0})
                </span>

                {!activeLeadForResponses.responses || activeLeadForResponses.responses.length === 0 ? (
                  <p className="text-slate-400 italic py-4 text-center">
                    No calls or responses recorded for this lead yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activeLeadForResponses.responses.map((resp) => (
                      <div
                        key={resp.id}
                        className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-1.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                resp.outcome === "INTERESTED"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                  : resp.outcome === "CLOSED"
                                  ? "bg-emerald-600 text-white"
                                  : resp.outcome === "FOLLOW_UP_REQUIRED"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                  : "bg-slate-100 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300"
                              }`}
                            >
                              {resp.outcome.replace(/_/g, " ")}
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-zinc-200">
                              By {resp.userName || resp.userId}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(resp.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-slate-700 dark:text-zinc-300 text-xs mt-1">{resp.notes}</p>

                        {(resp.followUpDate || resp.followUpNote || resp.dealValue) && (
                          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-zinc-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                            {resp.followUpDate && (
                              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                <Clock size={11} />
                                Follow up: {new Date(resp.followUpDate).toLocaleString()}
                                {resp.followUpNote ? ` (${resp.followUpNote})` : ""}
                              </span>
                            )}
                            {resp.dealValue && resp.dealValue > 0 && (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-auto">
                                Deal Value: ₹{resp.dealValue.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
