import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  Database,
  Flame,
  Clock,
  XCircle,
  Award,
  Megaphone,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Building2,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  LogOut,
  ChevronRight,
  Copy,
  Check,
  Send,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Layers,
  FileText,
  Pin,
  CalendarClock,
  IndianRupee,
  Lock,
  Sun,
  Moon,
  ExternalLink,
  ChevronDown,
  UserCheck,
  X,
} from "lucide-react";
import {
  Lead,
  LeadResponse,
  Campaign,
  StaffMember,
  StaffNotice,
  STAFF_ROLES,
  getStoredCampaigns,
  getStoredLeads,
  getStoredStaff,
  getStoredNotices,
  saveLeads,
  addLeadResponse,
  updateLeadStatus,
  pushMarketingToDatabase,
  syncMarketingWithDatabase,
} from "@/lib/marketing-data";

interface StaffPortalProps {
  onLogout?: () => void;
  staffId?: string;
  employeeId?: string;
}

type StaffTab =
  | "dashboard"
  | "data"
  | "interested"
  | "follow-up"
  | "not-interested"
  | "closed"
  | "notice";

export const StaffPortal: React.FC<StaffPortalProps> = ({
  onLogout,
  staffId: initialStaffId,
  employeeId: initialEmployeeId,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<StaffTab>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  // Data Store State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [notices, setNotices] = useState<StaffNotice[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active Staff Member Profile
  const [currentStaff, setCurrentStaff] = useState<StaffMember>(() => {
    const sList = getStoredStaff();
    const storedId =
      initialStaffId ||
      (typeof window !== "undefined"
        ? localStorage.getItem("triotax_current_staff_id")
        : null);
    const storedEmpId =
      initialEmployeeId ||
      (typeof window !== "undefined"
        ? localStorage.getItem("triotax_current_staff_emp_id")
        : null);

    const match =
      sList.find((s) => s.id === storedId) ||
      sList.find((s) => s.employeeId === storedEmpId) ||
      sList[0] || {
        id: "staff_tx_m_00020",
        employeeId: "TX-M-00020",
        name: "Senior Tele-Marketing Specialist",
        email: "telemarketing@triotax.in",
        role: "Senior Tele-Marketing Specialist",
        phone: "+91 98450 00020",
      };
    return match;
  });

  // Selected Lead for Call Logging Drawer / Modal
  const [selectedLeadForCall, setSelectedLeadForCall] = useState<Lead | null>(null);

  // Call Logger Form State
  const [callOutcome, setCallOutcome] = useState<
    "INTERESTED" | "FOLLOW_UP_REQUIRED" | "NOT_INTERESTED" | "CLOSED" | "NO_ANSWER" | "WRONG_NUMBER"
  >("INTERESTED");
  const [callNotes, setCallNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Filters State for Data Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dataSubFilter, setDataSubFilter] = useState<"all" | "available" | "my-leads">("all");

  // Filters State for Notice Tab
  const [noticeCategory, setNoticeCategory] = useState<string>("ALL");
  const [noticeSearch, setNoticeSearch] = useState("");

  // Refresh data from storage and sync with database
  const refreshData = () => {
    const loadedLeads = getStoredLeads();
    const loadedCampaigns = getStoredCampaigns();
    const loadedStaff = getStoredStaff();
    const loadedNotices = getStoredNotices();

    setLeads(loadedLeads);
    setCampaigns(loadedCampaigns);
    setStaffList(loadedStaff);
    setNotices(loadedNotices);

    // Refresh staff info
    const storedId =
      initialStaffId ||
      (typeof window !== "undefined"
        ? localStorage.getItem("triotax_current_staff_id")
        : null);
    const storedEmpId =
      initialEmployeeId ||
      (typeof window !== "undefined"
        ? localStorage.getItem("triotax_current_staff_emp_id")
        : null);

    const match =
      loadedStaff.find((s) => s.id === storedId) ||
      loadedStaff.find((s) => s.employeeId === storedEmpId) ||
      loadedStaff[0];
    if (match) {
      setCurrentStaff(match);
    }
  };

  useEffect(() => {
    refreshData();
    syncMarketingWithDatabase().then(() => refreshData());

    const handleUpdate = () => refreshData();
    window.addEventListener("triotax_marketing_updated", handleUpdate);
    return () => window.removeEventListener("triotax_marketing_updated", handleUpdate);
  }, []);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Toggle Dark/Light Theme
  const toggleTheme = () => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.remove("dark");
      setTheme("light");
    } else {
      root.classList.add("dark");
      setTheme("dark");
    }
  };

  // Filtered Leads by Outcome / Stage
  const interestedLeads = useMemo(() => {
    return leads.filter((l) => l.outcome === "INTERESTED");
  }, [leads]);

  const followUpLeads = useMemo(() => {
    return leads.filter(
      (l) => l.outcome === "FOLLOW_UP_REQUIRED" || l.status === "RESPONSE_PENDING"
    );
  }, [leads]);

  const notInterestedLeads = useMemo(() => {
    return leads.filter(
      (l) =>
        l.outcome === "NOT_INTERESTED" ||
        l.outcome === "WRONG_NUMBER" ||
        l.outcome === "NO_ANSWER"
    );
  }, [leads]);

  const closedLeads = useMemo(() => {
    return leads.filter((l) => l.outcome === "CLOSED" || l.status === "COMPLETED");
  }, [leads]);

  // Calls logged by this current staff member
  const myStaffCalls = useMemo(() => {
    const list: Array<{ lead: Lead; response: LeadResponse }> = [];
    leads.forEach((l) => {
      l.responses?.forEach((r) => {
        if (r.userId === currentStaff.id || r.userId === currentStaff.employeeId) {
          list.push({ lead: l, response: r });
        }
      });
    });
    list.sort(
      (a, b) =>
        new Date(b.response.createdAt).getTime() - new Date(a.response.createdAt).getTime()
    );
    return list;
  }, [leads, currentStaff]);

  // Overall Statistics for Dashboard
  const dashboardMetrics = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    let callsToday = 0;
    let myInterested = 0;
    let myFollowUps = 0;
    let myClosed = 0;
    let totalWonRevenue = 0;

    myStaffCalls.forEach(({ response }) => {
      if (response.createdAt && response.createdAt.startsWith(todayStr)) {
        callsToday++;
      }
      if (response.outcome === "INTERESTED") myInterested++;
      if (response.outcome === "FOLLOW_UP_REQUIRED") myFollowUps++;
      if (response.outcome === "CLOSED") {
        myClosed++;
        if (response.dealValue) totalWonRevenue += response.dealValue;
      }
    });

    // Also include any leads closed where deal value was logged
    closedLeads.forEach((l) => {
      const match = l.responses?.find((r) => r.outcome === "CLOSED");
      if (match?.dealValue && !totalWonRevenue) {
        totalWonRevenue += match.dealValue;
      }
    });

    const conversionRate =
      myStaffCalls.length > 0 ? Math.round((myClosed / myStaffCalls.length) * 100) : 0;

    return {
      totalLeadsPool: leads.length,
      myTotalCalls: myStaffCalls.length,
      callsToday,
      dailyTarget: 40,
      myInterested,
      myFollowUps,
      myClosed,
      totalWonRevenue,
      conversionRate,
    };
  }, [leads, myStaffCalls, closedLeads]);

  // Filtered Leads in the "Data" Tab (Admin-uploaded leads)
  const filteredDataLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Sub filter
      if (dataSubFilter === "available" && lead.status !== "AVAILABLE") {
        return false;
      }
      if (
        dataSubFilter === "my-leads" &&
        lead.assignedToId !== currentStaff.id &&
        lead.assignedToId !== currentStaff.employeeId
      ) {
        return false;
      }

      // Campaign filter
      if (
        campaignFilter !== "all" &&
        lead.campaignName.toLowerCase() !== campaignFilter.toLowerCase()
      ) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          lead.businessName.toLowerCase().includes(q) ||
          (lead.contactPerson && lead.contactPerson.toLowerCase().includes(q)) ||
          lead.phone.includes(q) ||
          (lead.email && lead.email.toLowerCase().includes(q)) ||
          (lead.city && lead.city.toLowerCase().includes(q)) ||
          String(lead.sequenceNumber).includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [leads, dataSubFilter, campaignFilter, statusFilter, searchQuery, currentStaff]);

  // Filtered Notices in "NOTICE" Tab
  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      if (noticeCategory !== "ALL" && n.category !== noticeCategory) {
        return false;
      }
      if (noticeSearch.trim()) {
        const q = noticeSearch.toLowerCase().trim();
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notices, noticeCategory, noticeSearch]);

  // Open Dialer / Call Logger Modal
  const handleOpenCallModal = (lead: Lead) => {
    setSelectedLeadForCall(lead);
    setCallOutcome(lead.outcome || "INTERESTED");
    setCallNotes("");
    setFollowUpDate("");
    setFollowUpNote("");
    setDealValue("");
    setSaveSuccessMsg("");
  };

  // Quick Action: Pick next available lead to call
  const handleCallNextAvailableLead = () => {
    const nextLead =
      leads.find((l) => l.status === "AVAILABLE") ||
      leads.find((l) => l.status !== "COMPLETED");
    if (nextLead) {
      handleOpenCallModal(nextLead);
    } else if (leads.length > 0) {
      handleOpenCallModal(leads[0]);
    } else {
      alert("No leads currently available in the Data pool. Please wait for Admin to upload new records.");
    }
  };

  // Submit Call Response
  const handleSaveCallResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForCall) return;

    if (!callNotes.trim()) {
      alert("Please enter conversation notes regarding what was discussed with the client.");
      return;
    }

    if (callOutcome === "FOLLOW_UP_REQUIRED" && !followUpDate) {
      alert("Please select a follow-up date and time for the scheduled callback.");
      return;
    }

    // Determine status from outcome
    let nextStatus: Lead["status"] = "CALLING";
    if (callOutcome === "CLOSED") nextStatus = "COMPLETED";
    else if (callOutcome === "FOLLOW_UP_REQUIRED") nextStatus = "RESPONSE_PENDING";
    else if (callOutcome === "NOT_INTERESTED") nextStatus = "COMPLETED";
    else if (callOutcome === "INTERESTED") nextStatus = "CALLING";

    // Add response
    addLeadResponse(selectedLeadForCall.id, {
      userId: currentStaff.id,
      outcome: callOutcome,
      notes: callNotes.trim(),
      followUpDate: followUpDate || undefined,
      followUpNote: followUpNote.trim() || undefined,
      dealValue: dealValue ? parseFloat(dealValue) : 0,
    });

    // Update lead status and assignment to current staff member
    updateLeadStatus(
      selectedLeadForCall.id,
      nextStatus,
      callOutcome,
      currentStaff.id,
      currentStaff.name
    );

    // Sync to backend database
    pushMarketingToDatabase().catch(() => {});

    setSaveSuccessMsg("✅ Call logged successfully! Lead advanced in pipeline.");
    setTimeout(() => {
      setSelectedLeadForCall(null);
      setSaveSuccessMsg("");
      refreshData();
    }, 1200);
  };

  // Navigation Items Config for Senior Tele-Marketing Specialist
  const navTabs: Array<{
    id: StaffTab;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
    badgeColor?: string;
  }> = [
    {
      id: "dashboard",
      label: "Dashboard (over all )",
      icon: LayoutDashboard,
    },
    {
      id: "data",
      label: "Data",
      icon: Database,
      badgeCount: leads.length,
      badgeColor: "bg-sky-500",
    },
    {
      id: "interested",
      label: "INTERESTED",
      icon: Flame,
      badgeCount: interestedLeads.length,
      badgeColor: "bg-amber-500",
    },
    {
      id: "follow-up",
      label: "FOLLOW UP REQUIRED",
      icon: CalendarClock,
      badgeCount: followUpLeads.length,
      badgeColor: "bg-blue-500",
    },
    {
      id: "not-interested",
      label: "NOT INTERESTED",
      icon: XCircle,
      badgeCount: notInterestedLeads.length,
      badgeColor: "bg-slate-400",
    },
    {
      id: "closed",
      label: "CLOSED",
      icon: Award,
      badgeCount: closedLeads.length,
      badgeColor: "bg-emerald-500",
    },
    {
      id: "notice",
      label: "NOTICE",
      icon: Megaphone,
      badgeCount: notices.length,
      badgeColor: "bg-rose-500",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans overflow-hidden">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SIDEBAR NAVIGATION - PRUSSIAN BLUE #003153 BRANDING           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <aside
        style={{ backgroundColor: "#003153" }}
        className={`flex flex-col h-full text-white border-r border-white/10 transition-all duration-300 select-none z-30 shrink-0 ${
          isSidebarCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src="/Artboard.png"
              alt="TrioTax Logo"
              className="h-9 w-auto object-contain shrink-0"
              onError={(e) => {
                // Fallback to stylized text if image missing
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            {!isSidebarCollapsed && (
              <div className="truncate">
                <span className="font-black text-sm tracking-wide text-white block">
                  TRIOTAX
                </span>
                <span className="text-[10px] font-semibold text-sky-200 uppercase tracking-widest block">
                  Staff Calling Console
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Layers size={16} />
          </button>
        </div>

        {/* Current Active Staff Badge */}
        {!isSidebarCollapsed && (
          <div className="p-3.5 mx-3 my-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm shrink-0">
                {currentStaff.name.charAt(0) || "S"}
              </div>
              <div className="truncate flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white truncate block">
                    {currentStaff.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-400/20 text-sky-200 border border-sky-300/30">
                    {currentStaff.employeeId || "TX-M-00020"}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-200">
              <span className="truncate">Senior Tele-Marketing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 font-bold">
                Active Role
              </span>
            </div>
          </div>
        )}

        {/* Staff Roles Selection / Roster (Requested 5 Roles with 4 Disabled) */}
        {!isSidebarCollapsed && (
          <div className="px-4 py-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200/70 block mb-1.5">
              TrioTax Staff Roles
            </span>
            <div className="space-y-1">
              {STAFF_ROLES.map((role) => {
                const isActiveRole = role.id === "senior-telemarketing";
                return (
                  <div
                    key={role.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                      isActiveRole
                        ? "bg-white/15 text-white font-bold border border-white/20"
                        : "opacity-45 text-white/60 cursor-not-allowed select-none bg-black/10"
                    }`}
                    title={
                      isActiveRole
                        ? "Active Tele-Calling Portal"
                        : `${role.name} portal is coming soon / disabled in this release`
                    }
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Briefcase
                        size={12}
                        className={isActiveRole ? "text-amber-300" : "text-white/40"}
                      />
                      <span className="truncate text-[11px]">{role.name}</span>
                    </div>

                    {isActiveRole ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-white/10 text-white/50 font-bold shrink-0">
                        Disabled
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tele-Marketing Specialist Navigation Tabs */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200/70 block px-2 mb-1.5">
            Senior Tele-Marketing Tabs
          </span>

          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-white text-[#003153] shadow-md transform translate-x-1"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title={tab.label}
              >
                <Icon
                  size={16}
                  className={`shrink-0 ${
                    isSelected ? "text-[#003153]" : "text-white/70"
                  }`}
                />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{tab.label}</span>
                    {typeof tab.badgeCount === "number" && tab.badgeCount > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ml-1.5 shrink-0 ${
                          isSelected
                            ? "bg-[#003153] text-white"
                            : tab.badgeColor || "bg-sky-500"
                        }`}
                      >
                        {tab.badgeCount}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {/* Quick theme toggle & connectivity */}
          <div className="flex items-center justify-between px-2 py-1 text-xs text-sky-200/80">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {!isSidebarCollapsed && "Database Live"}
            </span>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
              title="Toggle Dark / Light theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              if (onLogout) {
                onLogout();
              } else {
                localStorage.removeItem("triotax_is_staff_auth");
                window.location.href = "/staff";
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white text-xs font-bold transition-all cursor-pointer"
            title="Sign out of staff portal"
          >
            <LogOut size={14} />
            {!isSidebarCollapsed && <span>Sign Out Portal</span>}
          </button>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT AREA                                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-zinc-950">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                {navTabs.find((t) => t.id === activeTab)?.label}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-[#003153] dark:bg-sky-950/60 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800">
                Senior Tele-Marketing Console
              </span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Dial Next Available Lead */}
            <button
              onClick={handleCallNextAvailableLead}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#003153] hover:bg-[#014d7a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <PhoneCall size={14} className="text-emerald-300" />
              <span>📞 Dial Next Lead</span>
            </button>

            {/* Calling Pace Tracker */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-medium">
              <span className="text-slate-500 dark:text-zinc-400">Today&apos;s Dials:</span>
              <span className="font-black text-slate-900 dark:text-white">
                {dashboardMetrics.callsToday} / {dashboardMetrics.dailyTarget}
              </span>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-[#003153] text-white font-bold flex items-center justify-center text-xs">
                {currentStaff.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentStaff.name}
                </span>
                <span className="block text-[10px] font-mono text-slate-400">
                  {currentStaff.employeeId || "TX-M-00020"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Viewport */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 1: DASHBOARD (OVER ALL)                                   */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div
                style={{ backgroundColor: "#003153" }}
                className="rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-sky-200 text-[11px] font-bold">
                    <Sparkles size={12} className="text-amber-300" />
                    <span>Tele-Sales Performance Dashboard</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    Welcome, {currentStaff.name}!
                  </h2>
                  <p className="text-xs text-sky-100 max-w-xl leading-relaxed">
                    Here is your real-time outbound calling overview. Admin-uploaded leads are ready in the
                    <strong> Data</strong> tab for qualification, follow-ups, and sales closing.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveTab("data")}
                    className="px-4 py-2.5 bg-white text-[#003153] hover:bg-sky-50 font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Database size={14} />
                    <span>Open Data Pool ({leads.length})</span>
                  </button>
                  <button
                    onClick={handleCallNextAvailableLead}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall size={14} />
                    <span>Quick Dial &rarr;</span>
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 block uppercase">
                    Data Pool
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">
                    {dashboardMetrics.totalLeadsPool}
                  </span>
                  <span className="text-[10px] text-sky-600 font-semibold">Admin Uploaded</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 block uppercase">
                    My Total Calls
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">
                    {dashboardMetrics.myTotalCalls}
                  </span>
                  <span className="text-[10px] text-slate-400">All-time dials</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 block uppercase">
                    Calls Today
                  </span>
                  <span className="text-2xl font-black text-emerald-600 block mt-1">
                    {dashboardMetrics.callsToday}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Target: {dashboardMetrics.dailyTarget}
                  </span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                  <span className="text-[11px] font-bold text-amber-600 block uppercase">
                    Interested
                  </span>
                  <span className="text-2xl font-black text-amber-600 block mt-1">
                    {dashboardMetrics.myInterested}
                  </span>
                  <span className="text-[10px] text-slate-400">Hot prospects</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                  <span className="text-[11px] font-bold text-blue-600 block uppercase">
                    Follow-ups
                  </span>
                  <span className="text-2xl font-black text-blue-600 block mt-1">
                    {dashboardMetrics.myFollowUps}
                  </span>
                  <span className="text-[10px] text-slate-400">Callbacks due</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                  <span className="text-[11px] font-bold text-rose-500 block uppercase">
                    Not Interested
                  </span>
                  <span className="text-2xl font-black text-rose-500 block mt-1">
                    {notInterestedLeads.length}
                  </span>
                  <span className="text-[10px] text-slate-400">Disqualified</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                  <span className="text-[11px] font-bold text-emerald-600 block uppercase">
                    Closed Deals
                  </span>
                  <span className="text-2xl font-black text-emerald-600 block mt-1">
                    {dashboardMetrics.myClosed}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {dashboardMetrics.conversionRate}% Rate
                  </span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                  <span className="text-[11px] font-bold text-[#003153] dark:text-sky-300 block uppercase truncate">
                    Won Revenue
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-white block mt-1 truncate">
                    ₹{dashboardMetrics.totalWonRevenue.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">Converted</span>
                </div>
              </div>

              {/* Progress Bar & Quick Pipeline Visualizer */}
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-sky-600" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Daily Outbound Calling Milestone Progress
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {dashboardMetrics.callsToday} / {dashboardMetrics.dailyTarget} Dials Completed (
                    {Math.min(
                      100,
                      Math.round(
                        (dashboardMetrics.callsToday / dashboardMetrics.dailyTarget) * 100
                      )
                    )}
                    %)
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#003153] to-sky-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (dashboardMetrics.callsToday / dashboardMetrics.dailyTarget) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Two Column Layout: Recent Tele-Calling Activity & Pipeline Navigation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Calls by Me */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-500" />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        My Recent Tele-Calling Log Activity
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      {myStaffCalls.length} calls logged
                    </span>
                  </div>

                  {myStaffCalls.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 dark:text-zinc-500 text-xs">
                      No calls logged yet today. Click &quot;Dial Next Lead&quot; or go to the Data tab to record your first client conversation.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myStaffCalls.slice(0, 6).map(({ lead, response }) => (
                        <div
                          key={response.id}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-700">
                                #{lead.sequenceNumber}
                              </span>
                              <span className="font-bold text-xs text-slate-900 dark:text-white">
                                {lead.businessName}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                ({lead.phone})
                              </span>
                            </div>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                response.outcome === "INTERESTED"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                  : response.outcome === "CLOSED"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : response.outcome === "FOLLOW_UP_REQUIRED"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                  : "bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300"
                              }`}
                            >
                              {response.outcome}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-zinc-300">
                            &quot;{response.notes}&quot;
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                            <span>Campaign: {lead.campaignName}</span>
                            <span>
                              {response.createdAt ? new Date(response.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pipeline Quick Jump Cards */}
                <div className="space-y-4">
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      Pipeline Quick Access
                    </h4>

                    <button
                      onClick={() => setActiveTab("data")}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-[#003153] dark:text-sky-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Database size={15} />
                        <span>Data (Admin Uploaded)</span>
                      </span>
                      <span>{leads.length} &rarr;</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("interested")}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Flame size={15} />
                        <span>INTERESTED Leads</span>
                      </span>
                      <span>{interestedLeads.length} &rarr;</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("follow-up")}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-900 dark:text-blue-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <CalendarClock size={15} />
                        <span>FOLLOW UP REQUIRED</span>
                      </span>
                      <span>{followUpLeads.length} &rarr;</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("closed")}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Award size={15} />
                        <span>CLOSED Deals</span>
                      </span>
                      <span>{closedLeads.length} &rarr;</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("notice")}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-900 dark:text-rose-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Megaphone size={15} />
                        <span>NOTICE Board</span>
                      </span>
                      <span>{notices.length} Circulars &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 2: DATA (ADMIN UPLOADED LEADS)                            */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === "data" && (
            <div className="space-y-4">
              {/* Header Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Admin-Uploaded Lead Records & Calling Queue</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-[#003153] dark:bg-sky-950/60 dark:text-sky-300 font-bold">
                      {filteredDataLeads.length} Records
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Data directly synced from Admin Marketing Data uploads. Pick records, dial contacts, and log conversation responses.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshData}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={13} />
                    <span>Sync Leads</span>
                  </button>
                  <button
                    onClick={handleCallNextAvailableLead}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#003153] hover:bg-[#014d7a] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <PhoneCall size={13} />
                    <span>Call Next Available</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <button
                    onClick={() => setDataSubFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      dataSubFilter === "all"
                        ? "bg-[#003153] text-white"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200"
                    }`}
                  >
                    All Uploaded Leads ({leads.length})
                  </button>
                  <button
                    onClick={() => setDataSubFilter("available")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      dataSubFilter === "available"
                        ? "bg-[#003153] text-white"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200"
                    }`}
                  >
                    Available / Unassigned ({leads.filter((l) => l.status === "AVAILABLE").length})
                  </button>
                  <button
                    onClick={() => setDataSubFilter("my-leads")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      dataSubFilter === "my-leads"
                        ? "bg-[#003153] text-white"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200"
                    }`}
                  >
                    Assigned to Me (
                    {
                      leads.filter(
                        (l) =>
                          l.assignedToId === currentStaff.id ||
                          l.assignedToId === currentStaff.employeeId
                      ).length
                    }
                    )
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  {/* Search input */}
                  <div className="md:col-span-2 relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search by company name, contact, phone, city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Campaign dropdown */}
                  <div>
                    <select
                      value={campaignFilter}
                      onChange={(e) => setCampaignFilter(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none font-medium"
                    >
                      <option value="all">All Campaigns</option>
                      {campaigns.map((camp) => (
                        <option key={camp.id} value={camp.name}>
                          {camp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status dropdown */}
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none font-medium"
                    >
                      <option value="all">All Statuses</option>
                      <option value="AVAILABLE">AVAILABLE (Uncontacted)</option>
                      <option value="CALLING">CALLING (In Progress)</option>
                      <option value="RESPONSE_PENDING">RESPONSE_PENDING (Follow-up)</option>
                      <option value="COMPLETED">COMPLETED (Closed / Won)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 font-bold border-b border-slate-200 dark:border-zinc-800">
                        <th className="p-3 w-12 text-center">Seq #</th>
                        <th className="p-3">Business / Entity Name</th>
                        <th className="p-3">Contact Person</th>
                        <th className="p-3">Phone & Email</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Campaign</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Outcome</th>
                        <th className="p-3 text-right">Dial Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {filteredDataLeads.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-slate-400 dark:text-zinc-500">
                            <p className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                              No leads found matching your filters.
                            </p>
                            <p className="text-xs">
                              Ensure Admin has uploaded leads in Admin &gt; Marketing Data, or clear your search filters.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredDataLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                          >
                            <td className="p-3 text-center font-mono font-bold text-slate-500">
                              #{lead.sequenceNumber}
                            </td>

                            <td className="p-3">
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {lead.businessName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Added {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "Recently"}
                              </span>
                            </td>

                            <td className="p-3 text-slate-700 dark:text-zinc-300 font-semibold">
                              {lead.contactPerson || "Authorized Signatory"}
                            </td>

                            <td className="p-3">
                              <div className="flex items-center gap-1 font-mono font-bold text-slate-900 dark:text-white">
                                <Phone size={11} className="text-emerald-500" />
                                <span>{lead.phone}</span>
                                <button
                                  onClick={() => handleCopy(lead.phone, `phone_${lead.id}`)}
                                  className="text-slate-400 hover:text-slate-600 ml-1"
                                  title="Copy phone"
                                >
                                  {copiedId === `phone_${lead.id}` ? (
                                    <Check size={11} className="text-emerald-600" />
                                  ) : (
                                    <Copy size={11} />
                                  )}
                                </button>
                              </div>
                              {lead.email && (
                                <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">
                                  {lead.email}
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-slate-600 dark:text-zinc-300">
                              {lead.city || "India"}
                            </td>

                            <td className="p-3">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                                {lead.campaignName}
                              </span>
                            </td>

                            <td className="p-3 text-center">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  lead.status === "AVAILABLE"
                                    ? "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                                    : lead.status === "CALLING"
                                    ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                                    : lead.status === "RESPONSE_PENDING"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                }`}
                              >
                                {lead.status}
                              </span>
                            </td>

                            <td className="p-3 text-center">
                              {lead.outcome ? (
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    lead.outcome === "INTERESTED"
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                      : lead.outcome === "CLOSED"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                      : lead.outcome === "FOLLOW_UP_REQUIRED"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                      : "bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300"
                                  }`}
                                >
                                  {lead.outcome}
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400">Uncontacted</span>
                              )}
                            </td>

                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleOpenCallModal(lead)}
                                className="px-3 py-1.5 bg-[#003153] hover:bg-[#014d7a] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <PhoneCall size={12} />
                                <span>Call & Log</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 3: INTERESTED (HOT LEADS PIPELINE)                         */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === "interested" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <Flame size={18} className="text-amber-500" />
                    <span>INTERESTED Hot Leads Pipeline ({interestedLeads.length})</span>
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                    Prospects that showed interest during tele-calling. Follow up with customized corporate compliance quotes and close deals.
                  </p>
                </div>
              </div>

              {interestedLeads.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-10 text-center text-slate-400 dark:text-zinc-500">
                  <Flame size={36} className="mx-auto mb-2 text-amber-400/60" />
                  <p className="font-bold text-slate-700 dark:text-zinc-300">No leads currently marked as INTERESTED</p>
                  <p className="text-xs mt-1">
                    Call uncontacted leads in the <strong>Data</strong> tab and select outcome &quot;INTERESTED&quot; to populate this pipeline.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {interestedLeads.map((lead) => {
                    const lastResp = lead.responses && lead.responses.length > 0 ? lead.responses[lead.responses.length - 1] : null;

                    return (
                      <div
                        key={lead.id}
                        className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                              Seq #{lead.sequenceNumber}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase">
                              Interested
                            </span>
                          </div>

                          <h4 className="font-black text-sm text-slate-900 dark:text-white">
                            {lead.businessName}
                          </h4>

                          <div className="text-xs text-slate-600 dark:text-zinc-300 space-y-1">
                            <p className="font-medium">
                              Contact: {lead.contactPerson || "Authorized Signatory"}
                            </p>
                            <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              Phone: {lead.phone}
                            </p>
                            {lead.city && <p className="text-slate-400">Location: {lead.city}</p>}
                          </div>

                          {lastResp && (
                            <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-100 dark:border-zinc-700 text-xs">
                              <span className="font-bold text-[10px] text-slate-500 block mb-0.5">
                                Last Call Notes:
                              </span>
                              <p className="text-slate-700 dark:text-zinc-300 italic">
                                &quot;{lastResp.notes}&quot;
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-2">
                          <button
                            onClick={() => handleOpenCallModal(lead)}
                            className="flex-1 py-2 bg-[#003153] hover:bg-[#014d7a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                          >
                            Follow Up & Close &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 4: FOLLOW UP REQUIRED                                     */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === "follow-up" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <CalendarClock size={18} className="text-blue-500" />
                    <span>FOLLOW UP REQUIRED Scheduled Queue ({followUpLeads.length})</span>
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                    Scheduled callbacks and promised follow-ups. Ensure timely outreach to convert pending prospects.
                  </p>
                </div>
              </div>

              {followUpLeads.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-10 text-center text-slate-400 dark:text-zinc-500">
                  <CalendarClock size={36} className="mx-auto mb-2 text-blue-400/60" />
                  <p className="font-bold text-slate-700 dark:text-zinc-300">No scheduled follow-ups pending</p>
                  <p className="text-xs mt-1">
                    When logging calls in the Data tab, select &quot;FOLLOW UP REQUIRED&quot; with a callback time to track reminders here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followUpLeads.map((lead) => {
                    const lastResp = lead.responses && lead.responses.length > 0 ? lead.responses[lead.responses.length - 1] : null;

                    return (
                      <div
                        key={lead.id}
                        className="bg-white dark:bg-zinc-900 rounded-xl border border-blue-200 dark:border-blue-900/40 p-5 shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
                              Seq #{lead.sequenceNumber}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase">
                              Follow-up Due
                            </span>
                          </div>

                          <h4 className="font-black text-sm text-slate-900 dark:text-white">
                            {lead.businessName}
                          </h4>

                          <div className="text-xs text-slate-600 dark:text-zinc-300 space-y-1">
                            <p className="font-medium">
                              Contact: {lead.contactPerson || "Authorized Signatory"}
                            </p>
                            <p className="font-mono font-bold text-slate-900 dark:text-white">
                              Phone: {lead.phone}
                            </p>
                          </div>

                          {lastResp?.followUpDate && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/50 text-xs">
                              <span className="font-bold text-[10px] text-blue-700 dark:text-blue-300 block mb-0.5">
                                Scheduled Callback:
                              </span>
                              <p className="font-black text-blue-900 dark:text-blue-200">
                                📅 {new Date(lastResp.followUpDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                              {lastResp.followUpNote && (
                                <p className="text-slate-600 dark:text-zinc-300 mt-1 italic">
                                  &quot;{lastResp.followUpNote}&quot;
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                          <button
                            onClick={() => handleOpenCallModal(lead)}
                            className="w-full py-2 bg-[#003153] hover:bg-[#014d7a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                          >
                            <PhoneCall size={13} />
                            <span>Execute Callback Now</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 5: NOT INTERESTED                                         */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === "not-interested" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                    <XCircle size={18} className="text-rose-500" />
                    <span>NOT INTERESTED & Disqualified Records ({notInterestedLeads.length})</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                    Leads that declined services or were disqualified due to timing, wrong contact info, or competitors.
                  </p>
                </div>
              </div>

              {notInterestedLeads.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-10 text-center text-slate-400 dark:text-zinc-500">
                  <XCircle size={36} className="mx-auto mb-2 text-slate-300 dark:text-zinc-600" />
                  <p className="font-bold text-slate-700 dark:text-zinc-300">No leads marked as NOT INTERESTED</p>
                  <p className="text-xs mt-1">All disqualified or declined records will be cataloged here for objection auditing.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 font-bold border-b border-slate-200 dark:border-zinc-800">
                        <th className="p-3 w-12 text-center">Seq #</th>
                        <th className="p-3">Business Name</th>
                        <th className="p-3">Contact & Phone</th>
                        <th className="p-3">Objection / Reason Logged</th>
                        <th className="p-3">Campaign</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {notInterestedLeads.map((lead) => {
                        const lastResp = lead.responses && lead.responses.length > 0 ? lead.responses[lead.responses.length - 1] : null;

                        return (
                          <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                            <td className="p-3 text-center font-mono font-bold text-slate-400">
                              #{lead.sequenceNumber}
                            </td>
                            <td className="p-3 font-bold text-slate-900 dark:text-white">
                              {lead.businessName}
                            </td>
                            <td className="p-3 text-slate-600 dark:text-zinc-300 font-mono">
                              {lead.phone}
                            </td>
                            <td className="p-3 text-slate-700 dark:text-zinc-300 italic">
                              &quot;{lastResp?.notes || "Marked as not interested"}&quot;
                            </td>
                            <td className="p-3 text-slate-500">{lead.campaignName}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleOpenCallModal(lead)}
                                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                              >
                                Re-evaluate
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 6: CLOSED (WON DEALS)                                     */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === "closed" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <Award size={18} className="text-emerald-600" />
                    <span>CLOSED & Converted Won Deals ({closedLeads.length})</span>
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Successfully converted clients and realized contracted value.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                    Total Converted Revenue
                  </span>
                  <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                    ₹{dashboardMetrics.totalWonRevenue.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {closedLeads.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-10 text-center text-slate-400 dark:text-zinc-500">
                  <Award size={36} className="mx-auto mb-2 text-emerald-400/60" />
                  <p className="font-bold text-slate-700 dark:text-zinc-300">No deals closed yet</p>
                  <p className="text-xs mt-1">
                    Qualify prospects in the <strong>Data</strong> and <strong>INTERESTED</strong> tabs to log your first winning conversion!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {closedLeads.map((lead) => {
                    const closedResp = lead.responses?.find((r) => r.outcome === "CLOSED") ||
                      (lead.responses && lead.responses.length > 0 ? lead.responses[lead.responses.length - 1] : null);

                    return (
                      <div
                        key={lead.id}
                        className="bg-white dark:bg-zinc-900 rounded-xl border border-emerald-200 dark:border-emerald-900/40 p-5 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Seq #{lead.sequenceNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                            🏆 Deal Won
                          </span>
                        </div>

                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          {lead.businessName}
                        </h4>

                        <div className="text-xs text-slate-600 dark:text-zinc-300 space-y-1">
                          <p>Contact: {lead.contactPerson || "Authorized Signatory"}</p>
                          <p className="font-mono">Phone: {lead.phone}</p>
                        </div>

                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                              Deal Contract Value:
                            </span>
                            <span className="font-black text-emerald-900 dark:text-emerald-200 text-sm">
                              ₹{(closedResp?.dealValue || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          {closedResp?.notes && (
                            <p className="text-[11px] text-slate-600 dark:text-zinc-300 mt-1 italic">
                              &quot;{closedResp.notes}&quot;
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 7: NOTICE (OFFICIAL CIRCULARS & PITCH SCRIPTS)            */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === "notice" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-rose-900 dark:text-rose-300 flex items-center gap-2">
                    <Megaphone size={18} className="text-rose-600" />
                    <span>Senior Tele-Marketing Notice Board & Guidance Circulars</span>
                  </h3>
                  <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
                    Official operational targets, pitch scripts, objection handling playbooks, and incentive policies.
                  </p>
                </div>
              </div>

              {/* Filters toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {["ALL", "TARGET", "ANNOUNCEMENT", "SCRIPT", "INCENTIVE", "COMPLIANCE"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNoticeCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      noticeCategory === cat
                        ? "bg-[#003153] text-white"
                        : "bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Notices List */}
              <div className="space-y-4">
                {filteredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        {notice.pinned && (
                          <Pin size={14} className="text-rose-500 rotate-45 shrink-0" />
                        )}
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          {notice.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 uppercase">
                          {notice.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(notice.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Issued by: {notice.author}</span>
                      {notice.category === "SCRIPT" && (
                        <button
                          onClick={() => handleCopy(notice.content, notice.id)}
                          className="px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950/40 text-[#003153] dark:text-sky-300 hover:bg-sky-100 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === notice.id ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedId === notice.id ? "Script Copied!" : "Copy Pitch Script"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE CALL LOGGER MODAL / STATION                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedLeadForCall && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div
              style={{ backgroundColor: "#003153" }}
              className="p-5 text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall size={20} className="text-emerald-300" />
                <div>
                  <h3 className="font-black text-base text-white">
                    Tele-Calling Station & Log Response
                  </h3>
                  <span className="text-xs text-sky-200">
                    Lead Seq #{selectedLeadForCall.sequenceNumber} &bull; {selectedLeadForCall.campaignName}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedLeadForCall(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveCallResponse} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Client Details Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white">
                      {selectedLeadForCall.businessName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Contact: {selectedLeadForCall.contactPerson || "Authorized Signatory"} &bull; {selectedLeadForCall.city || "India"}
                    </p>
                  </div>
                  <a
                    href={`tel:${selectedLeadForCall.phone}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Phone size={13} />
                    <span>Dial {selectedLeadForCall.phone}</span>
                  </a>
                </div>
              </div>

              {/* Call Outcome Selector */}
              <div className="space-y-2">
                <label className="font-bold text-xs text-slate-800 dark:text-zinc-200">
                  Select Call Outcome *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { val: "INTERESTED", label: "🟢 INTERESTED", desc: "Showed interest in services" },
                    { val: "FOLLOW_UP_REQUIRED", label: "🟡 FOLLOW UP REQUIRED", desc: "Callback scheduled" },
                    { val: "CLOSED", label: "🏆 CLOSED (Won!)", desc: "Deal converted" },
                    { val: "NOT_INTERESTED", label: "🔴 NOT INTERESTED", desc: "Declined offer" },
                    { val: "NO_ANSWER", label: "⚪ NO ANSWER", desc: "Ringing / unanswered" },
                    { val: "WRONG_NUMBER", label: "⚪ WRONG NUMBER", desc: "Invalid phone record" },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setCallOutcome(item.val as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        callOutcome === item.val
                          ? "border-[#003153] bg-sky-50 dark:bg-sky-950/40 ring-2 ring-[#003153]/30"
                          : "border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <span className="font-black text-xs block text-slate-900 dark:text-white">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Fields based on Outcome */}
              {callOutcome === "FOLLOW_UP_REQUIRED" && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
                  <span className="font-bold text-xs text-blue-900 dark:text-blue-300 block">
                    Callback Scheduling Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                        Follow-up Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                        Follow-up Reminder Note
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Call back at 3 PM after partner meeting"
                        value={followUpNote}
                        onChange={(e) => setFollowUpNote(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {callOutcome === "CLOSED" && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 block">
                    Won Contract Deal Value
                  </span>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold text-xs mb-1">
                      Agreed Deal Value (₹ INR) *
                    </label>
                    <div className="relative">
                      <IndianRupee
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                      />
                      <input
                        type="number"
                        placeholder="e.g. 35000"
                        value={dealValue}
                        onChange={(e) => setDealValue(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none font-bold text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Call Notes Textarea */}
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-slate-800 dark:text-zinc-200 block">
                  Detailed Call Conversation Notes *
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail client requirement, key objections discussed, current GST / corporate compliance setup, and agreed next steps..."
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none text-xs focus:ring-2 focus:ring-[#003153]"
                  required
                />
              </div>

              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedLeadForCall(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#003153] hover:bg-[#014d7a] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Save Call Response & Advance Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPortal;
