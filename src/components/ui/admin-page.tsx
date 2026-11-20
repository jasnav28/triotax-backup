import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, User, ArrowRight, LayoutDashboard, Users, Settings, LogOut, UserPlus, FileCheck, X, Trash2, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Megaphone, Play, Pause, Plus, Image as ImageIcon, Link as LinkIcon, Database, Download, Upload, FileText, HardDrive, Search, Target, TrendingUp, ChevronDown, ChevronRight, UserCheck, Briefcase, Crosshair, Bell } from "lucide-react";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { getAdsConfig, DEFAULT_ADS, AdItem } from "@/components/ui/scrolling-ad-banner";
import { AdminMarketingData } from "@/components/ui/admin-marketing-data";
import { AdminStaffProgress } from "@/components/ui/admin-staff-progress";
import { AdminStaffTargets } from "@/components/ui/admin-staff-targets";
import { AdminStaffNotifications } from "@/components/ui/admin-staff-notifications";

interface AdminPageProps {
  isAdminAuth: boolean;
  onLogin: (password: string, username: string) => boolean;
  onLogout: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ isAdminAuth, onLogin, onLogout }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPlayAds, setShowPlayAds] = useState<boolean>(() => {
    const saved = localStorage.getItem("triotax_show_play_ads");
    return saved !== null ? saved === "true" : true;
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Nested sidebar navigation groups state (End Clients & Staff)
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({
    "end-clients": true,
    staff: true,
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  useEffect(() => {
    if (["create-user", "gst-tracking", "manage-users", "data-backup"].includes(activeTab)) {
      setExpandedGroups((prev) => ({ ...prev, "end-clients": true }));
    } else if (["staff-accounts", "staff-progress", "staff-targets", "marketing-data", "staff-notifications"].includes(activeTab)) {
      setExpandedGroups((prev) => ({ ...prev, staff: true }));
    }
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editStatus, setEditStatus] = useState("Ongoing");
  const [editComplianceTasks, setEditComplianceTasks] = useState<any[]>([
    { id: "gst", title: "GST Return Filing", due: "25th of every month", status: "Ongoing" },
    { id: "tds", title: "TDS Payment", due: "7th of every month", status: "Due" },
    { id: "roc", title: "Annual ROC Filing", due: "30th September", status: "Due" },
    { id: "itr", title: "Income Tax Return", due: "31st July", status: "Done/Completed" },
    { id: "pf", title: "PF & ESI Payment", due: "15th of every month", status: "Ongoing" },
    { id: "adv_tax", title: "Advance Tax Payment", due: "15th December", status: "Due" },
  ]);
  const [isSavingCompliance, setIsSavingCompliance] = useState(false);

  // Create user form state
  const [newCompany, setNewCompany] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newAltContact, setNewAltContact] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [createMsg, setCreateMsg] = useState("");
  const [createError, setCreateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Play Ads State ---
  const [adsState, setAdsState] = useState(getAdsConfig());
  const [newAdTitle, setNewAdTitle] = useState("");
  const [newAdImage, setNewAdImage] = useState("");
  const [newAdLink, setNewAdLink] = useState("");

  // --- Data Backup & Restore State ---
  const [backupSelectedCompany, setBackupSelectedCompany] = useState("");
  const [backupJsonFile, setBackupJsonFile] = useState<File | null>(null);
  const [backupStatusMsg, setBackupStatusMsg] = useState("");
  const [backupErrorMsg, setBackupErrorMsg] = useState("");
  const [isBackupProcessing, setIsBackupProcessing] = useState(false);

  const handleDownloadCompanyData = async (userToDownload: any) => {
    try {
      setIsBackupProcessing(true);
      setBackupStatusMsg(`Downloading JSON data backup for ${userToDownload.company_name || userToDownload.username}...`);
      setBackupErrorMsg("");

      let serverData: any = null;
      try {
        const res = await fetch(getCleanApiUrl(`users/${userToDownload.username}/data`));
        if (res.ok) {
          serverData = await res.json();
        }
      } catch (e) {
        console.warn("Could not fetch server data, falling back to local storage:", e);
      }

      let localData: any = null;
      const local = localStorage.getItem(`triotax_user_data_${userToDownload.username}`);
      if (local) {
        try { localData = JSON.parse(local); } catch (e) {}
      }

      const mergedProfile = {
        username: userToDownload.username,
        companyName: userToDownload.company_name || userToDownload.companyName || "",
        ownerName: userToDownload.owner_name || userToDownload.ownerName || "",
        email: userToDownload.email || "",
        contact: userToDownload.contact || "",
        address: userToDownload.address || "",
        description: userToDownload.description || "",
        ...(localData?.companyProfile || {}),
        ...(serverData?.companyProfile || {})
      };

      const payload = {
        companyProfile: mergedProfile,
        billingHistory: serverData?.billingHistory || localData?.billingHistory || [],
        clientMaster: serverData?.clientMaster || localData?.clientMaster || [],
        itemMaster: serverData?.itemMaster || localData?.itemMaster || [],
        quotations: serverData?.quotations || localData?.quotations || [],
        creditDebitNotes: serverData?.creditDebitNotes || localData?.creditDebitNotes || [],
        purchases: serverData?.purchases || localData?.purchases || [],
        expenses: serverData?.expenses || localData?.expenses || [],
        payments: serverData?.payments || localData?.payments || [],
        documents: serverData?.documents || localData?.documents || [],
        employees: serverData?.employees || localData?.employees || [],
        complianceRecords: serverData?.complianceRecords || localData?.complianceRecords || [],
        complianceTasks: serverData?.complianceTasks || localData?.complianceTasks || [],
        exportedAt: new Date().toISOString(),
        system: "TrioTax Database Engine",
        version: "2.0"
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `TrioTax_Backup_${userToDownload.username}_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setBackupStatusMsg(`✅ Downloaded JSON backup for ${userToDownload.company_name || userToDownload.username}!`);
    } catch (err: any) {
      setBackupErrorMsg(`Failed to download backup: ${err.message}`);
    } finally {
      setIsBackupProcessing(false);
    }
  };

  const handleUploadAndAppendData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupSelectedCompany) {
      setBackupErrorMsg("Please select a target company profile first.");
      return;
    }
    if (!backupJsonFile) {
      setBackupErrorMsg("Please select a .json backup file to upload.");
      return;
    }

    setBackupStatusMsg("");
    setBackupErrorMsg("");
    setIsBackupProcessing(true);

    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        try {
          const fileContent = event.target?.result as string;
          const restoredJSON = JSON.parse(fileContent);

          const targetUsername = backupSelectedCompany;

          // Post to server restore endpoint (which appends instead of overriding!)
          let res = await fetch(getCleanApiUrl(`users/${targetUsername}/restore`), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(restoredJSON)
          });

          // Also update localStorage cache in append mode
          let currentLocal: any = {
            billingHistory: [],
            clientMaster: [],
            itemMaster: [],
            quotations: [],
            creditDebitNotes: [],
            purchases: [],
            expenses: [],
            payments: [],
            documents: [],
            employees: [],
            complianceRecords: [],
            companyProfile: {}
          };
          const rawLocal = localStorage.getItem(`triotax_user_data_${targetUsername}`);
          if (rawLocal) {
            try { currentLocal = JSON.parse(rawLocal); } catch (e) {}
          }

          const appendItems = (existing: any[] = [], incoming: any[] = []) => [
            ...(existing || []),
            ...(incoming || []).map((item: any, idx: number) => ({
              ...item,
              id: item.id ? (typeof item.id === 'string' ? `${item.id}-restored-${idx + 1}` : Date.now() + idx + Math.floor(Math.random() * 10000)) : (Date.now() + idx + Math.floor(Math.random() * 10000))
            }))
          ];

          const mergedLocalPayload = {
            ...currentLocal,
            companyProfile: {
              ...(currentLocal.companyProfile || {}),
              ...(restoredJSON.companyProfile || {})
            },
            billingHistory: appendItems(currentLocal.billingHistory, restoredJSON.billingHistory),
            clientMaster: appendItems(currentLocal.clientMaster, restoredJSON.clientMaster),
            itemMaster: appendItems(currentLocal.itemMaster, restoredJSON.itemMaster),
            quotations: appendItems(currentLocal.quotations, restoredJSON.quotations),
            creditDebitNotes: appendItems(currentLocal.creditDebitNotes, restoredJSON.creditDebitNotes),
            purchases: appendItems(currentLocal.purchases, restoredJSON.purchases),
            expenses: appendItems(currentLocal.expenses, restoredJSON.expenses),
            payments: appendItems(currentLocal.payments, restoredJSON.payments),
            documents: appendItems(currentLocal.documents, restoredJSON.documents),
            employees: appendItems(currentLocal.employees, restoredJSON.employees),
            complianceRecords: appendItems(currentLocal.complianceRecords, restoredJSON.complianceRecords),
            complianceTasks: restoredJSON.complianceTasks && restoredJSON.complianceTasks.length > 0 ? restoredJSON.complianceTasks : (currentLocal.complianceTasks || []),
            lastRestoredAt: new Date().toISOString()
          };

          localStorage.setItem(`triotax_user_data_${targetUsername}`, JSON.stringify(mergedLocalPayload));
          window.dispatchEvent(new Event("triotax_data_backup_update"));

          const numInvoices = restoredJSON.billingHistory?.length || 0;
          const numClients = restoredJSON.clientMaster?.length || 0;
          const numQuotes = restoredJSON.quotations?.length || 0;
          const numNotes = restoredJSON.creditDebitNotes?.length || 0;
          const numEmployees = restoredJSON.employees?.length || 0;

          setBackupStatusMsg(`✅ Successfully uploaded and appended backup data for "${targetUsername}"! Added ${numInvoices} invoice(s), ${numClients} client(s), ${numQuotes} quotation(s), ${numNotes} note(s), and ${numEmployees} employee record(s). All existing data preserved without overriding.`);
          setBackupJsonFile(null);
        } catch (err: any) {
          setBackupErrorMsg(`Failed to process JSON file: ${err.message}`);
        } finally {
          setIsBackupProcessing(false);
        }
      };

      fileReader.readAsText(backupJsonFile);
    } catch (err: any) {
      setBackupErrorMsg(`Error reading file: ${err.message}`);
      setIsBackupProcessing(false);
    }
  };

  const updateAdsConfig = (newEnabled: boolean, newList: AdItem[]) => {
    const updated = { isAdsEnabled: newEnabled, adList: newList };
    setAdsState(updated);
    try {
      localStorage.setItem("triotax_ads_config", JSON.stringify(updated));
      window.dispatchEvent(new Event("triotax_ads_update"));
    } catch (e) {
      console.error("Failed to save ads config", e);
    }
  };

  const handleToggleAds = (enabled: boolean) => {
    updateAdsConfig(enabled, adsState.adList || DEFAULT_ADS);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const lower = val.toLowerCase().trim();
    if (lower.includes("adon")) {
      setShowPlayAds(true);
      localStorage.setItem("triotax_show_play_ads", "true");
      handleToggleAds(true);
      setSearchFeedback("Play Ads tab is now VISIBLE & Ads Display toggle is ON");
    } else if (lower.includes("adoff")) {
      setShowPlayAds(false);
      localStorage.setItem("triotax_show_play_ads", "false");
      handleToggleAds(false);
      setSearchFeedback("Play Ads tab is now HIDDEN & Ads Display toggle is OFF");
      setActiveTab((currentTab) => (currentTab === "play-ads" ? "dashboard" : currentTab));
    } else {
      setSearchFeedback(null);
    }
  };

  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle || !newAdImage) return;

    const newAd: AdItem = {
      id: Date.now(),
      title: newAdTitle,
      imageUrl: newAdImage,
      linkUrl: newAdLink || "#"
    };

    const currentList = adsState.adList && adsState.adList.length > 0 ? adsState.adList : DEFAULT_ADS;
    const updatedList = [newAd, ...currentList];
    updateAdsConfig(adsState.isAdsEnabled, updatedList);

    setNewAdTitle("");
    setNewAdImage("");
    setNewAdLink("");
  };

  const handleDeleteAd = (id: string | number) => {
    const currentList = adsState.adList && adsState.adList.length > 0 ? adsState.adList : DEFAULT_ADS;
    const updatedList = currentList.filter(ad => ad.id !== id);
    updateAdsConfig(adsState.isAdsEnabled, updatedList);
  };

  const getCleanApiUrl = (endpoint: string) => {
    let base = (import.meta as any).env?.VITE_API_URL || "https://triotax-backend-production.up.railway.app";
    base = base.trim().replace(/\/+$/, "");
    if (base.endsWith("/api")) {
      base = base.substring(0, base.length - 4);
    }
    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    const finalEndpoint = cleanEndpoint.startsWith("api/") ? cleanEndpoint : `api/${cleanEndpoint}`;
    return `${base}/${finalEndpoint}`;
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(getCleanApiUrl("users"));
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users from server:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdminAuth) {
      fetchUsers();
    }
  }, [isAdminAuth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password, username);
    if (!success) {
      setError("Invalid credentials. Try admin / admin123");
    }
  };

  const openUserModal = async (user: any) => {
    setSelectedUser(user);
    setEditNote(user.note || user.adminNote || "");
    setEditStatus(user.gstStatus || "Ongoing");

    let initialTasks = [
      { id: "gst", title: "GST Return Filing", due: "25th of every month", status: "Ongoing" },
      { id: "tds", title: "TDS Payment", due: "7th of every month", status: "Due" },
      { id: "roc", title: "Annual ROC Filing", due: "30th September", status: "Due" },
      { id: "itr", title: "Income Tax Return", due: "31st July", status: "Done/Completed" },
      { id: "pf", title: "PF & ESI Payment", due: "15th of every month", status: "Ongoing" },
      { id: "adv_tax", title: "Advance Tax Payment", due: "15th December", status: "Due" },
    ];

    try {
      const res = await fetch(getCleanApiUrl(`users/${user.username}/data`));
      if (res.ok) {
        const result = await res.json();
        const serverTasks = result.complianceTasks || result.data?.complianceTasks;
        if (serverTasks && serverTasks.length > 0) {
          initialTasks = serverTasks;
        }
      }
    } catch (e) {
      console.warn("Could not fetch server user data for modal", e);
    }

    const local = localStorage.getItem(`triotax_user_data_${user.username}`);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.complianceTasks && parsed.complianceTasks.length > 0) {
          initialTasks = parsed.complianceTasks;
        }
      } catch (e) {}
    }

    setEditComplianceTasks(initialTasks);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    setEditComplianceTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleSaveUserDetails = async () => {
    if (!selectedUser) return;
    setIsSavingCompliance(true);

    try {
      const targetUsername = selectedUser.username;
      let currentLocal: any = {};
      const rawLocal = localStorage.getItem(`triotax_user_data_${targetUsername}`);
      if (rawLocal) {
        try { currentLocal = JSON.parse(rawLocal); } catch (e) {}
      }

      const updatedPayload = {
        ...currentLocal,
        complianceTasks: editComplianceTasks,
        gstStatus: editStatus,
        adminNote: editNote,
        lastUpdatedByAdmin: new Date().toISOString()
      };

      // Post to PostgreSQL DB
      await fetch(getCleanApiUrl(`users/${targetUsername}/data`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: updatedPayload })
      });

      // Save to localStorage and dispatch events
      localStorage.setItem(`triotax_user_data_${targetUsername}`, JSON.stringify(updatedPayload));
      window.dispatchEvent(new Event("triotax_compliance_update"));
      window.dispatchEvent(new Event("triotax_data_backup_update"));

      setUsers(prev => prev.map(u =>
        u.username === targetUsername ? { ...u, note: editNote, gstStatus: editStatus, complianceTasks: editComplianceTasks } : u
      ));

      alert(`✅ Successfully updated Compliance Tracker for ${selectedUser.company_name || selectedUser.companyName || targetUsername}!`);
      setSelectedUser(null);
    } catch (err: any) {
      alert(`Error saving compliance updates: ${err.message}`);
    } finally {
      setIsSavingCompliance(false);
    }
  };

  const handleDeleteUser = async (userToDelete: string) => {
    if (!confirm(`Are you sure you want to delete user "${userToDelete}" from PostgreSQL database?`)) return;
    try {
      const res = await fetch(getCleanApiUrl(`users/${userToDelete}`), { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg("");
    setCreateError("");
    setIsSubmitting(true);

    const cleanUser = newUsername.toLowerCase().replace(/\s+/g, "");

    try {
      const response = await fetch(getCleanApiUrl("users"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: newCompany,
          ownerName: newOwner,
          email: newEmail,
          contact: newContact,
          altContact: newAltContact,
          address: newAddress,
          description: newDesc,
          username: cleanUser,
          password: newPassword,
        }),
      });

      if (response.ok) {
        setCreateMsg(`✅ User "${cleanUser}" successfully saved to PostgreSQL database! Login at /login`);
        setNewCompany(""); setNewOwner(""); setNewEmail(""); setNewContact(""); setNewAltContact("");
        setNewAddress(""); setNewDesc(""); setNewUsername(""); setNewPassword("");
        fetchUsers();
      } else {
        const data = await response.json();
        setCreateError(data.message || `Failed to create user "${cleanUser}".`);
      }
    } catch (err) {
      console.error("Error creating user:", err);
      if (!navigator.onLine) {
        setCreateError("No Internet Connection. Please check your network.");
      } else {
        setCreateError("Could not connect to Railway server. Server may be sleeping or initializing.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800"
        >
          <div className="bg-slate-900 dark:bg-zinc-950 p-8 text-center border-b border-slate-800 dark:border-zinc-800">
            <div className="mx-auto w-16 h-16 bg-slate-800 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-slate-700 dark:border-zinc-700">
              <Shield className="text-blue-400 h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-2">Restricted access area</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-800 text-center">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter username"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter password"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg transition-colors font-medium"
              >
                Access Portal
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeAdsList = adsState.adList && adsState.adList.length > 0 ? adsState.adList : DEFAULT_ADS;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { title: 'Total Registered Users', value: users.length },
                { title: 'Active Accounts', value: users.length },
                { title: 'Pending GST Filings', value: 0 },
                { title: 'Total Companies', value: users.length }
              ].map((metric) => (
                <div key={metric.title} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm transition-colors">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{metric.title}</h3>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{metric.value}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Registered User Accounts (Railway Server Database)</h3>
                <button onClick={fetchUsers} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  <RefreshCw size={14} className={loadingUsers ? "animate-spin" : ""} /> Refresh List
                </button>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-12">
                  <User className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Users Created Yet</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Create your first client user to save directly to PostgreSQL.</p>
                  <button onClick={() => setActiveTab("create-user")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                    + Create User Account
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-950/50 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-zinc-800">
                        <th className="p-3 font-medium">Company Name</th>
                        <th className="p-3 font-medium">Owner Name</th>
                        <th className="p-3 font-medium">Username</th>
                        <th className="p-3 font-medium">Email / Contact</th>
                        <th className="p-3 font-medium">Dashboard URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr 
                          key={u.id || u.username} 
                          onClick={() => openUserModal(u)}
                          className="border-b border-gray-100 dark:border-zinc-800 hover:bg-blue-50/50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors"
                        >
                          <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">
                            {u.company_name || u.companyName || "N/A"}
                            <span className="text-xs text-blue-500 font-normal block">Click to manage compliance</span>
                          </td>
                          <td className="p-3 text-gray-600 dark:text-gray-400">{u.owner_name || u.ownerName || "N/A"}</td>
                          <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">@{u.username}</td>
                          <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                            <div>{u.email || "No email"}</div>
                            <div className="text-xs text-gray-400">{u.contact}</div>
                          </td>
                          <td className="p-3 text-sm flex items-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); openUserModal(u); }}
                              className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
                            >
                              <FileCheck size={12} /> Compliance
                            </button>
                            <a 
                              href={`/${u.username}-user/dashboard`} 
                              target="_blank" 
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            >
                              /{u.username}-user <ExternalLink size={11} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        );
      case "create-user":
        return (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 max-w-4xl mx-auto transition-colors">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Create New User Profile</h2>
            {createMsg && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800 text-sm flex items-center gap-2">
                <CheckCircle2 size={18} /> {createMsg}
              </div>
            )}
            {createError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 text-sm flex items-center gap-2">
                <AlertCircle size={18} /> {createError}
              </div>
            )}
            <form onSubmit={handleCreateUser} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-zinc-800 pb-2">Business Details</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name of the Company</label>
                  <input 
                    type="text" 
                    required 
                    value={newCompany} 
                    onChange={e => setNewCompany(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                    placeholder="e.g. Acme Corp" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newOwner} 
                    onChange={e => setNewOwner(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email ID</label>
                  <input 
                    type="email" 
                    required 
                    value={newEmail} 
                    onChange={e => setNewEmail(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                    placeholder="john@example.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={newContact} 
                    onChange={e => setNewContact(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                    placeholder="+91 9876543210" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alternative Number</label>
                  <input 
                    type="tel" 
                    value={newAltContact} 
                    onChange={e => setNewAltContact(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                    placeholder="+91 9876543211" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Address</label>
                  <textarea 
                    required 
                    rows={3} 
                    value={newAddress} 
                    onChange={e => setNewAddress(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                    placeholder="Full business address"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Description (Optional)</label>
                  <textarea 
                    rows={2} 
                    value={newDesc} 
                    onChange={e => setNewDesc(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                    placeholder="Brief description of the business"
                  ></textarea>
                </div>

                <div className="space-y-4 md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-zinc-800 pb-2">Account Credentials</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username (User ID)</label>
                  <input 
                    type="text" 
                    required 
                    value={newUsername} 
                    onChange={e => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))} 
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                    placeholder="e.g. sai (no spaces)" 
                  />
                  {newUsername && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">User URL will be: /{newUsername}-user/dashboard</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Password</label>
                  <input 
                    type="text" 
                    required 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                    placeholder="Secure password" 
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? "Creating & Saving to Database..." : "Create User Account"}
                </button>
              </div>
            </form>
          </div>
        );
      case "gst-tracking":
        return (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">GST Tracking & Billing History</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click on a user to view their billing history and manage GST status.</p>
              </div>
              <button onClick={fetchUsers} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                <RefreshCw size={14} className={loadingUsers ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
            
            {users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No users found. Use "Create User" to add account profiles.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-950/50 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-zinc-800">
                      <th className="p-4 font-medium">User Details</th>
                      <th className="p-4 font-medium">GST Status</th>
                      <th className="p-4 font-medium">Admin Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr 
                        key={user.id || user.username} 
                        onClick={() => openUserModal(user)}
                        className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <div className="font-medium text-gray-800 dark:text-gray-200">{user.company_name || user.companyName || user.username}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email || user.username}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.gstStatus === "Completed" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
                            {user.gstStatus || "Ongoing"}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                          {user.note || <span className="text-gray-400 dark:text-gray-600 italic">No notes</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case "manage-users":
        return (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage All User Accounts</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">View and remove user profiles registered in the system.</p>
              </div>
              <button onClick={fetchUsers} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                <RefreshCw size={14} className={loadingUsers ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No user accounts registered.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-950/50 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-zinc-800">
                      <th className="p-3 font-medium">Username</th>
                      <th className="p-3 font-medium">Company Name</th>
                      <th className="p-3 font-medium">Owner Name</th>
                      <th className="p-3 font-medium">Email / Contact</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id || u.username} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">{u.username}</td>
                        <td className="p-3 text-gray-800 dark:text-gray-200">{u.company_name || u.companyName || "N/A"}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">{u.owner_name || u.ownerName || "N/A"}</td>
                        <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                          <div>{u.email}</div>
                          <div className="text-xs text-gray-400">{u.contact}</div>
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => handleDeleteUser(u.username)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex items-center gap-1 text-sm font-medium"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case "play-ads":
        return (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Global Ads Toggle Header */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <Megaphone className="text-blue-600 dark:text-blue-400 h-7 w-7" />
                  <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">User Dashboard Ads Manager</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Turn scrolling Ad banners ON or OFF across all client user dashboards.
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/80 px-5 py-3 rounded-2xl border border-gray-200 dark:border-zinc-700">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Ads Display: <strong className={adsState.isAdsEnabled ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}>{adsState.isAdsEnabled ? "ACTIVE (ON)" : "OFF"}</strong>
                </span>
                <button
                  onClick={() => handleToggleAds(!adsState.isAdsEnabled)}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${
                    adsState.isAdsEnabled ? "bg-emerald-500" : "bg-gray-300 dark:bg-zinc-600"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      adsState.isAdsEnabled ? "translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Create New Ad Form */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="text-blue-600" size={20} /> Add New Ad Banner
              </h3>

              <form onSubmit={handleAddAd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Ad Title / Announcement</label>
                    <input
                      type="text"
                      required
                      value={newAdTitle}
                      onChange={(e) => setNewAdTitle(e.target.value)}
                      placeholder="e.g. Special Offer: 30% Off GST Filing!"
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Banner Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        required
                        value={newAdImage}
                        onChange={(e) => setNewAdImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full pl-9 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Destination Link (Optional)</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        value={newAdLink}
                        onChange={(e) => setNewAdLink(e.target.value)}
                        placeholder="https://triotax.com/offer"
                        className="w-full pl-9 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
                  >
                    <Plus size={16} /> Publish Ad Banner
                  </button>
                </div>
              </form>
            </div>

            {/* Active Ads Gallery */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Currently Playing Banners</h3>

              {activeAdsList.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No active Ads. Click "Publish Ad Banner" above to add your first Ad.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeAdsList.map((ad) => (
                    <div key={ad.id} className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-950 flex flex-col justify-between">
                      <div className="h-32 w-full relative overflow-hidden bg-slate-900">
                        <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-4 flex items-end">
                          <h4 className="text-sm font-bold text-white leading-snug drop-shadow">{ad.title}</h4>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between border-t border-gray-200 dark:border-zinc-800">
                        <span className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[200px]">{ad.linkUrl || "No link"}</span>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case "data-backup":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Database className="text-blue-500" /> Data Backup & Append Restore Center
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Select company profiles to download JSON backups to local storage, or upload backup files to append user data into Railway PostgreSQL database without overriding existing records.
              </p>
            </div>

            {backupStatusMsg && (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm font-medium flex items-center gap-2">
                <CheckCircle2 size={18} /> {backupStatusMsg}
              </div>
            )}

            {backupErrorMsg && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <AlertCircle size={18} /> {backupErrorMsg}
              </div>
            )}

            {/* Section 1: Upload and Append Data Interface */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Upload className="text-indigo-500" size={20} /> Upload & Append Backup JSON File
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Select the company account, upload the JSON file requested by the user, and append the contents safely.
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                  <Shield size={12} /> Safe Append Mode (No Overwrite)
                </span>
              </div>

              <form onSubmit={handleUploadAndAppendData} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      1. Select Target Company Profile *
                    </label>
                    <select
                      value={backupSelectedCompany}
                      onChange={(e) => setBackupSelectedCompany(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                      required
                    >
                      <option value="">-- Choose Company Profile --</option>
                      {users.map((u) => (
                        <option key={u.id || u.username} value={u.username}>
                          {u.company_name || u.companyName || u.username} (@{u.username})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      2. Choose Backup JSON File *
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => setBackupJsonFile(e.target.files ? e.target.files[0] : null)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-slate-400">
                  💡 <span className="font-semibold text-slate-800 dark:text-slate-200">How appending works:</span> When uploaded, invoices, employee payrolls, and compliance entries from the JSON file are merged directly into the company's server database. Both previous data and new data remain intact and accessible to the user.
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isBackupProcessing || !backupSelectedCompany || !backupJsonFile}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
                  >
                    <Upload size={16} /> {isBackupProcessing ? "Uploading & Appending..." : "Upload & Append Data"}
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Company Profiles Download Table */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <HardDrive className="text-blue-500" size={20} /> Registered Company Profiles Data Backup
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click "Download Data (JSON)" to export the full company dataset to your local machine.
                  </p>
                </div>
                <button onClick={fetchUsers} className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  <RefreshCw size={13} className={loadingUsers ? "animate-spin" : ""} /> Refresh Profiles
                </button>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No company profiles found in database. Create a user to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead className="bg-slate-50 dark:bg-zinc-800/60 text-gray-700 dark:text-gray-300 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Company Name</th>
                        <th className="px-4 py-3">Owner / Contact</th>
                        <th className="px-4 py-3">Username</th>
                        <th className="px-4 py-3 text-right rounded-r-lg">Download Backup</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {users.map((u) => (
                        <tr key={u.id || u.username} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="px-4 py-4">
                            <span className="font-bold text-gray-800 dark:text-white block">
                              {u.company_name || u.companyName || "Unnamed Company"}
                            </span>
                            <span className="text-xs text-gray-400">{u.email || "No email"}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-medium text-gray-700 dark:text-gray-300 block">
                              {u.owner_name || u.ownerName || "Owner"}
                            </span>
                            <span className="text-xs text-gray-400">{u.contact || "N/A"}</span>
                          </td>
                          <td className="px-4 py-4 font-mono text-xs text-blue-600 dark:text-blue-400">
                            @{u.username}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => handleDownloadCompanyData(u)}
                              disabled={isBackupProcessing}
                              className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
                            >
                              <Download size={14} /> Download Data (JSON)
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      case "staff-accounts":
        return <AdminStaffProgress initialSubTab="create-staff" />;
      case "staff-progress":
        return <AdminStaffProgress initialSubTab="marketing" />;
      case "staff-targets":
        return <AdminStaffTargets />;
      case "marketing-data":
        return <AdminMarketingData />;
      case "staff-notifications":
        return <AdminStaffNotifications />;
      case "settings":
        return renderSystemSettings();
      default:
        return null;
    }
  };

  const renderSystemSettings = () => {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <Settings className="text-[#003153] dark:text-sky-400 h-7 w-7" />
              <h2 className="text-2xl font-black text-gray-800 dark:text-white">
                System Governance & Platform Settings
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure global system parameters, portal security, authentication rules, and database persistence.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              🟢 Production Engine Live
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Multi-Portal Architecture */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <Shield className="text-sky-500" size={16} /> Multi-Portal Endpoint Segregation
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">End Clients Portal</span>
                  <span className="text-slate-500 text-[11px]">Client ERP billing, GST, accounting</span>
                </div>
                <code className="font-mono font-bold text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-950/60 px-2 py-0.5 rounded">
                  /login
                </code>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Administration Portal</span>
                  <span className="text-slate-500 text-[11px]">System governance, users, leads audit</span>
                </div>
                <code className="font-mono font-bold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                  /admin
                </code>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Internal Staff Calling Console</span>
                  <span className="text-slate-500 text-[11px]">Senior Tele-Marketing Specialist dialer</span>
                </div>
                <code className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  /staff
                </code>
              </div>
            </div>
          </div>

          {/* Card 2: Staff Credential Generator */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <UserCheck className="text-emerald-500" size={16} /> Staff ID Sequence Generator
            </h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-zinc-300">
              <p>
                Staff employee credentials follow the standardized enterprise sequence prefix:
              </p>
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-black text-sm text-[#003153] dark:text-sky-300 block">
                    TX-M-00020
                  </span>
                  <span className="text-[11px] text-sky-700 dark:text-sky-400">Sequential auto-increment format</span>
                </div>
                <button
                  onClick={() => setActiveTab("staff-accounts")}
                  className="px-3 py-1.5 bg-[#003153] hover:bg-[#014d7a] text-white rounded-lg font-bold text-xs cursor-pointer transition-colors"
                >
                  Create Staff &rarr;
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Staff accounts can be provisioned in <strong>Staff &gt; Staff Accounts</strong> with custom passwords and roles.
              </p>
            </div>
          </div>

          {/* Card 3: Display & Ads Configuration */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <Megaphone className="text-amber-500" size={16} /> User Portal Scrolling Ads Banner
            </h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-xs block">Show Ads Manager in Sidebar</span>
                <span className="text-[11px] text-slate-500">Enable or hide the Play Ads navigation item</span>
              </div>
              <button
                onClick={() => {
                  const nextVal = !showPlayAds;
                  setShowPlayAds(nextVal);
                  localStorage.setItem("triotax_show_play_ads", String(nextVal));
                }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  showPlayAds ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300"
                }`}
              >
                {showPlayAds ? "Enabled (Visible)" : "Hidden"}
              </button>
            </div>
          </div>

          {/* Card 4: Database & Sync Status */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <Database className="text-sky-500" size={16} /> Database Engine & Persistence
            </h3>
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-zinc-300">
                Dual-sync architecture: Changes to users, compliance records, and marketing tele-calling leads are synchronized to PostgreSQL and local browser storage.
              </p>
              <button
                onClick={() => {
                  alert("Triggering global synchronization with database...");
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-white font-bold rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                <span>Verify & Refresh Database Connection</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const endClientItems = [
    { id: "create-user", label: "1. Create User", icon: UserPlus },
    { id: "gst-tracking", label: "2. GST Tracking", icon: FileCheck },
    { id: "manage-users", label: "3. Manage Users", icon: Users },
    { id: "data-backup", label: "4. Data Backup", icon: Database },
  ];

  const staffItems = [
    { id: "staff-accounts", label: "1. Staff Accounts (Create)", icon: UserCheck },
    { id: "staff-progress", label: "2. Staff Progress", icon: TrendingUp },
    { id: "staff-targets", label: "3. Targets", icon: Crosshair },
    { id: "marketing-data", label: "4. Marketing Data", icon: Target },
    { id: "staff-notifications", label: "5. Staff Notifications", icon: Bell },
  ];

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return "Dashboard";
      case "create-user":
        return "End Clients / Create User";
      case "gst-tracking":
        return "End Clients / GST Tracking";
      case "manage-users":
        return "End Clients / Manage Users";
      case "data-backup":
        return "End Clients / Data Backup";
      case "staff-accounts":
        return "Staff / Staff Accounts (Create)";
      case "staff-progress":
        return "Staff / Staff Progress";
      case "staff-targets":
        return "Staff / Targets";
      case "marketing-data":
        return "Staff / Marketing Data";
      case "staff-notifications":
        return "Staff / Staff Notifications";
      case "play-ads":
        return "Play Ads";
      case "settings":
        return "System Settings";
      default:
        return tab.replace("-", " ");
    }
  };

  const renderTreeGroup = (
    groupId: string,
    groupTitle: string,
    groupIcon: React.ElementType,
    items: Array<{ id: string; label: string; icon: React.ElementType }>
  ) => {
    const isExpanded = expandedGroups[groupId] ?? true;
    const GroupIcon = groupIcon;
    const isAnyChildActive = items.some((i) => i.id === activeTab);

    return (
      <div className="space-y-1">
        {/* Category Header */}
        <button
          type="button"
          onClick={() => toggleGroup(groupId)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none group ${
            isAnyChildActive
              ? "text-white bg-white/10"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <GroupIcon
              size={15}
              className={isAnyChildActive ? "text-sky-300" : "text-sky-200/70"}
            />
            <span className="uppercase tracking-wider text-[11px] font-black">
              {groupTitle}
            </span>
          </div>
          <ChevronDown
            size={14}
            className={`text-slate-400 group-hover:text-white transition-transform duration-200 ${
              isExpanded ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>

        {/* Tree Sub-Branches */}
        {isExpanded && (
          <div className="relative pl-1 space-y-0.5 my-1">
            {items.map((item, idx) => {
              const isSelected = activeTab === item.id;
              const isLast = idx === items.length - 1;
              const ItemIcon = item.icon;

              return (
                <div key={item.id} className="relative flex items-center min-h-[36px]">
                  {/* Continuous Vertical Trunk */}
                  <div
                    className={`absolute left-4.5 w-px bg-white/20 dark:bg-zinc-700 pointer-events-none ${
                      isLast ? "top-0 h-1/2" : "top-0 bottom-0"
                    }`}
                  />

                  {/* L-shaped curved branch connector into child */}
                  <div className="absolute left-4.5 top-0 h-1/2 w-4 border-b border-l border-white/25 dark:border-zinc-600 rounded-bl-md pointer-events-none" />

                  {/* Child Item Button */}
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full ml-9.5 flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-white/20 text-white font-black shadow-xs border border-white/25 backdrop-blur-xs"
                        : "text-slate-300 hover:text-white hover:bg-white/10 font-medium"
                    }`}
                  >
                    <ItemIcon
                      size={14}
                      className={`shrink-0 ${
                        isSelected ? "text-sky-300" : "text-white/60"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0a0a0b] w-full overflow-hidden transition-colors">
      {/* Sidebar with Prussian Blue #003153 Branding & Tree Branch Sub-Navigation */}
      <div
        style={{ backgroundColor: "#003153" }}
        className="w-72 text-white flex flex-col h-full border-r border-white/10 transition-colors shrink-0 shadow-xl select-none"
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <img
            src="/Artboard.png"
            alt="TrioTax Logo"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <Shield className="text-sky-300 h-4 w-4" />
              <h1 className="text-base font-black tracking-wide text-white">Admin Panel</h1>
            </div>
            <span className="text-[10px] text-sky-200 font-semibold tracking-wider uppercase block">
              Enterprise Governance
            </span>
          </div>
        </div>
        
        {/* Navigation Items (Dashboard, End Clients Tree, Staff Tree, Play Ads, Settings) */}
        <div className="flex-1 py-4 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {/* Top-Level: Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-white/20 text-white font-black shadow-xs border border-white/25"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <LayoutDashboard
              size={16}
              className={activeTab === "dashboard" ? "text-sky-300" : "text-slate-400"}
            />
            <span>Dashboard</span>
          </button>

          {/* Sub-Branch Group 1: End Clients */}
          {renderTreeGroup("end-clients", "End Clients", Users, endClientItems)}

          {/* Sub-Branch Group 2: Staff */}
          {renderTreeGroup("staff", "Staff", UserCheck, staffItems)}

          {/* Top-Level: Play Ads (if enabled) */}
          {showPlayAds && (
            <button
              type="button"
              onClick={() => setActiveTab("play-ads")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === "play-ads"
                  ? "bg-white/20 text-white font-black shadow-xs border border-white/25"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Megaphone
                size={16}
                className={activeTab === "play-ads" ? "text-amber-300" : "text-slate-400"}
              />
              <span>Play Ads</span>
            </button>
          )}

          {/* Top-Level: System Settings */}
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "settings"
                ? "bg-white/20 text-white font-black shadow-xs border border-white/25"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Settings
              size={16}
              className={activeTab === "settings" ? "text-sky-300" : "text-slate-400"}
            />
            <span>System Settings</span>
          </button>
        </div>
        
        {/* Sidebar Footer: Sign Out */}
        <div className="p-3 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-white/80 hover:text-white hover:bg-rose-600/80 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 h-16 flex items-center px-8 justify-between transition-colors shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-black text-gray-800 dark:text-white">
              {getTabTitle(activeTab)}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-[#003153] dark:bg-sky-950/60 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800">
              Admin Console
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Admin User</span>
            <div className="h-8 w-8 bg-[#003153] text-white font-bold flex items-center justify-center rounded-full text-xs shadow-xs">
              A
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto relative">
          {renderContent()}
        </main>
      </div>

      {/* User Edit Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh] transition-colors"
            >
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{selectedUser.company_name || selectedUser.companyName || selectedUser.username}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email || selectedUser.username}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">
                {/* Section 1: Compliance Tracker Management */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="text-blue-500" size={18} /> Compliance Tracker Tasks
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Updates sync to User Dashboard in real-time</span>
                  </div>

                  <div className="space-y-3">
                    {editComplianceTasks.map((task) => (
                      <div key={task.id} className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h5 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{task.title}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Due: {task.due}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status:</label>
                          <select
                            value={task.status}
                            onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                            className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Due">Due</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Done/Completed">Done/Completed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Account GST Details & Admin Note */}
                <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider mb-3">Account GST & Notes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">GST Account Status</label>
                      <select 
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Admin Note for User</label>
                      <input 
                        type="text"
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a note for the user..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/30 flex justify-end gap-3 transition-colors">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveUserDetails}
                  disabled={isSavingCompliance}
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
                >
                  <FileCheck size={16} /> {isSavingCompliance ? "Updating..." : "Update Compliance & Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Search Modal (Ctrl+F) */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden relative z-10 p-5 space-y-4 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-white font-semibold">
                  <Search size={18} className="text-blue-500" />
                  <span>Admin Search (Ctrl+F)</span>
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Type 'Adon' to show Play Ads tab, 'Adoff' to hide..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder:text-gray-400"
                />
              </div>

              {searchFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    showPlayAds
                      ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                  }`}
                >
                  <CheckCircle2 size={15} />
                  <span>{searchFeedback}</span>
                </motion.div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-zinc-500 pt-1 border-t border-gray-100 dark:border-zinc-800/60">
                <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded border border-gray-300 dark:border-zinc-700 font-mono text-[10px]">Esc</kbd> to exit</span>
                <span className="font-mono text-[11px]">Toggle: Adon / Adoff</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
