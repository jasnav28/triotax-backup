import React, { useState, useEffect } from "react";
import {
  Bell,
  Megaphone,
  Pin,
  Trash2,
  Send,
  Sparkles,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";
import {
  StaffNotice,
  StaffMember,
  getStoredNotices,
  createStaffNotice,
  deleteStaffNotice,
  togglePinStaffNotice,
  getStoredStaff,
  pushMarketingToDatabase,
  syncMarketingWithDatabase,
} from "@/lib/marketing-data";

export const AdminStaffNotifications: React.FC = () => {
  const [notices, setNotices] = useState<StaffNotice[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  // Create Notice Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<StaffNotice["category"]>("ANNOUNCEMENT");
  const [priority, setPriority] = useState<StaffNotice["priority"]>("NORMAL");
  const [pinned, setPinned] = useState(false);
  const [author, setAuthor] = useState("TrioTax Administration Desk");
  const [targetRole, setTargetRole] = useState("ALL");

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Status & Sync State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const refreshData = () => {
    setNotices(getStoredNotices());
    setStaffList(getStoredStaff());
  };

  useEffect(() => {
    refreshData();
    syncMarketingWithDatabase().then(() => refreshData());

    const handleUpdate = () => refreshData();
    window.addEventListener("triotax_staff_notices_updated", handleUpdate);
    return () => window.removeEventListener("triotax_staff_notices_updated", handleUpdate);
  }, []);

  const handleCreateNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError("Notice Title is required.");
      return;
    }
    if (!content.trim()) {
      setFormError("Notice Content description is required.");
      return;
    }

    setIsPublishing(true);

    try {
      const newNotice = createStaffNotice({
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        pinned,
        author: author.trim() || "TrioTax Administration Desk",
        targetRole,
      });

      await pushMarketingToDatabase();

      setTitle("");
      setContent("");
      setPinned(false);
      setPriority("NORMAL");
      setCategory("ANNOUNCEMENT");
      setIsPublishing(false);
      setPublishSuccessMsg(
        `✅ Notice "${newNotice.title}" broadcasted to staff! The Notice tab in the staff portal is now highlighted.`
      );
      setTimeout(() => setPublishSuccessMsg(null), 5000);
      refreshData();
    } catch (err: any) {
      setIsPublishing(false);
      setFormError(`Failed to publish notice: ${err.message || "Unknown error"}`);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (window.confirm("Are you sure you want to delete this staff notification?")) {
      deleteStaffNotice(noticeId);
      await pushMarketingToDatabase();
      refreshData();
    }
  };

  const handleTogglePin = async (noticeId: string) => {
    togglePinStaffNotice(noticeId);
    await pushMarketingToDatabase();
    refreshData();
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus("Syncing notices with PostgreSQL database...");
    const res = await pushMarketingToDatabase();
    setIsSyncing(false);
    if (res.success) {
      setSyncStatus("✅ All staff notices successfully persisted to database!");
    } else {
      setSyncStatus("ℹ️ Local database synced. Status: " + (res.message || "Ready"));
    }
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* HEADER HERO BANNER                                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#003153] via-[#004270] to-[#014d7a] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/10">
              <Megaphone size={14} />
              <span>Internal Staff Communications Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Staff Notifications & Circular Broadcast
            </h1>
            <p className="text-sm text-slate-200">
              Broadcast critical announcements, sales scripts, urgent target reminders, and compliance guidance directly to staff portals. When published, the <strong>NOTICE</strong> tab in the staff sidebar is highlighted so tele-marketing specialists instantly know that an admin notice has arrived.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              <span>{isSyncing ? "Syncing DB..." : "Sync with Database"}</span>
            </button>
          </div>
        </div>

        {/* Notifications / Toast */}
        {(publishSuccessMsg || syncStatus) && (
          <div className="mt-4 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-xs font-bold text-white flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-300" />
              <span>{publishSuccessMsg || syncStatus}</span>
            </div>
            <button
              onClick={() => {
                setPublishSuccessMsg(null);
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
      {/* FORM: CREATE & BROADCAST NOTICE TO STAFF                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-200 dark:border-zinc-800 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Send size={18} className="text-[#003153] dark:text-sky-400" />
              <span>Send New Broadcast Notice to Staff</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Draft your message and publish immediately. Staff portals will pulse and highlight the NOTICE tab upon broadcast.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
            <Bell size={12} />
            <span>Live Portal Alert</span>
          </span>
        </div>

        {formError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreateNoticeSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Title */}
            <div className="lg:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                Notice Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Urgent: GSTR-3B Filing Cutoff Tonight - Prioritize Hot Pipeline"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#003153] focus:outline-none"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                Notice Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#003153] focus:outline-none cursor-pointer"
              >
                <option value="ANNOUNCEMENT">📢 Announcement</option>
                <option value="TARGET">🎯 Target Milestone</option>
                <option value="SCRIPT">💬 Tele-Calling Script</option>
                <option value="INCENTIVE">🏆 Commission & Incentive</option>
                <option value="COMPLIANCE">⚖️ Statutory Compliance</option>
                <option value="URGENT">🚨 Urgent Notice</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                Alert Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#003153] focus:outline-none cursor-pointer"
              >
                <option value="NORMAL">Normal Priority</option>
                <option value="HIGH">⚡ High Priority</option>
                <option value="URGENT">🚨 Critical Urgent Alert</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Target Audience */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                Target Staff Audience
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#003153] focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Staff & Specialists</option>
                <option value="Senior Tele-Marketing Specialist">Senior Tele-Marketing Specialist</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Author Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                Published By (Author Designation)
              </label>
              <input
                type="text"
                placeholder="e.g. TrioTax Administration Desk"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#003153] focus:outline-none"
              />
            </div>

            {/* Pinned Checkbox */}
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="pinNoticeCheckbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="w-4 h-4 rounded text-[#003153] focus:ring-[#003153] cursor-pointer"
              />
              <label htmlFor="pinNoticeCheckbox" className="text-xs font-bold text-slate-800 dark:text-zinc-200 cursor-pointer flex items-center gap-1.5">
                <Pin size={13} className="text-amber-500" />
                <span>Pin to top of Staff Notice Board</span>
              </label>
            </div>
          </div>

          {/* Detailed Message Content */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
              Notice Content & Detailed Message *
            </label>
            <textarea
              rows={4}
              placeholder="Type your message, pitch scripts, incentive details, or operational guidance for the staff team..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#003153] focus:outline-none"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Sparkles size={14} className="text-amber-500" />
              <span>Publishes immediately and alerts staff with sidebar highlight.</span>
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="px-6 py-2.5 bg-[#003153] hover:bg-[#014d7a] active:bg-[#00223a] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Megaphone size={15} />
              <span>{isPublishing ? "Publishing Notice..." : "Broadcast Notice & Notify Staff"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PUBLISHED NOTICES DIRECTORY & MANAGEMENT                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone size={18} className="text-sky-600" />
              <span>Published Staff Notices Directory ({filteredNotices.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Manage existing circulars, pin important target memos, or delete outdated guidance.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs text-slate-900 dark:text-white outline-none w-48"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="TARGET">Target</option>
              <option value="SCRIPT">Script</option>
              <option value="INCENTIVE">Incentive</option>
              <option value="COMPLIANCE">Compliance</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* Notices Cards List */}
        {filteredNotices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-zinc-500 space-y-2">
            <Megaphone size={36} className="mx-auto text-slate-300 dark:text-zinc-600" />
            <p className="font-bold text-slate-700 dark:text-zinc-300">No notices found</p>
            <p className="text-xs">Broadcast your first message to staff using the form above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {filteredNotices.map((notice) => {
              const isUrgent = notice.priority === "URGENT" || notice.category === "URGENT";

              return (
                <div
                  key={notice.id}
                  className={`p-5 transition-colors hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                    notice.pinned ? "bg-amber-50/30 dark:bg-amber-950/20" : ""
                  }`}
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      {notice.pinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                          <Pin size={10} />
                          <span>PINNED</span>
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          notice.category === "TARGET"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                            : notice.category === "SCRIPT"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                            : notice.category === "INCENTIVE"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : isUrgent
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse"
                            : "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                        }`}
                      >
                        {notice.category}
                      </span>

                      {isUrgent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500 text-white animate-pulse">
                          🚨 CRITICAL ALERT
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        {new Date(notice.publishedAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-slate-900 dark:text-white">
                      {notice.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                      <span className="font-semibold">Author: {notice.author}</span>
                      <span>•</span>
                      <span>Audience: {notice.targetRole || "All Staff"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 md:self-start">
                    <button
                      onClick={() => handleTogglePin(notice.id)}
                      className={`p-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        notice.pinned
                          ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                      title={notice.pinned ? "Unpin notice" : "Pin notice to top"}
                    >
                      <Pin size={13} className={notice.pinned ? "fill-amber-600 text-amber-600" : ""} />
                      <span>{notice.pinned ? "Pinned" : "Pin"}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60 transition-colors cursor-pointer"
                      title="Delete notice"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminStaffNotifications;
