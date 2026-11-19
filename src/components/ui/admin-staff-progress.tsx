import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  PhoneCall,
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
  Download,
  Filter,
  Search,
  IndianRupee,
  Flame,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Database,
  RefreshCw,
  BarChart2,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  Lead,
  LeadResponse,
  StaffMember,
  getStoredLeads,
  getStoredStaff,
  pushMarketingToDatabase,
  syncMarketingWithDatabase,
} from "@/lib/marketing-data";

export const AdminStaffProgress: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  // Sub tabs: "marketing" | "sales" | "compliance"
  const [activeSubTab, setActiveSubTab] = useState<"marketing" | "sales" | "compliance">("marketing");

  // Selected staff member for drilldown inspection
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // Filters for drilldown call log
  const [callSearchQuery, setCallSearchQuery] = useState("");
  const [callOutcomeFilter, setCallOutcomeFilter] = useState("all");
  const [callDateFilter, setCallDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  // Cloud DB sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const refreshData = () => {
    const l = getStoredLeads();
    const s = getStoredStaff();
    setLeads(l);
    setStaffList(s);
    if (!selectedStaffId && s.length > 0) {
      setSelectedStaffId(s[0].id);
    }
  };

  useEffect(() => {
    refreshData();
    // Also perform initial cloud sync
    syncMarketingWithDatabase().then(() => refreshData());

    const handleUpdate = () => refreshData();
    window.addEventListener("triotax_marketing_updated", handleUpdate);
    return () => window.removeEventListener("triotax_marketing_updated", handleUpdate);
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus("Syncing with PostgreSQL database...");
    const res = await pushMarketingToDatabase();
    setIsSyncing(false);
    if (res.success) {
      setSyncStatus("✅ All marketing leads & staff calling records persisted to database!");
    } else {
      setSyncStatus("ℹ️ Local database synced. Server note: " + (res.message || "Ready"));
    }
    setTimeout(() => setSyncStatus(null), 4000);
  };

  // Selected staff object
  const activeStaff = useMemo(() => {
    return staffList.find((s) => s.id === selectedStaffId) || staffList[0] || null;
  }, [staffList, selectedStaffId]);

  // Overall Team Tele-Calling Metrics
  const teamMetrics = useMemo(() => {
    let totalCalls = 0;
    let callsToday = 0;
    let interested = 0;
    let closed = 0;
    let followUps = 0;
    let totalWonRevenue = 0;

    const todayStr = new Date().toISOString().split("T")[0];

    leads.forEach((l) => {
      l.responses?.forEach((r) => {
        totalCalls++;
        if (r.createdAt && r.createdAt.startsWith(todayStr)) {
          callsToday++;
        }
        if (r.outcome === "INTERESTED") interested++;
        if (r.outcome === "CLOSED") {
          closed++;
          if (r.dealValue) totalWonRevenue += r.dealValue;
        }
        if (r.outcome === "FOLLOW_UP_REQUIRED") followUps++;
      });
    });

    const conversionRate = totalCalls > 0 ? Math.round((closed / totalCalls) * 100) : 0;

    return {
      totalCalls,
      callsToday,
      interested,
      closed,
      followUps,
      totalWonRevenue,
      conversionRate,
      activeStaffCount: staffList.length,
    };
  }, [leads, staffList]);

  // Individual staff progress calculation
  const staffProgressList = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    return staffList.map((staff) => {
      const assigned = leads.filter((l) => l.assignedToId === staff.id);
      let staffCalls: Array<{ lead: Lead; response: LeadResponse }> = [];
      let todayCalls = 0;
      let interestedCount = 0;
      let closedCount = 0;
      let followUpCount = 0;
      let otherCount = 0;
      let revenue = 0;

      leads.forEach((l) => {
        l.responses?.forEach((r) => {
          if (r.userId === staff.id) {
            staffCalls.push({ lead: l, response: r });
            if (r.createdAt && r.createdAt.startsWith(todayStr)) {
              todayCalls++;
            }
            if (r.outcome === "INTERESTED") interestedCount++;
            else if (r.outcome === "CLOSED") {
              closedCount++;
              if (r.dealValue) revenue += r.dealValue;
            } else if (r.outcome === "FOLLOW_UP_REQUIRED") {
              followUpCount++;
            } else {
              otherCount++;
            }
          }
        });
      });

      const conversion = staffCalls.length > 0 ? Math.round((closedCount / staffCalls.length) * 100) : 0;

      return {
        staff,
        assignedCount: assigned.length,
        totalCalls: staffCalls.length,
        todayCalls,
        interestedCount,
        closedCount,
        followUpCount,
        otherCount,
        revenue,
        conversion,
        allCalls: staffCalls,
      };
    });
  }, [staffList, leads]);

  // Calls made by the currently selected staff member, filtered
  const activeStaffCalls = useMemo(() => {
    if (!activeStaff) return [];
    const calls: Array<{ lead: Lead; response: LeadResponse }> = [];

    leads.forEach((l) => {
      l.responses?.forEach((r) => {
        if (r.userId === activeStaff.id) {
          calls.push({ lead: l, response: r });
        }
      });
    });

    // Sort descending by call time
    calls.sort((a, b) => new Date(b.response.createdAt).getTime() - new Date(a.response.createdAt).getTime());

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    return calls.filter(({ lead, response }) => {
      // Date filter
      if (callDateFilter === "today") {
        if (!response.createdAt.startsWith(todayStr)) return false;
      } else if (callDateFilter === "week") {
        const d = new Date(response.createdAt);
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      } else if (callDateFilter === "month") {
        const d = new Date(response.createdAt);
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 30) return false;
      }

      // Outcome filter
      if (callOutcomeFilter !== "all" && response.outcome !== callOutcomeFilter) {
        return false;
      }

      // Search query
      if (callSearchQuery.trim()) {
        const q = callSearchQuery.toLowerCase().trim();
        const matches =
          lead.businessName.toLowerCase().includes(q) ||
          (lead.contactPerson && lead.contactPerson.toLowerCase().includes(q)) ||
          lead.phone.toLowerCase().includes(q) ||
          response.notes.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [activeStaff, leads, callDateFilter, callOutcomeFilter, callSearchQuery]);

  // Export progress audit report
  const handleExportStaffProgress = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      system: "TrioTax Marketing CRM & Staff Work Progress",
      summary: teamMetrics,
      staffPerformance: staffProgressList.map((item) => ({
        employeeId: item.staff.employeeId,
        name: item.staff.name,
        email: item.staff.email,
        role: item.staff.role,
        assignedLeads: item.assignedCount,
        totalCallsMade: item.totalCalls,
        callsToday: item.todayCalls,
        interestedLeads: item.interestedCount,
        closedDeals: item.closedCount,
        wonRevenue: item.revenue,
        conversionRate: `${item.conversion}%`,
        callLog: item.allCalls.map((c) => ({
          businessName: c.lead.businessName,
          contactPerson: c.lead.contactPerson,
          phone: c.lead.phone,
          calledAt: c.response.createdAt,
          outcome: c.response.outcome,
          notes: c.response.notes,
          followUpDate: c.response.followUpDate,
          dealValue: c.response.dealValue,
        })),
      })),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `TrioTax_Staff_Progress_Report_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Banner / Title Bar in Prussian Blue #003153 */}
      <div className="bg-gradient-to-r from-[#003153] to-[#014d7a] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-200 border border-white/15 mb-2">
            <TrendingUp size={14} className="text-sky-300" />
            <span>Staff Productivity & Audit Tracking</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Progress & Tele-Calling Audit</h2>
          <p className="text-sm text-sky-100/80 mt-1 max-w-2xl">
            Monitor real-time calling activity, outbound reach, deal conversions, and detailed call logs for every individual marketing team member.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            title="Force synchronization with PostgreSQL database"
          >
            <Database size={15} className={isSyncing ? "animate-pulse" : ""} />
            <span>Sync with Database</span>
          </button>
          <button
            onClick={handleExportStaffProgress}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download size={15} />
            <span>Export Progress Report</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Sub Tabs Navigation: Marketing, Sales, Compliance */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveSubTab("marketing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "marketing"
              ? "bg-[#003153] text-white shadow-xs"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          <PhoneCall size={14} />
          <span>Marketing Tele-Calling ({staffList.length} Staff)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("sales")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "sales"
              ? "bg-[#003153] text-white shadow-xs"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          <Building2 size={14} />
          <span>Sales & Client Accounts</span>
        </button>

        <button
          onClick={() => setActiveSubTab("compliance")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "compliance"
              ? "bg-[#003153] text-white shadow-xs"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          <ShieldCheck size={14} />
          <span>Statutory Compliance Filing</span>
        </button>
      </div>

      {/* SUB TAB 1: MARKETING TELE-CALLING PROGRESS */}
      {activeSubTab === "marketing" && (
        <div className="space-y-6">
          {/* Executive Overview KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                Total Calls Logged
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {teamMetrics.totalCalls}
                </span>
                <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">All-Time</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                Calls Made Today
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {teamMetrics.callsToday}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600/80">Active Dials</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                Interested Leads
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {teamMetrics.interested}
                </span>
                <span className="text-[11px] font-semibold text-amber-600/80">Hot Pipeline</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                Follow-ups Scheduled
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {teamMetrics.followUps}
                </span>
                <span className="text-[11px] font-semibold text-blue-600/80">Pending Call</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                Deals Won / Closed
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {teamMetrics.closed}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600/80">
                  {teamMetrics.conversionRate}% Rate
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                Won Revenue Generated
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 dark:text-white flex items-center">
                  <IndianRupee size={15} />
                  {teamMetrics.totalWonRevenue.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">Pipeline</span>
              </div>
            </div>
          </div>

          {/* Individual Staff Performance Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Individual Staff Calling Progress & Activity
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Click on any staff member below to inspect their full conversation history, detailed call notes, and follow-up schedules.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 font-bold border-b border-slate-200 dark:border-zinc-800">
                      <th className="p-3">Employee ID</th>
                      <th className="p-3">Staff Member</th>
                      <th className="p-3 text-center">Assigned</th>
                      <th className="p-3 text-center">Total Calls</th>
                      <th className="p-3 text-center">Calls Today</th>
                      <th className="p-3 text-center">Interested</th>
                      <th className="p-3 text-center">Follow-ups</th>
                      <th className="p-3 text-center">Deals Closed</th>
                      <th className="p-3 text-right">Won Deal Value</th>
                      <th className="p-3 text-center">Conversion</th>
                      <th className="p-3 text-right">Work Log Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {staffProgressList.map((item) => {
                      const isSelected = item.staff.id === selectedStaffId;
                      return (
                        <tr
                          key={item.staff.id}
                          onClick={() => setSelectedStaffId(item.staff.id)}
                          className={`hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors ${
                            isSelected ? "bg-sky-50/50 dark:bg-sky-950/25 border-l-4 border-l-sky-600" : ""
                          }`}
                        >
                          <td className="p-3">
                            <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                              {item.staff.employeeId || "TX-M-00020"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{item.staff.name}</span>
                              {isSelected && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500 text-white font-semibold">
                                  Inspecting
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{item.staff.role}</div>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-700 dark:text-zinc-300">
                            {item.assignedCount}
                          </td>
                          <td className="p-3 text-center">
                            <span className="font-black text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800">
                              {item.totalCalls} Dials
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`font-black px-2 py-0.5 rounded text-xs ${
                                item.todayCalls > 0
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "text-slate-400"
                              }`}
                            >
                              {item.todayCalls}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-amber-600 dark:text-amber-400">
                            {item.interestedCount}
                          </td>
                          <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">
                            {item.followUpCount}
                          </td>
                          <td className="p-3 text-center font-black text-emerald-600 dark:text-emerald-400">
                            {item.closedCount}
                          </td>
                          <td className="p-3 text-right font-black text-slate-900 dark:text-white">
                            ₹{item.revenue.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3 text-center font-bold text-slate-800 dark:text-zinc-200">
                            {item.conversion}%
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStaffId(item.staff.id);
                              }}
                              className="px-2.5 py-1 bg-[#003153] hover:bg-[#014d7a] text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>Inspect Calls</span>
                              <ChevronRight size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Detailed Call Inspection Section for Selected Staff */}
          {activeStaff && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#003153] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {activeStaff.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        {activeStaff.employeeId || "TX-M-00020"}
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        {activeStaff.name}
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">
                        🟢 Active Tele-Caller
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      {activeStaff.role} &bull; {activeStaff.email} &bull; Phone: {activeStaff.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Score badge summary for this staff */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Dials</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {activeStaffCalls.length}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Deals Won</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {activeStaffCalls.filter((c) => c.response.outcome === "CLOSED").length}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Won Revenue</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ₹
                      {activeStaffCalls
                        .reduce((acc, c) => acc + (c.response.dealValue || 0), 0)
                        .toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter controls for the individual call log */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
                {/* Search */}
                <div className="md:col-span-4 relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search calls by business, contact, notes..."
                    value={callSearchQuery}
                    onChange={(e) => setCallSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                {/* Date range filter */}
                <div className="md:col-span-4 flex items-center gap-1 bg-slate-50 dark:bg-zinc-800 p-1 rounded-lg border border-slate-200 dark:border-zinc-700">
                  {(["all", "today", "week", "month"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setCallDateFilter(period)}
                      className={`flex-1 py-1 px-2 rounded-md font-bold capitalize transition-all cursor-pointer ${
                        callDateFilter === period
                          ? "bg-[#003153] text-white shadow-xs"
                          : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
                      }`}
                    >
                      {period === "all" ? "All Time" : period === "week" ? "Last 7 Days" : period}
                    </button>
                  ))}
                </div>

                {/* Outcome filter */}
                <div className="md:col-span-4">
                  <select
                    value={callOutcomeFilter}
                    onChange={(e) => setCallOutcomeFilter(e.target.value)}
                    className="w-full py-2 px-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="all">All Outcomes ({activeStaffCalls.length})</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="FOLLOW_UP_REQUIRED">Follow-up Required</option>
                    <option value="CLOSED">Closed (Won!)</option>
                    <option value="NOT_INTERESTED">Not Interested</option>
                    <option value="NO_ANSWER">No Answer / Ringing</option>
                    <option value="WRONG_NUMBER">Wrong Number</option>
                  </select>
                </div>
              </div>

              {/* Call Records Audit Timeline */}
              <div className="space-y-3">
                <span className="font-bold text-slate-900 dark:text-white text-xs block">
                  Tele-Calling Work Logs ({activeStaffCalls.length} calls recorded)
                </span>

                {activeStaffCalls.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
                    No calling activity found matching this filter for {activeStaff.name}.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeStaffCalls.map(({ lead, response }) => (
                      <div
                        key={response.id}
                        className="p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700 space-y-2 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-slate-200/50 dark:border-zinc-700/50">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200">
                              Seq #{lead.sequenceNumber}
                            </span>
                            <span className="font-black text-slate-900 dark:text-white text-sm">
                              {lead.businessName}
                            </span>
                            <span className="text-slate-500 text-[11px]">
                              ({lead.contactPerson || "Contact"} &bull; {lead.phone})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                response.outcome === "INTERESTED"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : response.outcome === "CLOSED"
                                  ? "bg-emerald-600 text-white"
                                  : response.outcome === "FOLLOW_UP_REQUIRED"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                  : "bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300"
                              }`}
                            >
                              {response.outcome.replace(/_/g, " ")}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(response.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Call summary notes */}
                        <p className="text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                          {response.notes}
                        </p>

                        {/* Metadata row: follow-up or deal value */}
                        {(response.followUpDate || response.dealValue) && (
                          <div className="pt-2 mt-1 border-t border-slate-200/50 dark:border-zinc-700/50 flex items-center justify-between text-[11px]">
                            {response.followUpDate && (
                              <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                                <Clock size={11} />
                                Follow-up: {new Date(response.followUpDate).toLocaleString()}
                                {response.followUpNote ? ` — ${response.followUpNote}` : ""}
                              </span>
                            )}
                            {response.dealValue && response.dealValue > 0 && (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-auto flex items-center">
                                Won Deal Amount: ₹{response.dealValue.toLocaleString("en-IN")}
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
      )}

      {/* SUB TAB 2: SALES & CLIENT ACCOUNTS */}
      {activeSubTab === "sales" && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-8 text-center text-slate-500 dark:text-zinc-400 shadow-xs space-y-3">
          <Building2 size={36} className="mx-auto text-slate-400 dark:text-zinc-600" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Sales Department Progress</h4>
          <p className="text-xs max-w-md mx-auto">
            Sales invoicing, client quotations, and credit note issuance can also be tracked here. Marketing tele-calling feeds directly into the sales invoice generator.
          </p>
        </div>
      )}

      {/* SUB TAB 3: STATUTORY COMPLIANCE FILING */}
      {activeSubTab === "compliance" && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-8 text-center text-slate-500 dark:text-zinc-400 shadow-xs space-y-3">
          <ShieldCheck size={36} className="mx-auto text-slate-400 dark:text-zinc-600" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Statutory Compliance Progress</h4>
          <p className="text-xs max-w-md mx-auto">
            View GST, ROC, TDS, and ITR filing tasks completed across all client company accounts.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminStaffProgress;
