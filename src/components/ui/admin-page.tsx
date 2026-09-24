import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, User, ArrowRight, LayoutDashboard, Users, Settings, LogOut, UserPlus, FileCheck, X, Trash2, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Megaphone, Play, Pause, Plus, Image as ImageIcon, Link as LinkIcon, Database, Download, Upload, FileText, HardDrive } from "lucide-react";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { getAdsConfig, DEFAULT_ADS, AdItem } from "@/components/ui/scrolling-ad-banner";

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

      const payload = {
        companyProfile: {
          username: userToDownload.username,
          companyName: userToDownload.company_name || userToDownload.companyName || "",
          ownerName: userToDownload.owner_name || userToDownload.ownerName || "",
          email: userToDownload.email || "",
          contact: userToDownload.contact || "",
          address: userToDownload.address || "",
          description: userToDownload.description || ""
        },
        billingHistory: serverData?.billingHistory || localData?.billingHistory || [],
        employees: serverData?.employees || localData?.employees || [],
        complianceRecords: serverData?.complianceRecords || localData?.complianceRecords || [],
        exportedAt: new Date().toISOString(),
        system: "TrioTax Database Engine",
        version: "1.0"
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
          let currentLocal: any = { billingHistory: [], employees: [], complianceRecords: [] };
          const rawLocal = localStorage.getItem(`triotax_user_data_${targetUsername}`);
          if (rawLocal) {
            try { currentLocal = JSON.parse(rawLocal); } catch (e) {}
          }

          const mergedLocalBilling = [
            ...(currentLocal.billingHistory || []),
            ...(restoredJSON.billingHistory || []).map((item: any, idx: number) => ({ ...item, id: Date.now() + idx + Math.floor(Math.random() * 1000) }))
          ];

          const mergedLocalEmployees = [
            ...(currentLocal.employees || []),
            ...(restoredJSON.employees || []).map((item: any, idx: number) => ({ ...item, id: Date.now() + idx + Math.floor(Math.random() * 1000) }))
          ];

          const mergedLocalPayload = {
            ...currentLocal,
            billingHistory: mergedLocalBilling,
            employees: mergedLocalEmployees
          };

          localStorage.setItem(`triotax_user_data_${targetUsername}`, JSON.stringify(mergedLocalPayload));
          window.dispatchEvent(new Event("triotax_data_backup_update"));

          const numInvoices = restoredJSON.billingHistory?.length || 0;
          const numEmployees = restoredJSON.employees?.length || 0;

          setBackupStatusMsg(`✅ Successfully uploaded and appended backup data for "${targetUsername}"! Added ${numInvoices} invoice(s) & ${numEmployees} employee record(s). All existing data preserved without overriding.`);
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
      setCreateError("Could not connect to Railway server. Please verify network connection.");
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
      default:
        return null;
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "create-user", label: "Create User", icon: UserPlus },
    { id: "gst-tracking", label: "GST Tracking", icon: FileCheck },
    { id: "manage-users", label: "Manage Users", icon: Users },
    { id: "data-backup", label: "Data Backup", icon: Database },
    { id: "play-ads", label: "Play Ads", icon: Megaphone },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0a0a0b] w-full overflow-hidden transition-colors">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 dark:bg-zinc-950 text-white flex flex-col h-full dark:border-r dark:border-zinc-800 transition-colors">
        <div className="p-6 border-b border-slate-800 dark:border-zinc-800 flex items-center gap-3">
          <Shield className="text-blue-400 h-6 w-6" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === item.id 
                  ? "bg-blue-600/20 text-blue-400" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-zinc-900"
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-800 dark:border-zinc-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-zinc-900 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-800 h-16 flex items-center px-8 justify-between transition-colors">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
            {activeTab.replace("-", " ")}
          </h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Admin User</span>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center rounded-full">
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
    </div>
  );
};

export default AdminPage;
