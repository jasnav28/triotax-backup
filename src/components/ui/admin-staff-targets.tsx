import React, { useState, useEffect, useMemo } from "react";
import {
  Target,
  Trophy,
  TrendingUp,
  Award,
  PhoneCall,
  IndianRupee,
  Calendar,
  Save,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  User,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Flame,
} from "lucide-react";
import {
  Lead,
  StaffMember,
  StaffTarget,
  getStoredLeads,
  getStoredStaff,
  getStoredStaffTargets,
  getStaffTargetForMonth,
  setStaffTarget,
  getCurrentMonthKey,
  pushMarketingToDatabase,
  syncMarketingWithDatabase,
} from "@/lib/marketing-data";

export const AdminStaffTargets: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonthKey());
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [targets, setTargets] = useState<StaffTarget[]>([]);

  // Local editing buffer for each staff's targets: { [staffKey: string]: { deals: number; revenue: number; calls: number } }
  const [editBuffer, setEditBuffer] = useState<{
    [key: string]: { deals: number; revenue: number; calls: number };
  }>({});

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const refreshAll = () => {
    const s = getStoredStaff();
    const l = getStoredLeads();
    const t = getStoredStaffTargets();
    setStaffList(s);
    setLeads(l);
    setTargets(t);

    // Populate edit buffer
    const buf: { [key: string]: { deals: number; revenue: number; calls: number } } = {};
    
    // Always include TX-M-00020 if not in list
    const allStaff = [...s];
    if (!allStaff.some((m) => m.employeeId === "TX-M-00020" || m.id === "staff_tx_m_00020")) {
      allStaff.unshift({
        id: "staff_tx_m_00020",
        employeeId: "TX-M-00020",
        name: "Senior Tele-Marketing Specialist",
        email: "telemarketing@triotax.in",
        role: "Senior Tele-Marketing Specialist",
      });
    }

    allStaff.forEach((mem) => {
      const staffKey = mem.id || mem.employeeId;
      const targetObj = getStaffTargetForMonth(staffKey, selectedMonth);
      buf[staffKey] = {
        deals: targetObj.dealsTarget || 10,
        revenue: targetObj.revenueTarget || 150000,
        calls: targetObj.callsTarget || 100,
      };
    });
    setEditBuffer(buf);
  };

  useEffect(() => {
    refreshAll();
    syncMarketingWithDatabase().then(() => refreshAll());

    const handleUpdate = () => refreshAll();
    window.addEventListener("triotax_marketing_updated", handleUpdate);
    return () => window.removeEventListener("triotax_marketing_updated", handleUpdate);
  }, [selectedMonth]);

  // Combined staff list guarantee
  const effectiveStaffList = useMemo(() => {
    const list = [...staffList];
    if (!list.some((m) => m.employeeId === "TX-M-00020" || m.id === "staff_tx_m_00020")) {
      list.unshift({
        id: "staff_tx_m_00020",
        employeeId: "TX-M-00020",
        name: "Senior Tele-Marketing Specialist",
        email: "telemarketing@triotax.in",
        role: "Senior Tele-Marketing Specialist",
      });
    }
    return list;
  }, [staffList]);

  // Performance calculation per staff member
  const staffStats = useMemo(() => {
    const stats: {
      [staffKey: string]: {
        closedDeals: number;
        wonRevenue: number;
        totalCalls: number;
        interested: number;
      };
    } = {};

    effectiveStaffList.forEach((s) => {
      const staffKey = s.id || s.employeeId;
      stats[staffKey] = { closedDeals: 0, wonRevenue: 0, totalCalls: 0, interested: 0 };
    });

    leads.forEach((l) => {
      const assignedId = l.assignedToId;
      const assignedEmp = l.assignedToName;

      // Check responses
      (l.responses || []).forEach((resp) => {
        // Find staff key
        const match = effectiveStaffList.find(
          (s) => s.id === resp.userId || s.name === resp.userName || (s.employeeId && resp.userName?.includes(s.employeeId))
        );
        const key = match ? (match.id || match.employeeId) : (effectiveStaffList[0]?.id || "staff_tx_m_00020");

        if (stats[key]) {
          stats[key].totalCalls += 1;
        }
      });

      if (l.outcome === "CLOSED" || l.status === "COMPLETED") {
        const match = effectiveStaffList.find(
          (s) => s.id === assignedId || s.name === assignedEmp
        ) || effectiveStaffList[0];
        const key = match ? (match.id || match.employeeId) : "staff_tx_m_00020";

        if (stats[key]) {
          stats[key].closedDeals += 1;
          const val = l.responses?.find((r) => r.outcome === "CLOSED")?.dealValue || 0;
          stats[key].wonRevenue += val;
        }
      }

      if (l.outcome === "INTERESTED") {
        const match = effectiveStaffList.find(
          (s) => s.id === assignedId || s.name === assignedEmp
        ) || effectiveStaffList[0];
        const key = match ? (match.id || match.employeeId) : "staff_tx_m_00020";
        if (stats[key]) {
          stats[key].interested += 1;
        }
      }
    });

    return stats;
  }, [effectiveStaffList, leads]);

  // Overall KPI totals
  const overallKPIs = useMemo(() => {
    let totalTargetDeals = 0;
    let totalClosedDeals = 0;
    let totalTargetRev = 0;
    let totalWonRev = 0;

    effectiveStaffList.forEach((s) => {
      const key = s.id || s.employeeId;
      const buf = editBuffer[key] || { deals: 10, revenue: 150000, calls: 100 };
      const st = staffStats[key] || { closedDeals: 0, wonRevenue: 0 };
      totalTargetDeals += buf.deals;
      totalClosedDeals += st.closedDeals;
      totalTargetRev += buf.revenue;
      totalWonRev += st.wonRevenue;
    });

    const achievementPct = totalTargetDeals > 0 ? Math.round((totalClosedDeals / totalTargetDeals) * 100) : 0;

    return {
      totalTargetDeals,
      totalClosedDeals,
      achievementPct,
      totalTargetRev,
      totalWonRev,
    };
  }, [effectiveStaffList, editBuffer, staffStats]);

  const handleBufferChange = (staffKey: string, field: "deals" | "revenue" | "calls", val: number) => {
    setEditBuffer((prev) => ({
      ...prev,
      [staffKey]: {
        ...(prev[staffKey] || { deals: 10, revenue: 150000, calls: 100 }),
        [field]: val,
      },
    }));
  };

  const handleSaveIndividualTarget = async (staffMember: StaffMember) => {
    const staffKey = staffMember.id || staffMember.employeeId;
    const buf = editBuffer[staffKey] || { deals: 10, revenue: 150000, calls: 100 };
    setSavingKey(staffKey);

    setStaffTarget(staffKey, selectedMonth, buf.deals, buf.revenue, buf.calls);

    await pushMarketingToDatabase();
    setSavingKey(null);
    setSaveSuccessMsg(`Target for ${staffMember.name} saved! (${buf.deals} closed deals set for ${selectedMonth})`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleSetAllToTenDeals = async () => {
    const updatedBuf = { ...editBuffer };
    for (const mem of effectiveStaffList) {
      const key = mem.id || mem.employeeId;
      updatedBuf[key] = {
        ...(updatedBuf[key] || { revenue: 150000, calls: 100 }),
        deals: 10,
      };
      setStaffTarget(key, selectedMonth, 10, updatedBuf[key].revenue, updatedBuf[key].calls);
    }
    setEditBuffer(updatedBuf);
    await pushMarketingToDatabase();
    setSaveSuccessMsg(`✅ All staff members updated to 10 Deals Target for ${selectedMonth}!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus("Syncing targets with PostgreSQL database...");
    const res = await pushMarketingToDatabase();
    setIsSyncing(false);
    if (res.success) {
      setSyncStatus("✅ Targets synced & persisted to PostgreSQL database!");
    } else {
      setSyncStatus("ℹ️ Local database synced. Status: " + (res.message || "Ready"));
    }
    setTimeout(() => setSyncStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* HEADER HERO BANNER                                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#003153] via-[#004270] to-[#014d7a] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/10">
              <Target size={14} />
              <span>Staff Quotas & Monthly Targets</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Monthly Deal & Revenue Targets
            </h1>
            <p className="text-sm text-slate-200">
              Set monthly deal closing targets for tele-marketing staff. When staff members log into their portal, an inspiring briefing popup displays their target. As deals close, their counter updates (e.g. 1/10 &rarr; 2/10) with celebration party poppers!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Month Selector */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 text-white">
              <Calendar size={16} className="text-amber-300" />
              <div className="text-left">
                <span className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">Target Month</span>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-sm font-black text-white focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              <span>{isSyncing ? "Syncing DB..." : "Sync Targets"}</span>
            </button>
          </div>
        </div>

        {/* Status notification toast */}
        {(saveSuccessMsg || syncStatus) && (
          <div className="mt-4 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-xs font-bold text-white flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-300" />
              <span>{saveSuccessMsg || syncStatus}</span>
            </div>
            <button
              onClick={() => {
                setSaveSuccessMsg(null);
                setSyncStatus(null);
              }}
              className="text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TEAM KPI METRICS CARDS                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Target Deals */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Team Target Deals</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
              <Target size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {overallKPIs.totalTargetDeals}
            </span>
            <span className="text-xs text-slate-400">Deals Allocated</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Quota set across all active specialists</p>
        </div>

        {/* Deals Closed So Far */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Deals Closed (Won)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <Trophy size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {overallKPIs.totalClosedDeals}
            </span>
            <span className="text-xs text-slate-500">/ {overallKPIs.totalTargetDeals} achieved</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(overallKPIs.achievementPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Target Achievement Rate */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Achievement Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {overallKPIs.achievementPct}%
            </span>
            <span className="text-xs text-slate-400">of Monthly Goal</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Real-time closed deal pacing</p>
        </div>

        {/* Won Revenue Converted */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Won Revenue Generated</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <IndianRupee size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              ₹{overallKPIs.totalWonRev.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Target: ₹{overallKPIs.totalTargetRev.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* QUICK BATCH ACTION TOOLBAR                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Target Presets
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Quickly apply standard monthly performance targets to tele-marketing staff with one click.
            </p>
          </div>
        </div>

        <button
          onClick={handleSetAllToTenDeals}
          className="px-3.5 py-2 bg-[#003153] hover:bg-[#014d7a] active:bg-[#00223a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Award size={14} />
          <span>Apply 10 Deals Target to All Staff</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STAFF TARGETS ALLOCATION TABLE & CARDS                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#003153] dark:text-blue-400" />
              <span>Individual Staff Targets for {selectedMonth}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Set monthly deal quota, target revenue, and target calls for each team member.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-lg">
            {effectiveStaffList.length} Staff Member{effectiveStaffList.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 font-bold border-b border-slate-200 dark:border-zinc-800">
                <th className="p-4">Staff Member & Employee ID</th>
                <th className="p-4">Current Progress</th>
                <th className="p-4 w-36">Monthly Deals Target</th>
                <th className="p-4 w-44">Target Revenue (₹)</th>
                <th className="p-4 w-36">Calls Target</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {effectiveStaffList.map((member) => {
                const staffKey = member.id || member.employeeId;
                const buf = editBuffer[staffKey] || { deals: 10, revenue: 150000, calls: 100 };
                const st = staffStats[staffKey] || { closedDeals: 0, wonRevenue: 0, totalCalls: 0, interested: 0 };
                const pct = buf.deals > 0 ? Math.round((st.closedDeals / buf.deals) * 100) : 0;
                const isSaving = savingKey === staffKey;

                return (
                  <tr key={staffKey} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                    {/* Staff details */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#003153]/10 dark:bg-blue-950/60 flex items-center justify-center text-[#003153] dark:text-blue-400 font-black text-sm">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {member.name}
                            </span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                              {member.employeeId || "TX-M-00020"}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            {member.role || "Senior Tele-Marketing Specialist"} • {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Current progress */}
                    <td className="p-4">
                      <div className="space-y-1.5 max-w-[180px]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black text-slate-800 dark:text-zinc-200">
                            {st.closedDeals} / {buf.deals} Deals
                          </span>
                          <span
                            className={`font-bold text-[11px] ${
                              pct >= 100
                                ? "text-emerald-600 dark:text-emerald-400"
                                : pct >= 50
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              pct >= 100 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          ₹{st.wonRevenue.toLocaleString("en-IN")} Won • {st.totalCalls} Calls logged
                        </span>
                      </div>
                    </td>

                    {/* Monthly deals target input */}
                    <td className="p-4">
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={buf.deals}
                          onChange={(e) =>
                            handleBufferChange(staffKey, "deals", parseInt(e.target.value, 10) || 1)
                          }
                          className="w-full px-3 py-1.5 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg text-xs font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-[#003153] focus:outline-none"
                        />
                        <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold pointer-events-none">
                          deals
                        </span>
                      </div>
                    </td>

                    {/* Target Revenue input */}
                    <td className="p-4">
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400 pointer-events-none">
                          ₹
                        </span>
                        <input
                          type="number"
                          step="5000"
                          min="0"
                          value={buf.revenue}
                          onChange={(e) =>
                            handleBufferChange(staffKey, "revenue", parseFloat(e.target.value) || 0)
                          }
                          className="w-full pl-6 pr-3 py-1.5 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#003153] focus:outline-none"
                        />
                      </div>
                    </td>

                    {/* Calls target input */}
                    <td className="p-4">
                      <div className="relative">
                        <input
                          type="number"
                          min="10"
                          max="2000"
                          step="10"
                          value={buf.calls}
                          onChange={(e) =>
                            handleBufferChange(staffKey, "calls", parseInt(e.target.value, 10) || 10)
                          }
                          className="w-full px-3 py-1.5 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#003153] focus:outline-none"
                        />
                        <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold pointer-events-none">
                          dials
                        </span>
                      </div>
                    </td>

                    {/* Action button */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleSaveIndividualTarget(member)}
                        disabled={isSaving}
                        className="px-3.5 py-1.5 bg-[#003153] hover:bg-[#014d7a] active:bg-[#00223a] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 ml-auto cursor-pointer disabled:opacity-50"
                      >
                        <Save size={13} className={isSaving ? "animate-spin" : ""} />
                        <span>{isSaving ? "Saving..." : "Save Target"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOTIVATIONAL NOTIFICATION & AUDIT FOOTER                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <Sparkles size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-black text-amber-900 dark:text-amber-100">
            🎯 Real-time Motivational Experience for Staff
          </p>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
            Every time a tele-marketing specialist logs in, they receive an inspiring <strong>Monthly Target Briefing</strong> modal displaying their allocated quota (e.g. 10 deals for {selectedMonth}). When they mark a lead as <em>&quot;Deal Closed (Revenue Generated)&quot;</em>, the screen bursts with <strong>celebratory party poppers</strong> and their live target counter updates (e.g. from 1/10 to 2/10) with appreciation lines from management!
          </p>
        </div>
      </div>
    </div>
  );
};
