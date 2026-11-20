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
  MessageSquare,
  Target,
  Trophy,
  PartyPopper,
} from "lucide-react";
import {
  Lead,
  LeadResponse,
  Campaign,
  StaffMember,
  StaffNotice,
  StaffTarget,
  STAFF_ROLES,
  getStoredCampaigns,
  getStoredLeads,
  getStoredStaff,
  getStoredNotices,
  saveLeads,
  addLeadResponse,
  updateLeadStatus,
  getStaffTargetForMonth,
  getCurrentMonthKey,
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

  // Sequential Single-Number Calling Console State (matches reference images)
  const [activeSequentialLeadId, setActiveSequentialLeadId] = useState<string | null>(null);
  const [isRecordingResponse, setIsRecordingResponse] = useState(true);
  const [activeOutcomeOption, setActiveOutcomeOption] = useState<string>("INTERESTED");
  const [activeDealValue, setActiveDealValue] = useState<string>("");
  const [activeNotes, setActiveNotes] = useState<string>("");
  const [activeFollowUpDate, setActiveFollowUpDate] = useState<string>("");
  const [copiedActivePhone, setCopiedActivePhone] = useState(false);
  const [sequentialSuccessToast, setSequentialSuccessToast] = useState<string | null>(null);

  // Monthly Target & Celebratory Party Poppers State
  const [showTargetBriefingModal, setShowTargetBriefingModal] = useState<boolean>(true);
  const [celebrationActive, setCelebrationActive] = useState<boolean>(false);
  const [celebrationToast, setCelebrationToast] = useState<{
    dealValue: number;
    newClosedCount: number;
    targetCount: number;
    businessName: string;
    motivationalQuote: string;
  } | null>(null);

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
      (l) => l.outcome === "FOLLOW_UP_REQUIRED" || (l.status === "RESPONSE_PENDING" && l.outcome !== "INTERESTED")
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
    return leads.filter((l) => l.outcome === "CLOSED" || l.responses?.some((r) => r.outcome === "CLOSED"));
  }, [leads]);

  // Monthly Target & Achievement calculation
  const currentMonthKey = useMemo(() => getCurrentMonthKey(), []);
  const currentStaffTarget = useMemo(() => {
    const staffKey = currentStaff.id || currentStaff.employeeId || "staff_tx_m_00020";
    return getStaffTargetForMonth(staffKey, currentMonthKey);
  }, [currentStaff, currentMonthKey, leads]);

  const currentMonthClosedDeals = useMemo(() => {
    return closedLeads.length;
  }, [closedLeads]);

  const targetAchievementPct = useMemo(() => {
    return currentStaffTarget.dealsTarget > 0
      ? Math.round((currentMonthClosedDeals / currentStaffTarget.dealsTarget) * 100)
      : 0;
  }, [currentMonthClosedDeals, currentStaffTarget]);

  // Deal closed celebration trigger
  const triggerDealCelebration = (dealVal: number, businessName: string) => {
    const nextClosed = currentMonthClosedDeals + 1;
    const targetCount = currentStaffTarget.dealsTarget || 10;

    const motivationalQuotes = [
      "Incredible achievement! Your persuasion and sales execution have unlocked another valuable client for TrioTax!",
      "Outstanding performance! Another deal closed and revenue won. Your hard work and persistent follow-ups are paying off brilliantly!",
      "Spectacular conversion! You are setting the benchmark for tele-marketing excellence. Keep up this unstoppable momentum!",
      "Phenomenal closing! You successfully converted a key enterprise prospect. Management deeply appreciates your winning spirit!",
      "Stellar victory! Your clarity and consultative guidance won the client's complete trust. Onward to smashing the monthly target!"
    ];
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    setCelebrationActive(true);
    setCelebrationToast({
      dealValue: dealVal,
      newClosedCount: nextClosed,
      targetCount,
      businessName,
      motivationalQuote: quote,
    });

    // Native audio celebration chime (no external audio files needed)
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = freq;
          osc.type = "sine";
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.09);
          osc.stop(ctx.currentTime + idx * 0.09 + 0.35);
        });
      }
    } catch {}

    setTimeout(() => setCelebrationActive(false), 6000);
    setTimeout(() => setCelebrationToast(null), 9000);
  };

  // Quick close deal directly from pipeline cards
  const handleQuickCloseDeal = (lead: Lead) => {
    const promptVal = prompt(`Enter closed deal revenue value for "${lead.businessName}" (₹):`, "25000");
    if (promptVal === null) return;
    const val = parseFloat(promptVal) || 25000;

    addLeadResponse(lead.id, {
      userId: currentStaff.id,
      userName: currentStaff.name,
      outcome: "CLOSED",
      notes: "Deal closed and contracted! Client onboarded with statutory compliance retainer.",
      dealValue: val,
    });
    updateLeadStatus(lead.id, "COMPLETED", "CLOSED", currentStaff.id, currentStaff.name);
    triggerDealCelebration(val, lead.businessName);
    refreshData();
  };

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

  // Sorted queue of all leads by sequenceNumber
  const sortedQueueLeads = useMemo(() => {
    let list = [...leads];
    if (campaignFilter !== "all") {
      list = list.filter((l) => l.campaignName.toLowerCase() === campaignFilter.toLowerCase());
    }
    return list.sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0));
  }, [leads, campaignFilter]);

  // Current Active Lead (Strictly ONLY ONE lead is active with visible number)
  const currentActiveLead = useMemo(() => {
    if (activeSequentialLeadId) {
      const found = sortedQueueLeads.find((l) => l.id === activeSequentialLeadId);
      if (found) return found;
    }
    // Pick the first lead that is not yet completed
    const firstUnfinished = sortedQueueLeads.find(
      (l) => l.status !== "COMPLETED" && (!l.outcome || l.status === "RESPONSE_PENDING")
    );
    return firstUnfinished || sortedQueueLeads[0] || null;
  }, [sortedQueueLeads, activeSequentialLeadId]);

  // Completed leads for recently completed panel (sorted reverse chronological)
  const completedQueueLeads = useMemo(() => {
    return sortedQueueLeads
      .filter((l) => l.status === "COMPLETED" || (l.outcome && l.status !== "RESPONSE_PENDING"))
      .sort((a, b) => {
        const timeA = a.responses?.[0]?.createdAt || a.updatedAt || "";
        const timeB = b.responses?.[0]?.createdAt || b.updatedAt || "";
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      });
  }, [sortedQueueLeads]);

  // Locked upcoming leads (strictly after the active lead in sequence)
  const lockedUpcomingLeads = useMemo(() => {
    if (!currentActiveLead) return [];
    return sortedQueueLeads.filter(
      (l) =>
        (l.sequenceNumber || 0) > (currentActiveLead.sequenceNumber || 0) &&
        l.status !== "COMPLETED" &&
        !l.outcome
    );
  }, [sortedQueueLeads, currentActiveLead]);

  // Campaign Progress Metrics for Top Bar
  const campaignProgressMetrics = useMemo(() => {
    const total = sortedQueueLeads.length;
    const completed = completedQueueLeads.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const interested = sortedQueueLeads.filter((l) => l.outcome === "INTERESTED").length;
    let revenue = 0;
    sortedQueueLeads.forEach((l) => {
      l.responses?.forEach((r) => {
        if (r.dealValue) revenue += r.dealValue;
      });
    });
    return {
      total,
      completed,
      percent,
      totalCalls: myStaffCalls.length,
      interested,
      revenue,
    };
  }, [sortedQueueLeads, completedQueueLeads, myStaffCalls]);

  const handleCallCurrentActivePhone = () => {
    if (!currentActiveLead) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentActiveLead.phone);
      setCopiedActivePhone(true);
      setTimeout(() => setCopiedActivePhone(false), 2500);
    }
  };

  const handleCallNextMarkLater = () => {
    if (!currentActiveLead) return;
    updateLeadStatus(currentActiveLead.id, "RESPONSE_PENDING");

    // Advance to next lead in sequence
    const nextLead = sortedQueueLeads.find(
      (l) =>
        (l.sequenceNumber || 0) > (currentActiveLead.sequenceNumber || 0) &&
        l.status !== "COMPLETED" &&
        l.id !== currentActiveLead.id
    );

    if (nextLead) {
      setActiveSequentialLeadId(nextLead.id);
    } else {
      const anyRemaining = sortedQueueLeads.find(
        (l) => l.status !== "COMPLETED" && l.id !== currentActiveLead.id
      );
      if (anyRemaining) setActiveSequentialLeadId(anyRemaining.id);
    }

    setActiveNotes("");
    setActiveDealValue("");
    setActiveFollowUpDate("");
  };

  const handleSaveSequentialResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentActiveLead) return;
    if (!activeNotes.trim()) {
      alert("Please enter Customer Response Notes (Required) describing what was discussed with the client.");
      return;
    }

    let outcomeCode: LeadResponse["outcome"] = "INTERESTED";
    if (activeOutcomeOption === "INTERESTED") outcomeCode = "INTERESTED";
    else if (activeOutcomeOption === "FOLLOW_UP_REQUIRED" || activeOutcomeOption === "CALL_BACK_LATER") outcomeCode = "FOLLOW_UP_REQUIRED";
    else if (activeOutcomeOption === "CLOSED") outcomeCode = "CLOSED";
    else if (activeOutcomeOption === "NO_ANSWER") outcomeCode = "NO_ANSWER";
    else if (activeOutcomeOption === "WRONG_NUMBER") outcomeCode = "WRONG_NUMBER";
    else outcomeCode = "NOT_INTERESTED";

    const val = parseFloat(activeDealValue);

    addLeadResponse(currentActiveLead.id, {
      userId: currentStaff.id,
      userName: currentStaff.name,
      outcome: outcomeCode,
      notes: activeNotes.trim(),
      followUpDate:
        activeOutcomeOption === "FOLLOW_UP_REQUIRED" || activeOutcomeOption === "CALL_BACK_LATER"
          ? activeFollowUpDate
          : undefined,
      dealValue: !isNaN(val) && val > 0 ? val : undefined,
    });

    updateLeadStatus(currentActiveLead.id, "COMPLETED", outcomeCode);

    if (outcomeCode === "CLOSED") {
      triggerDealCelebration(!isNaN(val) && val > 0 ? val : 25000, currentActiveLead.businessName);
    }

    setSequentialSuccessToast(
      `Response saved! Lead #${currentActiveLead.sequenceNumber} moved to ${outcomeCode.replace(/_/g, " ")}. Next sequential lead unlocked.`
    );
    setTimeout(() => setSequentialSuccessToast(null), 3000);

    // Find next lead in sequence
    const nextLead = sortedQueueLeads.find(
      (l) =>
        (l.sequenceNumber || 0) > (currentActiveLead.sequenceNumber || 0) &&
        l.status !== "COMPLETED" &&
        l.id !== currentActiveLead.id
    );

    if (nextLead) {
      setActiveSequentialLeadId(nextLead.id);
    } else {
      const anyRemaining = sortedQueueLeads.find(
        (l) => l.status !== "COMPLETED" && l.id !== currentActiveLead.id
      );
      setActiveSequentialLeadId(anyRemaining ? anyRemaining.id : null);
    }

    setActiveNotes("");
    setActiveDealValue("");
    setActiveFollowUpDate("");
    setActiveOutcomeOption("INTERESTED");
  };

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

    if (callOutcome === "CLOSED") {
      triggerDealCelebration(dealValue ? parseFloat(dealValue) : 25000, selectedLeadForCall.businessName);
    }

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
            {/* Monthly Target Live Tracker Pill */}
            <button
              onClick={() => setShowTargetBriefingModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-black transition-all cursor-pointer shadow-xs"
              title="Click to view full monthly target briefing"
            >
              <Target size={14} className="text-amber-600 dark:text-amber-400" />
              <span>
                Target: {currentMonthClosedDeals} / {currentStaffTarget.dealsTarget} Closed ({targetAchievementPct}%)
              </span>
            </button>

            {/* Calling Pace Tracker */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-medium">
              <span className="text-slate-500 dark:text-zinc-400">Today&apos;s Responses:</span>
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
                    <MessageSquare size={14} />
                    <span>Take Response &rarr;</span>
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

              {/* Monthly Target Quota Progress Tracker */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-xl border border-amber-500/30 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-amber-600 dark:text-amber-400" />
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                        Monthly Deal Closing Quota ({currentMonthKey})
                      </span>
                      <span className="text-xs text-amber-800 dark:text-amber-300">
                        Target allocated by Admin: {currentStaffTarget.dealsTarget} Closed Deals
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-amber-700 dark:text-amber-300">
                      {currentMonthClosedDeals} / {currentStaffTarget.dealsTarget} Deals Closed ({targetAchievementPct}%)
                    </span>
                    <button
                      onClick={() => setShowTargetBriefingModal(true)}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      View Briefing
                    </button>
                  </div>
                </div>

                <div className="w-full h-3 bg-amber-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(targetAchievementPct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                  <span>
                    {Math.max(0, currentStaffTarget.dealsTarget - currentMonthClosedDeals)} more closed deals to achieve monthly target!
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Won Deal Revenue: ₹{dashboardMetrics.totalWonRevenue.toLocaleString("en-IN")}
                  </span>
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
                      No responses logged yet today. Go to the Data tab to view contacts, call manually from your phone, and record customer responses.
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
          {/* TAB 2: DATA (SEQUENTIAL SINGLE-NUMBER CALLING CONSOLE)        */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === "data" && (
            <div className="space-y-6">
              {/* Campaign Filter & Refresh Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Campaign Scope:</span>
                  <select
                    value={campaignFilter}
                    onChange={(e) => setCampaignFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="all">All Campaigns ({leads.length} Leads)</option>
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshData}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={13} />
                    <span>Sync Leads</span>
                  </button>
                </div>
              </div>

              {/* Toast message if present */}
              {sequentialSuccessToast && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{sequentialSuccessToast}</span>
                </div>
              )}

              {/* Top Banner: Current Campaign Progress (matching media_1795167190083_ae20e2fc.jpg) */}
              <div className="bg-[#002744] text-white rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 block mb-1">
                      CURRENT CAMPAIGN PROGRESS
                    </span>
                    <h2 className="text-2xl font-black tracking-tight">
                      {campaignProgressMetrics.completed} / {campaignProgressMetrics.total} Leads Completed{" "}
                      <span className="text-base font-semibold text-sky-200">
                        ({campaignProgressMetrics.percent}% Completed)
                      </span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-6 text-right flex-wrap">
                    <div>
                      <span className="text-xs text-sky-200/80 block">Total Calls Logged</span>
                      <span className="text-2xl font-black">{campaignProgressMetrics.totalCalls}</span>
                    </div>
                    <div>
                      <span className="text-xs text-sky-200/80 block">Interested Leads</span>
                      <span className="text-2xl font-black text-emerald-400">
                        {campaignProgressMetrics.interested}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-sky-200/80 block">Revenue Generated</span>
                      <span className="text-2xl font-black text-sky-300">
                        ₹{campaignProgressMetrics.revenue.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#2563eb] h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(campaignProgressMetrics.percent, 100)}%` }}
                  />
                </div>
              </div>

              {/* 2-Column Grid: Left (Active Lead + Locked Queue), Right (Recently Completed Leads) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN: 8 COLS */}
                <div className="lg:col-span-8 space-y-6">
                  {currentActiveLead ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-5">
                      <div className="flex items-start justify-between gap-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
                        <div>
                          <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                            CURRENT ACTIVE LEAD
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                            Complete current lead response or move to next number and record notes later.
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            currentActiveLead.status === "RESPONSE_PENDING"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              : "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                          }`}
                        >
                          {currentActiveLead.status === "RESPONSE_PENDING"
                            ? "RESPONSE PENDING"
                            : `Lead #${String(currentActiveLead.sequenceNumber).padStart(3, "0")}`}
                        </span>
                      </div>

                      {/* Lead Identity Box */}
                      <div className="rounded-xl border border-slate-200 dark:border-zinc-800 p-5 bg-slate-50/50 dark:bg-zinc-800/30 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                              SEQUENCE #{String(currentActiveLead.sequenceNumber).padStart(3, "0")}
                            </span>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                              {currentActiveLead.businessName}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                              {[currentActiveLead.city, currentActiveLead.state, "India"].filter(Boolean).join(", ")}
                            </p>
                          </div>

                          {/* Blue CALL Pill Button (Copies phone to clipboard & triggers phone dialer) */}
                          <button
                            type="button"
                            onClick={handleCallCurrentActivePhone}
                            className="px-6 py-3 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-black text-sm shadow-md hover:shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
                          >
                            <Phone size={16} />
                            <span>
                              {copiedActivePhone ? "COPIED TO CLIPBOARD!" : `CALL: ${currentActiveLead.phone}`}
                            </span>
                          </button>
                        </div>

                        <div className="pt-3 border-t border-slate-200/70 dark:border-zinc-700/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Phone Number</span>
                            <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                              {currentActiveLead.phone}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Email Address</span>
                            <span className="font-semibold text-slate-700 dark:text-zinc-300 truncate block">
                              {currentActiveLead.email || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Contact Person</span>
                            <span className="font-semibold text-slate-700 dark:text-zinc-300">
                              {currentActiveLead.contactPerson || "Authorized Signatory"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Prompt Box */}
                      <div className="rounded-xl border border-sky-200 dark:border-sky-800/60 bg-sky-50/50 dark:bg-sky-950/20 p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="font-black text-xs text-slate-900 dark:text-white">
                              Did you call the customer on your phone?
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                              Choose whether to record response notes immediately, or advance to the next number and mark notes later.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={handleCallNextMarkLater}
                              className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              &rarr; CALL NEXT (MARK LATER)
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsRecordingResponse(true)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 size={13} />
                              <span>RECORD RESPONSE NOW</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Response Recording Form (Matching media_1795167254316_04f9eaaa.png) */}
                      <form onSubmit={handleSaveSequentialResponse} className="rounded-xl border border-slate-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                          <div className="flex items-center gap-2 font-black text-xs text-slate-900 dark:text-white">
                            <CheckCircle2 size={15} className="text-emerald-500" />
                            <span>Record Customer Response for Lead #{currentActiveLead.sequenceNumber} ({currentActiveLead.businessName})</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            Response Pending
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                              Response Outcome *
                            </label>
                            <select
                              value={activeOutcomeOption}
                              onChange={(e) => setActiveOutcomeOption(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-medium text-xs outline-none focus:ring-2 focus:ring-blue-500/30"
                            >
                              <option value="INTERESTED">Interested (Potential Prospect)</option>
                              <option value="FOLLOW_UP_REQUIRED">Follow-up Required</option>
                              <option value="NOT_INTERESTED">Not Interested</option>
                              <option value="CLOSED">Deal Closed (Revenue Generated)</option>
                              <option value="CALL_BACK_LATER">Call Back Later</option>
                              <option value="NO_ANSWER">No Answer / Busy</option>
                              <option value="WRONG_NUMBER">Wrong Number</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                              Deal / Revenue Value (₹)
                            </label>
                            <input
                              type="number"
                              placeholder="e.g. 150000"
                              value={activeDealValue}
                              onChange={(e) => setActiveDealValue(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
                            />
                          </div>
                        </div>

                        {(activeOutcomeOption === "FOLLOW_UP_REQUIRED" || activeOutcomeOption === "CALL_BACK_LATER") && (
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                              Scheduled Follow-up Date & Time *
                            </label>
                            <input
                              type="datetime-local"
                              value={activeFollowUpDate}
                              onChange={(e) => setActiveFollowUpDate(e.target.value)}
                              className="w-full max-w-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
                              required
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                            Customer Response Notes (Required) *
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Detail what the customer said (e.g. Asked for quotation, interested in cloud ERP migration)..."
                            value={activeNotes}
                            onChange={(e) => setActiveNotes(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/30 resize-y"
                            required
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                          <button
                            type="button"
                            onClick={handleCallNextMarkLater}
                            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            &rarr; Mark Notes Later & Go to Next Number
                          </button>

                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs shadow-md hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Send size={13} />
                            <span>SAVE RESPONSE & UNLOCK NEXT LEAD</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-12 text-center shadow-xs">
                      <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-3" />
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">All Leads Completed!</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                        You have completed calling and recording responses for all leads in the current campaign queue. Check the INTERESTED and FOLLOW UP tabs to manage your active pipeline.
                      </p>
                    </div>
                  )}

                  {/* Sequential Queue & Lead Progress (Locked Leads) */}
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-4">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                        Sequential Queue & Lead Progress
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        Upcoming leads remain locked and numbers protected until the current lead is completed.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {lockedUpcomingLeads.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-2">No more locked leads in queue.</p>
                      ) : (
                        lockedUpcomingLeads.slice(0, 10).map((lead) => (
                          <div
                            key={lead.id}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <Lock size={14} className="text-slate-400 shrink-0" />
                              <span className="font-bold text-slate-700 dark:text-zinc-300">
                                Lead #{String(lead.sequenceNumber).padStart(3, "0")} (Locked)
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                                • Phone Protected until unlocked
                              </span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200/60 dark:bg-zinc-700/60 px-2.5 py-0.5 rounded">
                              Locked
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: 4 COLS (Recently Completed Leads) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-4 sticky top-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        Recently Completed Leads
                      </h4>
                      <span className="text-[11px] font-bold text-slate-500">
                        {completedQueueLeads.length} total
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-[680px] overflow-y-auto custom-scrollbar">
                      {completedQueueLeads.length === 0 ? (
                        <p className="text-xs text-slate-400 italic p-4 text-center">
                          No completed leads yet. Call the active lead and record response to see history here.
                        </p>
                      ) : (
                        completedQueueLeads.map((lead) => {
                          const lastResp = lead.responses?.[0] || lead.responses?.[lead.responses.length - 1];
                          return (
                            <div
                              key={lead.id}
                              onClick={() => {
                                setActiveSequentialLeadId(lead.id);
                              }}
                              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-1.5 hover:border-blue-400 cursor-pointer transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white truncate">
                                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                  <span className="truncate">
                                    #{String(lead.sequenceNumber).padStart(3, "0")} {lead.businessName}
                                  </span>
                                </div>
                                <span
                                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                                    lead.outcome === "INTERESTED"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                      : lead.outcome === "CLOSED"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                      : lead.outcome === "FOLLOW_UP_REQUIRED"
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                      : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                                  }`}
                                >
                                  {lead.outcome ? lead.outcome.replace(/_/g, " ") : "COMPLETED"}
                                </span>
                              </div>
                              {lastResp?.notes && (
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400 italic line-clamp-2">
                                  &quot;{lastResp.notes}&quot;
                                </p>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
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
                            Follow Up & Log &rarr;
                          </button>
                          <button
                            onClick={() => handleQuickCloseDeal(lead)}
                            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                            title="Directly mark this lead as Closed Deal Won"
                          >
                            <Trophy size={13} />
                            <span>Close Deal</span>
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

                        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-2">
                          <button
                            onClick={() => handleOpenCallModal(lead)}
                            className="flex-1 py-2 bg-[#003153] hover:bg-[#014d7a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                          >
                            <MessageSquare size={13} />
                            <span>Take Follow-up</span>
                          </button>
                          <button
                            onClick={() => handleQuickCloseDeal(lead)}
                            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                            title="Directly mark this follow-up as Closed Deal Won"
                          >
                            <Trophy size={13} />
                            <span>Close Deal</span>
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
                <MessageSquare size={20} className="text-emerald-300" />
                <div>
                  <h3 className="font-black text-base text-white">
                    Take Call Response & Outcome
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white">
                      {selectedLeadForCall.businessName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Contact: {selectedLeadForCall.contactPerson || "Authorized Signatory"} &bull; {selectedLeadForCall.city || "India"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold">
                      <Phone size={13} className="text-emerald-600 dark:text-emerald-400" />
                      <span>{selectedLeadForCall.phone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedLeadForCall.phone, `modal_${selectedLeadForCall.id}`)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                      title="Copy phone number to dial manually from your phone"
                    >
                      {copiedId === `modal_${selectedLeadForCall.id}` ? (
                        <>
                          <Check size={12} className="text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Phone</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 italic">
                  ℹ️ Call this number manually from your mobile/office phone, then record the conversation outcome and notes below.
                </p>
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MONTHLY TARGET BRIEFING POPUP MODAL (ON LOGIN / LOAD)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showTargetBriefingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#003153] via-[#004270] to-[#014d7a] p-6 text-white relative">
              <button
                onClick={() => setShowTargetBriefingModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Dismiss briefing"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold w-fit mb-2">
                <Target size={14} />
                <span>Monthly Target & Performance Quota</span>
              </div>
              <h2 className="text-xl font-black text-white">
                🎯 Monthly Target Briefing
              </h2>
              <p className="text-xs text-slate-200 mt-1">
                Target performance milestones set by TrioTax Administration for {currentMonthKey}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Staff Identification */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#003153] text-white font-black flex items-center justify-center text-sm shadow-xs">
                    {currentStaff.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-black text-sm text-slate-900 dark:text-white block">
                      {currentStaff.name}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      {currentStaff.role || "Senior Tele-Marketing Specialist"}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
                  {currentStaff.employeeId || "TX-M-00020"}
                </span>
              </div>

              {/* Target Deal Progress Card */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Monthly Closed Deals Quota
                  </span>
                  <span className="font-black text-base text-amber-900 dark:text-amber-300">
                    {currentMonthClosedDeals} / {currentStaffTarget.dealsTarget} Deals
                  </span>
                </div>

                <div className="w-full bg-amber-200/60 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(targetAchievementPct, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold">
                  <span>{targetAchievementPct}% Completed</span>
                  <span>
                    {Math.max(0, currentStaffTarget.dealsTarget - currentMonthClosedDeals)} Deals Remaining
                  </span>
                </div>
              </div>

              {/* Secondary Milestones (Calls & Revenue) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Won Revenue Target
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                    ₹{currentStaffTarget.revenueTarget.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                    Current: ₹{dashboardMetrics.totalWonRevenue.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Outbound Calls Target
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                    {currentStaffTarget.callsTarget} Dials
                  </span>
                  <span className="text-[10px] text-sky-600 font-bold block mt-0.5">
                    Logged: {dashboardMetrics.myTotalCalls} Dials
                  </span>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                <p className="font-bold text-[#003153] dark:text-sky-300 mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Management Message:</span>
                </p>
                <p className="italic">
                  &quot;Welcome to your shift, {currentStaff.name}! Management has set a monthly target of {currentStaffTarget.dealsTarget} closed deals for you. Every call is an opportunity to qualify high-ticket corporate clients and create impact. Every closed deal is celebrated system-wide with real-time target updates ({currentMonthClosedDeals}/{currentStaffTarget.dealsTarget})!&quot;
                </p>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => setShowTargetBriefingModal(false)}
                className="w-full py-3 bg-[#003153] hover:bg-[#014d7a] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} className="text-amber-300" />
                <span>Let&apos;s Go & Smash Target! &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* NON-BLOCKING PARTY POPPERS / CONFETTI CELEBRATION OVERLAY      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {celebrationActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Confetti & Party Popper Particle Elements */}
          {Array.from({ length: 42 }).map((_, i) => {
            const emojis = ["🎉", "🎊", "🏆", "✨", "💥", "🥳", "🎈", "🌟", "💎", "🎯"];
            const emoji = emojis[i % emojis.length];
            const leftPercent = (i * 2.4 + (i % 3) * 3) % 100;
            const delay = (i * 0.12) % 2.5;
            const duration = 2.5 + ((i % 5) * 0.5);
            const size = 20 + ((i % 4) * 8);

            return (
              <span
                key={i}
                className="absolute select-none pointer-events-none text-2xl"
                style={{
                  left: `${leftPercent}%`,
                  bottom: "-40px",
                  fontSize: `${size}px`,
                  animation: `partyPopperFloat ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s infinite`,
                }}
              >
                {emoji}
              </span>
            );
          })}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FLOATING MOTIVATIONAL DEAL CLOSED TOAST / CELEBRATION BANNER   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {celebrationToast && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full bg-gradient-to-br from-[#003153] via-[#004270] to-[#014d7a] text-white p-5 rounded-2xl shadow-2xl border-2 border-amber-400 animate-slideInRight pointer-events-auto">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <PartyPopper size={22} className="animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest block">
                  🎯 DEAL CLOSED & TARGET ADVANCED!
                </span>
                <h4 className="font-black text-sm text-white">
                  🎉 Outstanding Achievement, {currentStaff.name}!
                </h4>
              </div>
            </div>
            <button
              onClick={() => setCelebrationToast(null)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-xs text-sky-100 italic leading-relaxed">
              &quot;{celebrationToast.motivationalQuote}&quot;
            </p>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs font-black">
              <span className="text-slate-200">Monthly Target Progress:</span>
              <span className="text-amber-300 text-sm">
                {celebrationToast.newClosedCount} / {celebrationToast.targetCount} Deals Closed (
                {Math.min(
                  100,
                  Math.round((celebrationToast.newClosedCount / celebrationToast.targetCount) * 100)
                )}
                %)
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold pt-1">
              <span>Client: {celebrationToast.businessName}</span>
              <span>+₹{celebrationToast.dealValue.toLocaleString("en-IN")} Won</span>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS keyframe styles for Party Poppers animation */}
      <style>{`
        @keyframes partyPopperFloat {
          0% {
            transform: translateY(0) scale(0.5) rotate(0deg);
            opacity: 1;
          }
          40% {
            transform: translateY(-50vh) scale(1.3) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh) scale(0.9) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes slideInRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default StaffPortal;
