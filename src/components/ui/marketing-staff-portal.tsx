import React, { useState, useEffect, useMemo } from "react";
import {
  PhoneCall,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  IndianRupee,
  Search,
  Filter,
  ArrowRight,
  Flame,
  Award,
  RefreshCw,
  Lock,
  Unlock,
  ChevronRight,
  Send,
  Sparkles,
  Check,
} from "lucide-react";
import {
  Lead,
  LeadResponse,
  Campaign,
  StaffMember,
  getStoredCampaigns,
  getStoredLeads,
  getStoredStaff,
  updateLeadStatus,
  addLeadResponse,
  assignLead,
} from "@/lib/marketing-data";

interface MarketingStaffPortalProps {
  username?: string;
}

export const MarketingStaffPortal: React.FC<MarketingStaffPortalProps> = ({ username = "staff" }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  // Current active staff profile
  const [currentStaffId, setCurrentStaffId] = useState<string>("");

  // Queue tab filter: "my-leads" | "follow-ups" | "available" | "all"
  const [queueTab, setQueueTab] = useState<"my-leads" | "follow-ups" | "available" | "all">("my-leads");

  // Search & campaign filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("all");

  // Currently selected lead in calling station
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Response Form State
  const [callOutcome, setCallOutcome] = useState<LeadResponse["outcome"]>("INTERESTED");
  const [callNotes, setCallNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [savedSuccessMsg, setSavedSuccessMsg] = useState("");

  const refreshData = () => {
    const l = getStoredLeads();
    const c = getStoredCampaigns();
    const s = getStoredStaff();
    setLeads(l);
    setCampaigns(c);
    setStaffList(s);

    // If current staff not set, find match by username or pick first staff
    if (!currentStaffId && s.length > 0) {
      const match = s.find(
        (member) =>
          member.email.toLowerCase().includes(username.toLowerCase()) ||
          member.name.toLowerCase().includes(username.toLowerCase())
      );
      setCurrentStaffId(match ? match.id : s[0].id);
    }
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener("triotax_marketing_updated", handleUpdate);
    return () => window.removeEventListener("triotax_marketing_updated", handleUpdate);
  }, [username]);

  const currentStaff = useMemo(() => {
    return staffList.find((s) => s.id === currentStaffId) || staffList[0];
  }, [staffList, currentStaffId]);

  // Filter queue leads based on tab and filters
  const filteredQueueLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Tab filtering
        if (queueTab === "my-leads") {
          if (lead.assignedToId !== currentStaff?.id) return false;
        } else if (queueTab === "follow-ups") {
          if (lead.assignedToId !== currentStaff?.id) return false;
          if (lead.outcome !== "FOLLOW_UP_REQUIRED" && lead.status !== "RESPONSE_PENDING") return false;
        } else if (queueTab === "available") {
          if (lead.status !== "AVAILABLE" && lead.assignedToId) return false;
        }

        // Campaign filter
        if (selectedCampaign !== "all" && lead.campaignName.toLowerCase() !== selectedCampaign.toLowerCase()) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const match =
            lead.businessName.toLowerCase().includes(q) ||
            (lead.contactPerson && lead.contactPerson.toLowerCase().includes(q)) ||
            lead.phone.toLowerCase().includes(q) ||
            (lead.city && lead.city.toLowerCase().includes(q)) ||
            lead.sequenceNumber.toString().includes(q);
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber); // strict sequence order 1, 2, 3...
  }, [leads, queueTab, selectedCampaign, searchQuery, currentStaff]);

  // Set initial selected lead if none selected or if selected not in list
  useEffect(() => {
    if (filteredQueueLeads.length > 0) {
      if (!selectedLeadId || !filteredQueueLeads.some((l) => l.id === selectedLeadId)) {
        setSelectedLeadId(filteredQueueLeads[0].id);
      }
    } else {
      setSelectedLeadId(null);
    }
  }, [filteredQueueLeads, selectedLeadId]);

  const activeLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Staff Performance Metrics
  const staffMetrics = useMemo(() => {
    if (!currentStaff) return { assigned: 0, calledToday: 0, interested: 0, closed: 0, wonRevenue: 0 };
    const myLeads = leads.filter((l) => l.assignedToId === currentStaff.id);
    let calledToday = 0;
    let interested = 0;
    let closed = 0;
    let wonRevenue = 0;

    const todayStr = new Date().toISOString().split("T")[0];

    leads.forEach((l) => {
      l.responses?.forEach((r) => {
        if (r.userId === currentStaff.id) {
          if (r.createdAt.startsWith(todayStr)) {
            calledToday++;
          }
          if (r.outcome === "INTERESTED") interested++;
          if (r.outcome === "CLOSED") {
            closed++;
            if (r.dealValue) wonRevenue += r.dealValue;
          }
        }
      });
    });

    return {
      assigned: myLeads.length,
      calledToday,
      interested,
      closed,
      wonRevenue,
    };
  }, [leads, currentStaff]);

  // Claim unassigned lead
  const handleClaimLead = (leadId: string) => {
    if (!currentStaff) return;
    assignLead(leadId, currentStaff.id, currentStaff.name);
    updateLeadStatus(leadId, "LOCKED");
    setSelectedLeadId(leadId);
  };

  // Change lead status directly
  const handleUpdateStatus = (status: Lead["status"]) => {
    if (!activeLead) return;
    updateLeadStatus(activeLead.id, status);
  };

  // Save Response handler
  const handleSaveResponse = (moveToNext: boolean = false) => {
    if (!activeLead) return;
    if (!callNotes.trim()) {
      alert("Please enter call discussion notes.");
      return;
    }

    const val = parseFloat(dealValue) || 0;

    addLeadResponse(activeLead.id, {
      userId: currentStaff?.id || "staff",
      userName: currentStaff?.name || username,
      outcome: callOutcome,
      notes: callNotes.trim(),
      followUpDate: callOutcome === "FOLLOW_UP_REQUIRED" || callOutcome === "INTERESTED" ? followUpDate : undefined,
      followUpNote: followUpNote.trim() || undefined,
      dealValue: val > 0 ? val : undefined,
    });

    setSavedSuccessMsg(`Call response recorded for ${activeLead.businessName}!`);
    setTimeout(() => setSavedSuccessMsg(""), 3500);

    // Reset response form fields
    setCallNotes("");
    setFollowUpDate("");
    setFollowUpNote("");
    setDealValue("");

    // Automatically navigate to next lead in sequence if requested
    if (moveToNext) {
      const currentIndex = filteredQueueLeads.findIndex((l) => l.id === activeLead.id);
      if (currentIndex !== -1 && currentIndex + 1 < filteredQueueLeads.length) {
        setSelectedLeadId(filteredQueueLeads[currentIndex + 1].id);
      }
    }
  };

  // Format phone for WhatsApp
  const cleanPhoneForWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const getWhatsAppLink = (lead: Lead) => {
    const p = cleanPhoneForWhatsApp(lead.phone);
    const greeting = encodeURIComponent(
      `Hello ${lead.contactPerson || "Sir/Madam"}, greetings from TrioTax! I am ${
        currentStaff?.name || "your compliance manager"
      }. We specialize in GST registration, ROC corporate compliance, and automated billing software for businesses in ${
        lead.city || "India"
      }. Would you have 2 minutes to discuss your compliance requirements?`
    );
    return `https://wa.me/${p}?text=${greeting}`;
  };

  return (
    <div className="space-y-5 font-sans pb-12">
      {/* Top Banner / Calling Header */}
      <div className="bg-[#003153] text-white rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <PhoneCall size={12} /> Marketing Tele-Calling Desk
            </span>
            <span className="text-xs text-white/60">Campaign Sequence Dialing Console</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span>Welcome, {currentStaff?.name || username}</span>
            <span className="text-xs font-normal text-sky-200/70">({currentStaff?.role})</span>
          </h2>
        </div>

        {/* Staff Switcher & Quick Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs">
            <User size={13} className="text-sky-300" />
            <span className="text-white/70">Agent:</span>
            <select
              value={currentStaffId}
              onChange={(e) => setCurrentStaffId(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              {staffList.map((s) => (
                <option key={s.id} value={s.id} className="text-slate-900 bg-white">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center">
              <span className="text-[10px] text-white/70 block uppercase font-bold">Assigned</span>
              <span className="text-sm font-black text-white">{staffMetrics.assigned}</span>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center">
              <span className="text-[10px] text-sky-200 block uppercase font-bold">Calls Today</span>
              <span className="text-sm font-black text-sky-300">{staffMetrics.calledToday}</span>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center">
              <span className="text-[10px] text-emerald-200 block uppercase font-bold">Closed Deals</span>
              <span className="text-sm font-black text-emerald-300">{staffMetrics.closed}</span>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center">
              <span className="text-[10px] text-white/70 block uppercase font-bold">Won Value</span>
              <span className="text-sm font-black text-white">₹{staffMetrics.wonRevenue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Calling Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Queue & Lead List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Queue Tab Buttons */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-2 shadow-xs flex items-center gap-1 text-xs">
            <button
              onClick={() => setQueueTab("my-leads")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer text-center ${
                queueTab === "my-leads"
                  ? "bg-[#003153] text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
            >
              My Leads ({leads.filter((l) => l.assignedToId === currentStaff?.id).length})
            </button>
            <button
              onClick={() => setQueueTab("follow-ups")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer text-center ${
                queueTab === "follow-ups"
                  ? "bg-[#003153] text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
            >
              Follow-ups ({leads.filter((l) => l.assignedToId === currentStaff?.id && (l.outcome === "FOLLOW_UP_REQUIRED" || l.status === "RESPONSE_PENDING")).length})
            </button>
            <button
              onClick={() => setQueueTab("available")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer text-center ${
                queueTab === "available"
                  ? "bg-[#003153] text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
            >
              Claim Free ({leads.filter((l) => l.status === "AVAILABLE").length})
            </button>
          </div>

          {/* Search & Campaign Filter */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-3 shadow-xs space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search seq#, business name, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
              />
            </div>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-white outline-none"
            >
              <option value="all">All Campaigns</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Leads Scroll Queue */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs max-h-[600px] overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
            {filteredQueueLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                No leads in this queue. Try changing tabs or filters.
              </div>
            ) : (
              filteredQueueLeads.map((lead) => {
                const isSelected = lead.id === selectedLeadId;
                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`p-3.5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-sky-50 dark:bg-sky-950/40 border-l-4 border-l-sky-600 dark:border-l-sky-400"
                        : "hover:bg-slate-50 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                          Seq #{lead.sequenceNumber}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {lead.businessName}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-zinc-400">
                        {lead.contactPerson && (
                          <span className="flex items-center gap-1 truncate">
                            <User size={11} /> {lead.contactPerson}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400">
                          <Phone size={10} /> {lead.phone}
                        </span>
                        {lead.city && <span>{lead.city}</span>}
                      </div>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                            lead.status === "AVAILABLE"
                              ? "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                              : lead.status === "CALLING"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                              : lead.status === "RESPONSE_PENDING"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          }`}
                        >
                          {lead.status}
                        </span>

                        {lead.outcome && (
                          <span
                            className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                              lead.outcome === "INTERESTED"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                : lead.outcome === "CLOSED"
                                ? "bg-emerald-600 text-white"
                                : lead.outcome === "FOLLOW_UP_REQUIRED"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                            }`}
                          >
                            {lead.outcome.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <ChevronRight
                        size={16}
                        className={`transition-transform ${
                          isSelected ? "text-sky-600 translate-x-1" : "text-slate-300 dark:text-zinc-600"
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Calling Station (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!activeLead ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-12 text-center text-slate-400 dark:text-zinc-500 shadow-xs">
              <PhoneCall size={32} className="mx-auto mb-3 text-slate-300 dark:text-zinc-600" />
              <p className="text-sm font-semibold">Select a lead from the queue on the left to start calling.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Success alert message */}
              {savedSuccessMsg && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>{savedSuccessMsg}</span>
                </div>
              )}

              {/* Lead Information Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-4 text-xs">
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                        Sequence #{activeLead.sequenceNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Campaign: {activeLead.campaignName}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {activeLead.businessName}
                    </h3>
                    <p className="text-slate-600 dark:text-zinc-400 font-medium mt-0.5">
                      Contact: <span className="text-slate-900 dark:text-white font-bold">{activeLead.contactPerson || "Authorized Representative"}</span>
                    </p>
                  </div>

                  {/* Claim Button if unassigned */}
                  {(!activeLead.assignedToId || activeLead.status === "AVAILABLE") && (
                    <button
                      onClick={() => handleClaimLead(activeLead.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Lock size={12} /> Claim & Lock Lead
                    </button>
                  )}
                </div>

                {/* Direct Action Dialing & Messaging Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Call Button */}
                  <a
                    href={`tel:${activeLead.phone}`}
                    onClick={() => handleUpdateStatus("CALLING")}
                    className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer text-xs"
                  >
                    <Phone size={16} />
                    <span>Call {activeLead.phone}</span>
                  </a>

                  {/* WhatsApp Quick Message */}
                  <a
                    href={getWhatsAppLink(activeLead)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer text-xs"
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp Pitch</span>
                  </a>

                  {/* Email Button */}
                  {activeLead.email ? (
                    <a
                      href={`mailto:${activeLead.email}?subject=TrioTax%20Corporate%20Tax%20%26%20Compliance%20Solutions`}
                      className="flex items-center justify-center gap-2 p-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer text-xs"
                    >
                      <Mail size={16} />
                      <span>Email Client</span>
                    </a>
                  ) : (
                    <div className="flex items-center justify-center p-3 bg-slate-100 dark:bg-zinc-800 text-slate-400 rounded-xl text-xs font-medium">
                      No Email Provided
                    </div>
                  )}
                </div>

                {/* Lead Status Quick Selector */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-zinc-400">Current Lead Status:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(["LOCKED", "CALLING", "RESPONSE_PENDING", "COMPLETED"] as Lead["status"][]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(st)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          activeLead.status === st
                            ? "bg-[#003153] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Record LeadResponse Form */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                    <Sparkles size={15} className="text-amber-500" />
                    Record Call Outcome & Notes (LeadResponse)
                  </span>
                  <span className="text-[11px] text-slate-400">Logged under @{currentStaff?.name}</span>
                </div>

                {/* Outcome Button Grid */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300">
                    Call Outcome *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "INTERESTED", label: "Interested", color: "hover:border-emerald-500" },
                      { id: "FOLLOW_UP_REQUIRED", label: "Follow-up Required", color: "hover:border-amber-500" },
                      { id: "CLOSED", label: "Closed (Won!)", color: "hover:border-emerald-600" },
                      { id: "NOT_INTERESTED", label: "Not Interested", color: "hover:border-slate-500" },
                      { id: "WRONG_NUMBER", label: "Wrong Number", color: "hover:border-rose-500" },
                      { id: "NO_ANSWER", label: "No Answer / Ringing", color: "hover:border-orange-500" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCallOutcome(item.id as any)}
                        className={`p-2 rounded-lg font-bold text-center border transition-all cursor-pointer text-xs ${
                          callOutcome === item.id
                            ? "bg-sky-50 dark:bg-sky-950/60 border-sky-600 text-sky-800 dark:text-sky-300 ring-2 ring-sky-500/30"
                            : `bg-slate-50/50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 ${item.color}`
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Follow-up info if applicable */}
                {(callOutcome === "FOLLOW_UP_REQUIRED" || callOutcome === "INTERESTED") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl">
                    <div>
                      <label className="block font-semibold text-amber-900 dark:text-amber-300 mb-1">
                        Follow-up Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-amber-900 dark:text-amber-300 mb-1">
                        Follow-up Objective
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Discuss GST filing pricing with MD"
                        value={followUpNote}
                        onChange={(e) => setFollowUpNote(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Deal Value if Closed or Interested */}
                {(callOutcome === "CLOSED" || callOutcome === "INTERESTED") && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Expected / Agreed Deal Value (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        placeholder="e.g. 35000"
                        value={dealValue}
                        onChange={(e) => setDealValue(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Discussion & Call Summary Notes *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter key talking points, pricing discussed, customer objections or requirements..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => handleSaveResponse(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Save Log Only
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveResponse(true)}
                    className="px-5 py-2 bg-[#003153] hover:bg-[#014d7a] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Save & Next Lead</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Call History Timeline for Active Lead */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-3 text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Previous Interaction History ({activeLead.responses?.length || 0})</span>
                </span>

                {!activeLead.responses || activeLead.responses.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-4">No previous calls logged yet for this lead.</p>
                ) : (
                  <div className="space-y-2.5">
                    {activeLead.responses.map((resp) => (
                      <div
                        key={resp.id}
                        className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/70 dark:border-zinc-700 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                resp.outcome === "INTERESTED"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                  : resp.outcome === "CLOSED"
                                  ? "bg-emerald-600 text-white"
                                  : resp.outcome === "FOLLOW_UP_REQUIRED"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                  : "bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300"
                              }`}
                            >
                              {resp.outcome.replace(/_/g, " ")}
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-zinc-200">
                              By {resp.userName}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(resp.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-slate-700 dark:text-zinc-300 text-xs mt-1">{resp.notes}</p>

                        {(resp.followUpDate || resp.dealValue) && (
                          <div className="pt-1.5 mt-1 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px]">
                            {resp.followUpDate && (
                              <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                                <Clock size={11} />
                                Follow up: {new Date(resp.followUpDate).toLocaleString()}
                                {resp.followUpNote ? ` — ${resp.followUpNote}` : ""}
                              </span>
                            )}
                            {resp.dealValue && resp.dealValue > 0 && (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-auto">
                                Won: ₹{resp.dealValue.toLocaleString("en-IN")}
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
          )}
        </div>
      </div>
    </div>
  );
};
