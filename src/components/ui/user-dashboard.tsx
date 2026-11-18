import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Upload,
  Download,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Type,
  FileText,
  CheckCircle,
  Wallet,
  Users,
  DollarSign,
  Briefcase,
  Calendar,
  Move,
  GripVertical,
  RotateCcw,
  Sparkles,
  ShoppingCart,
  ShoppingBag,
  Receipt,
  Folder,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Search,
  FileCheck2,
  CalendarDays,
  FileSpreadsheet,
  Layers,
  Clock,
  Printer,
  Shield,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { StockTicker } from "./stock-ticker";
import { ScrollingAdBanner } from "./scrolling-ad-banner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface UserDashboardProps {
  onLogout: () => void;
  username?: string;
  initialTab?: string;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, username = "user", initialTab = "home" }) => {
  const normalizeTab = (tab?: string) => {
    if (!tab || tab === "dashboard" || tab === "home") return "home";
    if (tab === "billing-software" || tab === "sales") return "sales";
    if (tab === "payrolls" || tab === "payroll") return "payroll";
    if (tab === "analytics") return "reports";
    return tab;
  };

  const [activeTab, setActiveTab] = useState(normalizeTab(initialTab));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  // --- Settings State ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Billing / Sales / Invoice State ---
  const [logo, setLogo] = useState<string | null>(null);
  const [template, setTemplate] = useState<1 | 2>(1);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ id: 1, description: "", quantity: 1, price: 0 }]);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isAdvancedEdit, setIsAdvancedEdit] = useState(false);
  const [canvasResetKey, setCanvasResetKey] = useState(0);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);

  // Drag & drop element customization
  const [elementPositions, setElementPositions] = useState<{ [key: string]: { x: number; y: number } }>({
    header: { x: 0, y: 0 },
    customer: { x: 0, y: 0 },
    table: { x: 0, y: 0 },
    totals: { x: 0, y: 0 },
    footer: { x: 0, y: 0 },
  });

  // --- Purchases State ---
  const [purchases, setPurchases] = useState<any[]>(() => {
    const saved = localStorage.getItem(`triotax_purchases_${username}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, billNumber: "PUR-2024-001", vendor: "Apex IT Hardware Ltd", category: "Hardware & Equipment", date: "2026-11-10", amount: 45000, gstPaid: 8100, status: "Paid" },
      { id: 2, billNumber: "PUR-2024-002", vendor: "GreenLine Office Supplies", category: "Office Supplies", date: "2026-11-14", amount: 12500, gstPaid: 2250, status: "Paid" },
      { id: 3, billNumber: "PUR-2024-003", vendor: "CloudHost Infra Technologies", category: "Cloud & Servers", date: "2026-11-16", amount: 28000, gstPaid: 5040, status: "Pending" },
    ];
  });
  const [isAddPurchaseOpen, setIsAddPurchaseOpen] = useState(false);
  const [purchaseVendor, setPurchaseVendor] = useState("");
  const [purchaseBillNo, setPurchaseBillNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseCategory, setPurchaseCategory] = useState("Hardware & Equipment");
  const [purchaseAmount, setPurchaseAmount] = useState<number | "">("");
  const [purchaseGst, setPurchaseGst] = useState<number | "">("");
  const [purchaseStatus, setPurchaseStatus] = useState<"Paid" | "Pending">("Paid");
  const [purchaseFilter, setPurchaseFilter] = useState<"All" | "Paid" | "Pending">("All");
  const [purchaseSearch, setPurchaseSearch] = useState("");

  // --- Expenses State ---
  const [expenses, setExpenses] = useState<any[]>(() => {
    const saved = localStorage.getItem(`triotax_expenses_${username}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, title: "Commercial Office Rent - Nov", category: "Rent & Facilities", amount: 35000, date: "2026-11-01", mode: "Bank Transfer", status: "Paid" },
      { id: 2, title: "High-speed Fiber Internet", category: "Utilities & Internet", amount: 2499, date: "2026-11-05", mode: "UPI", status: "Paid" },
      { id: 3, title: "Client Business Dinner Meeting", category: "Meals & Entertainment", amount: 4800, date: "2026-11-09", mode: "Credit Card", status: "Paid" },
      { id: 4, title: "Google Workspace & Software Tools", category: "Software & Subscriptions", amount: 8200, date: "2026-11-12", mode: "Card", status: "Paid" },
      { id: 5, title: "Digital Marketing Campaign", category: "Marketing & Ads", amount: 15000, date: "2026-11-15", mode: "UPI", status: "Paid" },
    ];
  });
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Rent & Facilities");
  const [expenseAmount, setExpenseAmount] = useState<number | "">("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseMode, setExpenseMode] = useState("UPI");
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState("All");

  // --- Payments Tracker State ---
  const [payments, setPayments] = useState<any[]>(() => {
    const saved = localStorage.getItem(`triotax_payments_${username}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, type: "Inflow", title: "Client Invoice Settlement", party: "Acme Enterprises Ltd", amount: 75000, date: "2026-11-15", method: "NEFT/RTGS", ref: "UTR983471029", status: "Cleared" },
      { id: 2, type: "Outflow", title: "Cloud Server Hosting Bill", party: "CloudHost Infra", amount: 28000, date: "2026-11-16", method: "UPI", ref: "UPI88720198", status: "Cleared" },
      { id: 3, type: "Inflow", title: "Consulting Retainer Q4", party: "Global Logistics Corp", amount: 52000, date: "2026-11-17", method: "Bank Transfer", ref: "UTR109283741", status: "Cleared" },
      { id: 4, type: "Outflow", title: "Office Rent Payment", party: "Landlord Realty Inc", amount: 35000, date: "2026-11-01", method: "NEFT/RTGS", ref: "UTR658392019", status: "Cleared" },
      { id: 5, type: "Inflow", title: "Client Advance Deposit", party: "NextGen Software", amount: 30000, date: "2026-11-18", method: "UPI", ref: "UPI44910283", status: "Pending" },
    ];
  });
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"Inflow" | "Outflow">("Inflow");
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentParty, setPaymentParty] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"Cleared" | "Pending">("Cleared");
  const [paymentFilter, setPaymentFilter] = useState<"All" | "Inflow" | "Outflow" | "Pending">("All");

  // --- Payrolls State ---
  const [employees, setEmployees] = useState<any[]>([]);
  const [isAddEmpOpen, setIsAddEmpOpen] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empRole, setEmpRole] = useState("");
  const [empBasic, setEmpBasic] = useState<number | "">("");
  const [empHra, setEmpHra] = useState<number | "">("");
  const [empDeductions, setEmpDeductions] = useState<number | "">("");
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<any | null>(null);
  const payslipRef = useRef<HTMLDivElement>(null);

  // --- Compliance State ---
  const [complianceTasks, setComplianceTasks] = useState<any[]>([
    { id: "gst", title: "GST Return Filing", due: "25th of every month", status: "Ongoing" },
    { id: "tds", title: "TDS Payment", due: "7th of every month", status: "Due" },
    { id: "roc", title: "Annual ROC Filing", due: "30th September", status: "Due" },
    { id: "itr", title: "Income Tax Return", due: "31st July", status: "Done/Completed" },
    { id: "pf", title: "PF & ESI Payment", due: "15th of every month", status: "Ongoing" },
    { id: "adv_tax", title: "Advance Tax Payment", due: "15th December", status: "Due" },
  ]);

  // --- Documents State ---
  const [documents, setDocuments] = useState<any[]>(() => {
    const saved = localStorage.getItem(`triotax_documents_${username}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, name: "GST Registration Certificate (REG-06)", category: "Tax Filings", date: "2026-04-12", size: "1.4 MB", verified: true },
      { id: 2, name: "Certificate of Incorporation (COI)", category: "Registrations", date: "2026-03-18", size: "2.8 MB", verified: true },
      { id: 3, name: "Permanent Account Number (Company e-PAN)", category: "Registrations", date: "2026-03-20", size: "680 KB", verified: true },
      { id: 4, name: "MSME / Udyam Registration Certificate", category: "Registrations", date: "2026-05-02", size: "1.1 MB", verified: true },
      { id: 5, name: "FY2023-24 Income Tax Acknowledgement (ITR-V)", category: "Tax Filings", date: "2026-07-28", size: "950 KB", verified: true },
      { id: 6, name: "Trademark Registration Certificate (Form TM-A)", category: "Legal & Licenses", date: "2026-08-15", size: "1.9 MB", verified: true },
    ];
  });
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("Tax Filings");
  const [docFilter, setDocFilter] = useState("All");
  const [docSearch, setDocSearch] = useState("");

  // Navigation Tabs exactly matching user image mockup
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "sales", label: "Sales", icon: CreditCard },
    { id: "purchases", label: "Purchases", icon: ShoppingCart },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "payments-tracker", label: "Payments Tracker", icon: Wallet },
    { id: "compliance-tracker", label: "Compliance tracker", icon: FileText },
    { id: "payroll", label: "Payroll", icon: Users },
    { id: "documents", label: "Documents", icon: Folder },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  // --- API & Persistence Handlers ---
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

  const loadUserData = async () => {
    let localData: any = null;
    const local = localStorage.getItem(`triotax_user_data_${username}`);
    if (local) {
      try {
        localData = JSON.parse(local);
      } catch (e) {}
    }

    try {
      const res = await fetch(getCleanApiUrl(`users/${username}/data`));
      if (res.ok) {
        const result = await res.json();
        const billing = result.billingHistory || result.data?.billingHistory || [];
        const emps = result.employees || result.data?.employees || [];
        const tasks = result.complianceTasks || result.data?.complianceTasks || localData?.complianceTasks;

        setBillingHistory(billing);
        setEmployees(emps);
        if (tasks && tasks.length > 0) {
          setComplianceTasks(tasks);
        }

        localStorage.setItem(`triotax_user_data_${username}`, JSON.stringify({
          billingHistory: billing,
          employees: emps,
          complianceTasks: tasks || complianceTasks
        }));
        return;
      }
    } catch (err) {
      console.warn("Backend data fetch error, using local fallback:", err);
    }

    if (localData) {
      if (localData.billingHistory) setBillingHistory(localData.billingHistory);
      if (localData.employees) setEmployees(localData.employees);
      if (localData.complianceTasks) setComplianceTasks(localData.complianceTasks);
    }
  };

  const saveUserData = async (newBilling: any[], newEmployees: any[], newTasks: any[] = complianceTasks) => {
    const payload = { billingHistory: newBilling, employees: newEmployees, complianceTasks: newTasks };
    localStorage.setItem(`triotax_user_data_${username}`, JSON.stringify(payload));
    try {
      await fetch(getCleanApiUrl(`users/${username}/data`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload })
      });
    } catch (err) {
      console.warn("Error saving user data to server:", err);
    }
  };

  useEffect(() => {
    loadUserData();
    const handleUpdate = () => loadUserData();
    window.addEventListener("triotax_data_backup_update", handleUpdate);
    window.addEventListener("triotax_compliance_update", handleUpdate);
    return () => {
      window.removeEventListener("triotax_data_backup_update", handleUpdate);
      window.removeEventListener("triotax_compliance_update", handleUpdate);
    };
  }, [username]);

  // --- Billing Functions ---
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addItem = () => setItems([...items, { id: Date.now(), description: "", quantity: 1, price: 0 }]);
  const removeItem = (id: number) => setItems(items.filter((item) => item.id !== id));
  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const calculateTax = () => calculateSubtotal() * 0.18; // 18% GST
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoiceNumber}.pdf`);
      
      const newHistory = [
        {
          id: Date.now(),
          date: invoiceDate || new Date().toISOString().split("T")[0],
          invoiceNumber,
          customer: customerName || "Customer Name",
          amount: calculateTotal()
        },
        ...billingHistory
      ];
      setBillingHistory(newHistory);
      saveUserData(newHistory, employees);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  // --- Purchases Functions ---
  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseVendor || !purchaseBillNo || !purchaseAmount) return;
    const amt = Number(purchaseAmount) || 0;
    const gst = purchaseGst !== "" ? Number(purchaseGst) : Math.round(amt * 0.18);
    const newPur = {
      id: Date.now(),
      billNumber: purchaseBillNo,
      vendor: purchaseVendor,
      category: purchaseCategory,
      date: purchaseDate || new Date().toISOString().split("T")[0],
      amount: amt,
      gstPaid: gst,
      status: purchaseStatus
    };
    const updated = [newPur, ...purchases];
    setPurchases(updated);
    localStorage.setItem(`triotax_purchases_${username}`, JSON.stringify(updated));
    setPurchaseVendor("");
    setPurchaseBillNo("");
    setPurchaseDate("");
    setPurchaseAmount("");
    setPurchaseGst("");
    setIsAddPurchaseOpen(false);
  };

  const handleTogglePurchaseStatus = (id: number) => {
    const updated = purchases.map(p => p.id === id ? { ...p, status: p.status === "Paid" ? "Pending" : "Paid" } : p);
    setPurchases(updated);
    localStorage.setItem(`triotax_purchases_${username}`, JSON.stringify(updated));
  };

  const handleDeletePurchase = (id: number) => {
    if (confirm("Remove this purchase bill?")) {
      const updated = purchases.filter(p => p.id !== id);
      setPurchases(updated);
      localStorage.setItem(`triotax_purchases_${username}`, JSON.stringify(updated));
    }
  };

  // --- Expenses Functions ---
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;
    const newExp = {
      id: Date.now(),
      title: expenseTitle,
      category: expenseCategory,
      amount: Number(expenseAmount) || 0,
      date: expenseDate || new Date().toISOString().split("T")[0],
      mode: expenseMode,
      status: "Paid"
    };
    const updated = [newExp, ...expenses];
    setExpenses(updated);
    localStorage.setItem(`triotax_expenses_${username}`, JSON.stringify(updated));
    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseDate("");
    setIsAddExpenseOpen(false);
  };

  const handleDeleteExpense = (id: number) => {
    if (confirm("Delete this expense entry?")) {
      const updated = expenses.filter(e => e.id !== id);
      setExpenses(updated);
      localStorage.setItem(`triotax_expenses_${username}`, JSON.stringify(updated));
    }
  };

  // --- Payments Tracker Functions ---
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTitle || !paymentParty || !paymentAmount) return;
    const newPay = {
      id: Date.now(),
      type: paymentType,
      title: paymentTitle,
      party: paymentParty,
      amount: Number(paymentAmount) || 0,
      date: paymentDate || new Date().toISOString().split("T")[0],
      method: paymentMethod,
      ref: paymentRef || `REF${Math.floor(100000 + Math.random() * 900000)}`,
      status: paymentStatus
    };
    const updated = [newPay, ...payments];
    setPayments(updated);
    localStorage.setItem(`triotax_payments_${username}`, JSON.stringify(updated));
    setPaymentTitle("");
    setPaymentParty("");
    setPaymentAmount("");
    setPaymentRef("");
    setPaymentDate("");
    setIsAddPaymentOpen(false);
  };

  const handleTogglePaymentStatus = (id: number) => {
    const updated = payments.map(p => p.id === id ? { ...p, status: p.status === "Cleared" ? "Pending" : "Cleared" } : p);
    setPayments(updated);
    localStorage.setItem(`triotax_payments_${username}`, JSON.stringify(updated));
  };

  const handleDeletePayment = (id: number) => {
    if (confirm("Delete this transaction entry?")) {
      const updated = payments.filter(p => p.id !== id);
      setPayments(updated);
      localStorage.setItem(`triotax_payments_${username}`, JSON.stringify(updated));
    }
  };

  // --- Payroll Functions ---
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empRole || !empBasic) return;

    const basicVal = Number(empBasic) || 0;
    const hraVal = Number(empHra) || 0;
    const dedVal = Number(empDeductions) || 0;
    const netSalary = basicVal + hraVal - dedVal;

    const newEmp = {
      id: Date.now(),
      name: empName,
      role: empRole,
      basic: basicVal,
      hra: hraVal,
      deductions: dedVal,
      netSalary,
      status: "Pending",
      paymentDate: "Pending"
    };

    const updatedEmps = [newEmp, ...employees];
    setEmployees(updatedEmps);
    saveUserData(billingHistory, updatedEmps);
    setEmpName("");
    setEmpRole("");
    setEmpBasic("");
    setEmpHra("");
    setEmpDeductions("");
    setIsAddEmpOpen(false);
  };

  const handleMarkPaid = (id: number) => {
    const updated = employees.map(emp => 
      emp.id === id ? { ...emp, status: "Paid", paymentDate: new Date().toISOString().split("T")[0] } : emp
    );
    setEmployees(updated);
    saveUserData(billingHistory, updated);
  };

  const handleDeleteEmployee = (id: number) => {
    if (confirm("Remove this employee from payroll?")) {
      const updated = employees.filter(emp => emp.id !== id);
      setEmployees(updated);
      saveUserData(billingHistory, updated);
    }
  };

  const handleDownloadPayslip = async (emp: any) => {
    setSelectedPayslipEmp(emp);
    setTimeout(async () => {
      if (!payslipRef.current) return;
      try {
        const canvas = await html2canvas(payslipRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Payslip_${emp.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (err) {
        console.error("Error generating payslip PDF", err);
      } finally {
        setSelectedPayslipEmp(null);
      }
    }, 300);
  };

  // --- Documents Functions ---
  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;
    const newDoc = {
      id: Date.now(),
      name: docName,
      category: docCategory,
      date: new Date().toISOString().split("T")[0],
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      verified: true
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    localStorage.setItem(`triotax_documents_${username}`, JSON.stringify(updated));
    setDocName("");
    setIsAddDocOpen(false);
  };

  const handleDeleteDoc = (id: number) => {
    if (confirm("Delete this document from vault?")) {
      const updated = documents.filter(d => d.id !== id);
      setDocuments(updated);
      localStorage.setItem(`triotax_documents_${username}`, JSON.stringify(updated));
    }
  };

  const handleDownloadDoc = (doc: any) => {
    const content = `========================================================\nTRIOTAX SECURE DOCUMENT VAULT\n========================================================\nDocument Name: ${doc.name}\nCategory: ${doc.category}\nAccount Holder: ${username}\nVerification: Admin Verified & Cryptographically Signed\nDate Added: ${doc.date}\nFile Size: ${doc.size}\n========================================================\n\nThis document is maintained securely within the TrioTax Corporate Vault.\nFor official compliance submission, verify with your tax administrator.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.name.replace(/[^a-zA-Z0-9_-]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Reports Export CSV ---
  const handleExportCSV = () => {
    const totalSales = billingHistory.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalPurchases = purchases.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + (emp.netSalary || 0), 0);
    const netProfit = totalSales - (totalPurchases + totalExpenses + totalMonthlyPayroll);

    let csv = `TrioTax Financial & Tax Report - ${username}\n`;
    csv += `Generated On,${new Date().toLocaleDateString()}\n\n`;
    csv += `EXECUTIVE SUMMARY\n`;
    csv += `Metric,Amount (INR)\n`;
    csv += `Total Sales Revenue,${totalSales.toFixed(2)}\n`;
    csv += `Total Purchases & Inbound Goods,${totalPurchases.toFixed(2)}\n`;
    csv += `Total Operational Expenses,${totalExpenses.toFixed(2)}\n`;
    csv += `Total Monthly Payroll,${totalMonthlyPayroll.toFixed(2)}\n`;
    csv += `Net Operating Position,${netProfit.toFixed(2)}\n\n`;

    csv += `SALES INVOICES\n`;
    csv += `Invoice No,Date,Customer,Amount (INR)\n`;
    billingHistory.forEach(item => {
      csv += `"${item.invoiceNumber || ""}","${item.date || ""}","${item.customer || ""}","${(item.amount || 0).toFixed(2)}"\n`;
    });

    csv += `\nPURCHASE BILLS\n`;
    csv += `Bill No,Vendor,Category,Date,Amount (INR),GST Paid (INR),Status\n`;
    purchases.forEach(item => {
      csv += `"${item.billNumber}","${item.vendor}","${item.category}","${item.date}","${item.amount}","${item.gstPaid}","${item.status}"\n`;
    });

    csv += `\nOPERATIONAL EXPENSES\n`;
    csv += `Description,Category,Date,Mode,Amount (INR)\n`;
    expenses.forEach(item => {
      csv += `"${item.title}","${item.category}","${item.date}","${item.mode}","${item.amount}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TrioTax_Financial_Report_${username}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Aggregate Financial Calculations ---
  const totalSales = billingHistory.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalPurchases = purchases.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + (emp.netSalary || 0), 0);
  const totalPendingSalaries = employees.filter(e => e.status === "Pending").reduce((sum, emp) => sum + (emp.netSalary || 0), 0);
  
  const totalInflow = payments.filter(p => p.type === "Inflow").reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalOutflow = payments.filter(p => p.type === "Outflow").reduce((sum, p) => sum + (p.amount || 0), 0);
  const netCashFlow = totalInflow - totalOutflow;

  const totalGstOutput = Math.round(totalSales * 0.18 / 1.18);
  const totalGstItc = purchases.reduce((sum, p) => sum + (p.gstPaid || 0), 0);
  const netGstPayable = Math.max(0, totalGstOutput - totalGstItc);
  const operatingProfit = totalSales - (totalPurchases + totalExpenses + totalMonthlyPayroll);

  // --- Dynamic Content Rendering ---
  const renderContent = () => {
    switch (activeTab) {
      case "home":
      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {username}!</h2>
            
            {/* Top Admin Scrolling Ad Banner */}
            <ScrollingAdBanner />

            <StockTicker />

            {/* GST & Regulatory Status Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Account Compliance Status</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Admin Note:</span> All core services active. Your GST, ROC & Payroll ledgers are up to date.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-bold rounded-full flex items-center gap-1.5">
                  <CheckCircle size={14} /> Account Active & Verified
                </span>
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  View Invoices &rarr;
                </button>
              </div>
            </div>

            {/* 4 Primary Financial Metric Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div 
                onClick={() => setActiveTab("sales")}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                <div className="h-11 w-11 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Sales</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{totalSales.toFixed(2)}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{billingHistory.length} Invoices created &rarr;</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab("purchases")}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
              >
                <div className="h-11 w-11 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Purchases</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{totalPurchases.toFixed(2)}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{purchases.length} Purchase bills &rarr;</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab("expenses")}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 transition-all"
              >
                <div className="h-11 w-11 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Expenses</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{totalExpenses.toFixed(2)}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{expenses.length} Expense records &rarr;</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab("payroll")}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-all"
              >
                <div className="h-11 w-11 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center border border-purple-100 dark:border-purple-900/40">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Monthly Payroll</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{totalMonthlyPayroll.toFixed(2)}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{employees.length} Staff members &rarr;</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 dark:from-emerald-950/40 dark:via-blue-950/40 dark:to-indigo-950/40 p-5 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white text-sm">Quick Operations</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Perform common business tasks with a single click.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveTab("sales")}
                  className="px-3.5 py-1.5 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-1.5"
                >
                  <Plus size={13} /> New Invoice
                </button>
                <button
                  onClick={() => { setActiveTab("purchases"); setIsAddPurchaseOpen(true); }}
                  className="px-3.5 py-1.5 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-1.5"
                >
                  <Plus size={13} /> Record Purchase
                </button>
                <button
                  onClick={() => { setActiveTab("expenses"); setIsAddExpenseOpen(true); }}
                  className="px-3.5 py-1.5 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Expense
                </button>
                <button
                  onClick={() => setActiveTab("compliance-tracker")}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <CheckCircle size={13} /> Compliance Live
                </button>
              </div>
            </div>

            {/* Split Operations Grid: Recent Sales & Upcoming Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Invoices Card */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Recent Sales Invoices</h3>
                  <button onClick={() => setActiveTab("sales")} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    View All &rarr;
                  </button>
                </div>
                {billingHistory.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    No sales invoices recorded yet. Click on "Sales" to generate your first invoice.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {billingHistory.slice(0, 4).map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{item.customer || "Client"}</p>
                          <p className="text-xs text-gray-400">{item.invoiceNumber} • {item.date}</p>
                        </div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Compliance Deadlines Card */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Upcoming Regulatory Deadlines</h3>
                  <button onClick={() => setActiveTab("compliance-tracker")} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    Open Tracker &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {complianceTasks.slice(0, 4).map((task) => {
                    const isDone = task.status?.includes("Completed") || task.status?.includes("Done");
                    return (
                      <div key={task.id} className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{task.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Due: {task.due}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                          isDone 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case "sales":
      case "billing-software":
        return (
          <div className="space-y-6 pt-4">
            {/* Top Admin Scrolling Ad Banner */}
            <ScrollingAdBanner />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sales & Invoicing</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Generate GST invoices, manage line items, and export professional PDF bills.</p>
              </div>
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-semibold text-sm rounded-xl border border-blue-200 dark:border-blue-800 transition-colors self-start sm:self-auto"
              >
                View Sales History ({billingHistory.length})
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Invoice Settings</h3>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium transition-colors">
                      <Upload size={16} /> Upload Logo
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setTemplate(1)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          template === 1 ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        Modern
                      </button>
                      <button
                        onClick={() => setTemplate(2)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          template === 2 ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        Classic
                      </button>
                    </div>

                    <button
                      onClick={() => setIsAdvancedEdit(!isAdvancedEdit)}
                      className={`ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isAdvancedEdit
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-2 ring-indigo-400"
                          : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      <Move size={14} /> {isAdvancedEdit ? "✨ Canva Drag Mode Active" : "Canva Drag & Edit Mode"}
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Invoice Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Invoice #</label>
                      <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Customer Name</label>
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">Items / Services</h3>
                    <button
                      onClick={addItem}
                      className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
                    >
                      <Plus size={16} /> Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Item Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="flex-grow border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity || ""}
                          onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                          className="w-16 border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.price || ""}
                          onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                          className="w-24 border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>GST (18%)</span>
                      <span>₹{calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-800 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-zinc-800">
                      <span>Total</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownloadPDF}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-colors"
                >
                  <Download size={18} /> Download Tax Invoice PDF
                </button>
              </div>

              {/* Advanced Interactive Preview with Drag & Drop */}
              <div className="flex flex-col items-center">
                {isAdvancedEdit && (
                  <div className="w-full max-w-[595px] mb-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <Move size={15} />
                      <span>Drag any component block freely. Click text to inline edit.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCanvasResetKey((prev) => prev + 1)}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <RotateCcw size={12} /> Reset Canvas
                    </button>
                  </div>
                )}
                
                <div
                  ref={invoiceRef}
                  contentEditable={isAdvancedEdit}
                  suppressContentEditableWarning={true}
                  className={`w-full max-w-[595px] min-h-[842px] bg-white text-black p-8 shadow-md rounded-sm relative overflow-hidden transition-all ${
                    isAdvancedEdit ? "outline-dashed outline-2 outline-indigo-500 bg-slate-50/50" : ""
                  }`}
                >
                  <div key={canvasResetKey} className="space-y-6 relative">
                    {template === 1 ? (
                      <>
                        {/* Block 1: Company Logo & Header */}
                        <motion.div
                          drag={isAdvancedEdit}
                          dragConstraints={invoiceRef}
                          dragElastic={0.05}
                          dragMomentum={false}
                          className={`relative transition-all ${
                            isAdvancedEdit ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-indigo-500 rounded-lg p-3 bg-indigo-50/30 group border border-dashed border-indigo-300" : ""
                          }`}
                        >
                          {isAdvancedEdit && (
                            <div className="absolute -top-3 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 pointer-events-none z-10">
                              <GripVertical size={10} /> Header & Logo Block (Drag Me)
                            </div>
                          )}
                          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                            <div>
                              {logo ? (
                                <img src={logo} alt="Logo" className="h-12 object-contain mb-2" />
                              ) : (
                                <div className="h-10 w-32 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 font-bold mb-2">
                                  COMPANY LOGO
                                </div>
                              )}
                              <h2 className="text-xl font-bold text-gray-800 capitalize">{username}</h2>
                              <p className="text-xs text-gray-500">Official Tax & Compliance Invoice</p>
                            </div>
                            <div className="text-right">
                              <h1 className="text-2xl font-bold text-blue-600">INVOICE</h1>
                              <p className="text-xs text-gray-500 mt-1">#{invoiceNumber}</p>
                              <p className="text-xs text-gray-500">Date: {invoiceDate || new Date().toISOString().split("T")[0]}</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Block 2: Billed To Details */}
                        <motion.div
                          drag={isAdvancedEdit}
                          dragConstraints={invoiceRef}
                          dragElastic={0.05}
                          dragMomentum={false}
                          className={`relative transition-all ${
                            isAdvancedEdit ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-indigo-500 rounded-lg p-3 bg-indigo-50/30 group border border-dashed border-indigo-300" : ""
                          }`}
                        >
                          {isAdvancedEdit && (
                            <div className="absolute -top-3 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 pointer-events-none z-10">
                              <GripVertical size={10} /> Customer Details Block (Drag Me)
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase">Billed To</p>
                              <p className="font-bold text-gray-800">{customerName || "Customer Name"}</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Block 3: Items / Services Table */}
                        <motion.div
                          drag={isAdvancedEdit}
                          dragConstraints={invoiceRef}
                          dragElastic={0.05}
                          dragMomentum={false}
                          className={`relative transition-all ${
                            isAdvancedEdit ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-indigo-500 rounded-lg p-3 bg-indigo-50/30 group border border-dashed border-indigo-300" : ""
                          }`}
                        >
                          {isAdvancedEdit && (
                            <div className="absolute -top-3 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 pointer-events-none z-10">
                              <GripVertical size={10} /> Items Table Block (Drag Me)
                            </div>
                          )}
                          <table className="w-full text-left border-collapse text-sm">
                            <thead>
                              <tr className="border-b border-gray-300 text-gray-500 text-xs uppercase">
                                <th className="py-2">Item Description</th>
                                <th className="py-2 text-center">Qty</th>
                                <th className="py-2 text-right">Price</th>
                                <th className="py-2 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100">
                                  <td className="py-3 font-medium">{item.description || "Service Item"}</td>
                                  <td className="py-3 text-center">{item.quantity}</td>
                                  <td className="py-3 text-right">₹{item.price.toFixed(2)}</td>
                                  <td className="py-3 text-right">₹{(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </motion.div>

                        {/* Block 4: Financial Summary & Total */}
                        <motion.div
                          drag={isAdvancedEdit}
                          dragConstraints={invoiceRef}
                          dragElastic={0.05}
                          dragMomentum={false}
                          className={`relative transition-all ${
                            isAdvancedEdit ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-indigo-500 rounded-lg p-3 bg-indigo-50/30 group border border-dashed border-indigo-300" : ""
                          }`}
                        >
                          {isAdvancedEdit && (
                            <div className="absolute -top-3 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 pointer-events-none z-10">
                              <GripVertical size={10} /> Totals Summary Block (Drag Me)
                            </div>
                          )}
                          <div className="flex justify-end pt-2">
                            <div className="w-48 space-y-2 text-sm">
                              <div className="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <span>₹{calculateSubtotal().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-gray-600">
                                <span>GST (18%):</span>
                                <span>₹{calculateTax().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 text-gray-900">
                                <span>Total:</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        {/* Classic Template Block 1: Header */}
                        <motion.div
                          drag={isAdvancedEdit}
                          dragConstraints={invoiceRef}
                          dragElastic={0.05}
                          dragMomentum={false}
                          className={`relative font-serif transition-all ${
                            isAdvancedEdit ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-indigo-500 rounded-lg p-3 bg-indigo-50/30 group border border-dashed border-indigo-300" : ""
                          }`}
                        >
                          {isAdvancedEdit && (
                            <div className="absolute -top-3 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 pointer-events-none z-10">
                              <GripVertical size={10} /> Header Block (Drag Me)
                            </div>
                          )}
                          <div className="text-center border-b-2 border-black pb-4">
                            <h1 className="text-3xl font-bold tracking-wide capitalize">{username}</h1>
                            <p className="text-xs italic text-gray-600">INVOICE #{invoiceNumber}</p>
                          </div>
                        </motion.div>

                        {/* Classic Template Block 2: Details */}
                        <motion.div
                          drag={isAdvancedEdit}
                          dragConstraints={invoiceRef}
                          dragElastic={0.05}
                          dragMomentum={false}
                          className={`relative font-serif transition-all ${
                            isAdvancedEdit ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-indigo-500 rounded-lg p-3 bg-indigo-50/30 group border border-dashed border-indigo-300" : ""
                          }`}
                        >
                          {isAdvancedEdit && (
                            <div className="absolute -top-3 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 pointer-events-none z-10">
                              <GripVertical size={10} /> Details Block (Drag Me)
                            </div>
                          )}
                          <div className="flex justify-between text-xs">
                            <div>
                              <p className="font-bold">Billed To:</p>
                              <p>{customerName || "Customer Name"}</p>
                            </div>
                            <div className="text-right">
                              <p><strong>Date:</strong> {invoiceDate || new Date().toISOString().split("T")[0]}</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Classic Template Block 3: Table */}
                        <motion.div
                          drag={isAdvancedEdit}
                          dragConstraints={invoiceRef}
                          dragElastic={0.05}
                          dragMomentum={false}
                          className={`relative font-serif transition-all ${
                            isAdvancedEdit ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-indigo-500 rounded-lg p-3 bg-indigo-50/30 group border border-dashed border-indigo-300" : ""
                          }`}
                        >
                          {isAdvancedEdit && (
                            <div className="absolute -top-3 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 pointer-events-none z-10">
                              <GripVertical size={10} /> Table Block (Drag Me)
                            </div>
                          )}
                          <table className="w-full text-left border border-black text-xs">
                            <thead>
                              <tr className="border-b border-black bg-gray-100">
                                <th className="p-2 border-r border-black">Description</th>
                                <th className="p-2 border-r border-black text-center">Qty</th>
                                <th className="p-2 border-r border-black text-right">Rate</th>
                                <th className="p-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item) => (
                                <tr key={item.id} className="border-b border-black">
                                  <td className="p-2 border-r border-black">{item.description || "Service Item"}</td>
                                  <td className="p-2 border-r border-black text-center">{item.quantity}</td>
                                  <td className="p-2 border-r border-black text-right">₹{item.price.toFixed(2)}</td>
                                  <td className="p-2 text-right">₹{(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </motion.div>

                        {/* Classic Template Block 4: Summary */}
                        <motion.div
                          drag={isAdvancedEdit}
                          dragConstraints={invoiceRef}
                          dragElastic={0.05}
                          dragMomentum={false}
                          className={`relative font-serif transition-all ${
                            isAdvancedEdit ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-indigo-500 rounded-lg p-3 bg-indigo-50/30 group border border-dashed border-indigo-300" : ""
                          }`}
                        >
                          {isAdvancedEdit && (
                            <div className="absolute -top-3 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 pointer-events-none z-10">
                              <GripVertical size={10} /> Summary Block (Drag Me)
                            </div>
                          )}
                          <div className="flex justify-end text-xs">
                            <div className="w-48 space-y-1">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>₹{calculateSubtotal().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>GST (18%):</span>
                                <span>₹{calculateTax().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-sm border-t border-black pt-1">
                                <span>Total Amount:</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "purchases":
        const filteredPurchases = purchases.filter(p => {
          const matchSearch = p.vendor?.toLowerCase().includes(purchaseSearch.toLowerCase()) || p.billNumber?.toLowerCase().includes(purchaseSearch.toLowerCase());
          const matchFilter = purchaseFilter === "All" || p.status === purchaseFilter;
          return matchSearch && matchFilter;
        });

        return (
          <div className="space-y-6 pt-4">
            <ScrollingAdBanner />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Purchase Management</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Track vendor bills, purchase orders, and claim Input Tax Credit (ITC).</p>
              </div>
              <button
                onClick={() => setIsAddPurchaseOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm flex items-center gap-2 self-start sm:self-auto transition-colors"
              >
                <Plus size={16} /> Record Purchase Bill
              </button>
            </div>

            {/* Purchases Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Purchases</span>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">₹{totalPurchases.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">{purchases.length} total vendor bills recorded</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">GST Input Tax Credit</span>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹{totalGstItc.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">Eligible to offset outward tax liability</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending Dues</span>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  ₹{purchases.filter(p => p.status === "Pending").reduce((s, p) => s + (p.amount || 0), 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-1">{purchases.filter(p => p.status === "Pending").length} bills pending clearance</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendor or bill #..."
                  value={purchaseSearch}
                  onChange={(e) => setPurchaseSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg outline-none text-gray-800 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {(["All", "Paid", "Pending"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPurchaseFilter(filter)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      purchaseFilter === filter
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Purchases Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4">Bill Number</th>
                      <th className="px-6 py-4">Vendor</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Amount (₹)</th>
                      <th className="px-6 py-4 text-right">GST Paid (ITC)</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {filteredPurchases.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                          No purchase bills found. Click "+ Record Purchase Bill" to add one.
                        </td>
                      </tr>
                    ) : (
                      filteredPurchases.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="px-6 py-4 font-mono font-semibold text-gray-800 dark:text-white">{p.billNumber}</td>
                          <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{p.vendor}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md text-xs text-gray-600 dark:text-gray-300">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{p.date}</td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">₹{p.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">₹{p.gstPaid.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleTogglePurchaseStatus(p.id)}
                              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                                p.status === "Paid"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                              }`}
                            >
                              {p.status}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDeletePurchase(p.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <Trash2 size={16} />
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
        );

      case "expenses":
        const filteredExpenses = expenses.filter(e => expenseCategoryFilter === "All" || e.category === expenseCategoryFilter);
        const categories = ["All", "Rent & Facilities", "Utilities & Internet", "Software & Subscriptions", "Meals & Entertainment", "Marketing & Ads", "Travel", "Office Supplies"];

        return (
          <div className="space-y-6 pt-4">
            <ScrollingAdBanner />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Business Expense Tracker</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Categorize organizational spending, analyze overhead costs, and optimize budgets.</p>
              </div>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm flex items-center gap-2 self-start sm:self-auto transition-colors"
              >
                <Plus size={16} /> Add Business Expense
              </button>
            </div>

            {/* Expenses Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Expenses</span>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">₹{totalExpenses.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">{expenses.length} expense items recorded</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Average Expense Size</span>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  ₹{expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : "0.00"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Per transaction average</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Spend Category</span>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">Rent & Facilities</p>
                <p className="text-xs text-gray-400 mt-1">Primary overhead driver</p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setExpenseCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    expenseCategoryFilter === cat
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Expenses Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4">Expense Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Payment Mode</th>
                      <th className="px-6 py-4 text-right">Amount (₹)</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                          No expenses recorded in this category. Click "+ Add Business Expense" to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">{e.title}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
                              {e.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{e.date}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-xs font-mono">{e.mode}</td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">₹{e.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400">
                              {e.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDeleteExpense(e.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <Trash2 size={16} />
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
        );

      case "payments-tracker":
        const filteredPayments = payments.filter(p => {
          if (paymentFilter === "All") return true;
          if (paymentFilter === "Inflow") return p.type === "Inflow";
          if (paymentFilter === "Outflow") return p.type === "Outflow";
          if (paymentFilter === "Pending") return p.status === "Pending";
          return true;
        });

        return (
          <div className="space-y-6 pt-4">
            <ScrollingAdBanner />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payments Tracker</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Real-time ledger of inbound client collections and outbound vendor disbursements.</p>
              </div>
              <button
                onClick={() => setIsAddPaymentOpen(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm flex items-center gap-2 self-start sm:self-auto transition-colors"
              >
                <Plus size={16} /> Record Transaction
              </button>
            </div>

            {/* Cash Flow Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Inflow (Received)</span>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">+₹{totalInflow.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">Client settlements & advances</p>
                </div>
                <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                  <ArrowDownLeft size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Outflow (Disbursed)</span>
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">-₹{totalOutflow.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">Vendors, rent & operations</p>
                </div>
                <div className="h-12 w-12 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center">
                  <ArrowUpRight size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Cash Position</span>
                  <p className={`text-2xl font-bold mt-1 ${netCashFlow >= 0 ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {netCashFlow >= 0 ? "+" : ""}₹{netCashFlow.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Net operational liquidity</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <Wallet size={24} />
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-zinc-800 pb-3">
              {(["All", "Inflow", "Outflow", "Pending"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPaymentFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    paymentFilter === tab
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {tab === "All" ? "All Transactions" : tab === "Inflow" ? "Inflow (Received)" : tab === "Outflow" ? "Outflow (Paid)" : "Pending"}
                </button>
              ))}
            </div>

            {/* Transactions Ledger Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4">Transaction / Party</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Method & Ref</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Amount (₹)</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                          No transactions found in this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-800 dark:text-white">{pay.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Party: {pay.party}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 w-max ${
                              pay.type === "Inflow"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                            }`}>
                              {pay.type === "Inflow" ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                              {pay.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{pay.method}</p>
                            <p className="text-[11px] font-mono text-gray-400">{pay.ref}</p>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">{pay.date}</td>
                          <td className={`px-6 py-4 text-right font-bold ${
                            pay.type === "Inflow" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          }`}>
                            {pay.type === "Inflow" ? "+" : "-"}₹{pay.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleTogglePaymentStatus(pay.id)}
                              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                                pay.status === "Cleared"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                              }`}
                            >
                              {pay.status}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDeletePayment(pay.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <Trash2 size={16} />
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
        );

      case "compliance-tracker":
        return (
          <div className="space-y-6 pt-4">
            {/* Top Admin Scrolling Ad Banner */}
            <ScrollingAdBanner />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Compliance tracker</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Track all your compliance tasks and deadlines updated live by your tax administrator.</p>
              </div>
              <span className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800 self-start sm:self-auto flex items-center gap-1.5">
                <CheckCircle size={14} /> Admin Verified Status
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceTasks.map((item, i) => {
                const isCompleted = item.status?.includes("Completed") || item.status?.includes("Done");
                const isOngoing = item.status?.includes("Ongoing");

                return (
                  <div key={item.id || i} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-start gap-4">
                    <div className="h-11 w-11 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-900/40">
                      <FileText size={19} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">{item.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Due: {item.due}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" :
                      isOngoing ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800" :
                      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                    }`}>{item.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "payroll":
      case "payrolls":
        return (
          <div className="space-y-6 pt-4">
            {/* Top Admin Scrolling Ad Banner */}
            <ScrollingAdBanner />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Employee Payroll Management</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage employee salaries, allowances, deductions, and generate monthly payslips.</p>
              </div>
              <button
                onClick={() => setIsAddEmpOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
              >
                <Plus size={16} /> Add Employee
              </button>
            </div>

            {/* Payroll Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Active Staff</span>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{employees.length}</p>
                <p className="text-xs text-gray-400 mt-1">Active staff on payroll</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monthly Payroll Disbursal</span>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">₹{totalMonthlyPayroll.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">Total net salary commitment</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending Disbursals</span>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">₹{totalPendingSalaries.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">Awaiting salary payment</p>
              </div>
            </div>

            {/* Employee Records Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-white text-base">Staff Payroll Register</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Automatic HRA & Deductions Calculation</span>
              </div>

              {employees.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Users size={36} className="mx-auto mb-3 opacity-40" />
                  <p className="font-medium text-base text-gray-600 dark:text-gray-300">No employees added yet.</p>
                  <p className="text-sm mt-1">Click "Add Employee" above to configure your team's salaries.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold border-b border-gray-100 dark:border-zinc-800">
                      <tr>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4 text-right">Basic (₹)</th>
                        <th className="px-6 py-4 text-right">HRA / Bonus (₹)</th>
                        <th className="px-6 py-4 text-right">Deductions (₹)</th>
                        <th className="px-6 py-4 text-right">Net Salary (₹)</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-800 dark:text-white">{emp.name}</p>
                            <p className="text-xs text-gray-400">ID: #{emp.id.toString().slice(-4)}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{emp.role}</td>
                          <td className="px-6 py-4 text-right font-medium text-gray-700 dark:text-gray-300">₹{emp.basic.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">+₹{emp.hra.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-rose-500 dark:text-rose-400 font-medium">-₹{emp.deductions.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">₹{emp.netSalary.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              emp.status === "Paid"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {emp.status !== "Paid" && (
                                <button
                                  onClick={() => handleMarkPaid(emp.id)}
                                  className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                                  title="Mark as Disbursed"
                                >
                                  Disburse
                                </button>
                              )}
                              <button
                                onClick={() => handleDownloadPayslip(emp)}
                                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Download Payslip PDF"
                              >
                                <FileText size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(emp.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Remove Staff"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
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

      case "documents":
        const filteredDocs = documents.filter(d => {
          const matchCat = docFilter === "All" || d.category === docFilter;
          const matchSearch = d.name.toLowerCase().includes(docSearch.toLowerCase());
          return matchCat && matchSearch;
        });

        return (
          <div className="space-y-6 pt-4">
            <ScrollingAdBanner />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Documents</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Secure repository for GST certificates, incorporation documents, registrations, and licenses.</p>
              </div>
              <button
                onClick={() => setIsAddDocOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm flex items-center gap-2 self-start sm:self-auto transition-colors"
              >
                <Upload size={16} /> Upload Document
              </button>
            </div>

            {/* Document Vault Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Stored Files</span>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{documents.length}</p>
                <p className="text-xs text-gray-400 mt-1">Encrypted & archived in vault</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verified by Admin</span>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {documents.filter(d => d.verified).length} Files
                </p>
                <p className="text-xs text-gray-400 mt-1">Certified for tax audit</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vault Integrity</span>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">100% Secure</p>
                <p className="text-xs text-gray-400 mt-1">All certificates verified</p>
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search file name..."
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg outline-none text-gray-800 dark:text-white"
                />
              </div>
              <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                {(["All", "Tax Filings", "Registrations", "Legal & Licenses"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDocFilter(filter)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      docFilter === filter
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText size={20} />
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle size={11} /> Verified
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-base mt-3 line-clamp-2">{doc.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{doc.category} • {doc.size}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Uploaded: {doc.date}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <button
                      onClick={() => handleDownloadDoc(doc)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Download size={13} /> Download
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6 pt-4">
            <ScrollingAdBanner />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Reports</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Comprehensive financial health, tax compliance calculations, and P&L snapshots.</p>
              </div>
              <div className="flex gap-2 self-start sm:self-auto">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm flex items-center gap-2 transition-colors"
                >
                  <Download size={15} /> Export CSV
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Printer size={15} /> Print
                </button>
              </div>
            </div>

            {/* P&L Executive Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gross Sales Revenue</span>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{totalSales.toFixed(2)}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">From {billingHistory.length} sales invoices</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Purchases</span>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{totalPurchases.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">Inbound goods & supplies</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Operating Expenses</span>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{totalExpenses.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">Rent, utilities & overhead</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Operating Profit</span>
                <p className={`text-2xl font-bold mt-1 ${operatingProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {operatingProfit >= 0 ? "+" : ""}₹{operatingProfit.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-1">After payroll & all costs</p>
              </div>
            </div>

            {/* Split Financial Summaries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GST Tax Summary Card */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 dark:text-white text-base flex items-center gap-2">
                  <Shield size={18} className="text-blue-600" /> GST Tax Position (GSTR-3B Estimate)
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Output GST Collected (Sales)</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{totalGstOutput.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400">Input Tax Credit (ITC) from Purchases</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">-₹{totalGstItc.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <span className="font-semibold text-blue-900 dark:text-blue-300">Net Estimated GST Payable</span>
                    <span className="font-bold text-blue-900 dark:text-blue-300">₹{netGstPayable.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payroll & Operating Cost Distribution */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 dark:text-white text-base flex items-center gap-2">
                  <Users size={18} className="text-purple-600" /> Operational Cost Breakdown
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400">Employee Payroll Disbursal</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{totalMonthlyPayroll.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400">Vendor Purchases & Procurement</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{totalPurchases.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400">General Overhead & Facilities</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{totalExpenses.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username / ID</label>
                      <input type="text" readOnly disabled className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 bg-gray-100 font-bold capitalize outline-none" value={username} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registered Account</label>
                      <input type="text" readOnly disabled className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 bg-gray-100 outline-none" value={`${username}@triotax.com`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                      <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                      <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                    <div className="pt-2">
                      <button onClick={() => alert("Password updated successfully!")} className="bg-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-gray-100 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Sidebar navigation strictly styled as per user image mockup
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 transition-colors">
      <div className="p-5 pb-3">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#65a33a]"></span>
          User Accounts
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">@{username}</p>
      </div>
      
      {/* Boxed Tabs list matching user image */}
      <div className="flex-1 px-4 py-3 space-y-2.5 overflow-y-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileMenuOpen(false);
                window.history.pushState(null, "", `/${username}-user/${tab.id}`);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-[3px] text-[15px] transition-all flex items-center justify-between border-[1.5px] border-black ${
                isActive
                  ? "bg-[#65a33a] text-black font-semibold shadow-sm dark:bg-[#528d2d] dark:text-white dark:border-black"
                  : "bg-[#e2efda] text-black font-medium hover:bg-[#d5e8cb] dark:bg-[#1a2d18] dark:text-gray-100 dark:border-zinc-700 hover:dark:bg-[#253f22]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <tab.icon size={17} className={isActive ? "text-black dark:text-white" : "text-black/80 dark:text-gray-300"} />
                <span className="tracking-wide">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
        <ThemeToggle />
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#060e1d] text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-full flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-64 h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white capitalize">
              {tabs.find((t) => t.id === activeTab)?.label || "Home"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{username}</span>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center rounded-full capitalize">
              {username.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Record Purchase Modal */}
      <AnimatePresence>
        {isAddPurchaseOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddPurchaseOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">Record Purchase Bill</h3>
                <button onClick={() => setIsAddPurchaseOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddPurchase} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Vendor / Supplier Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Tech Hardware"
                    value={purchaseVendor}
                    onChange={(e) => setPurchaseVendor(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Bill / Invoice No.</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PUR-2024-001"
                      value={purchaseBillNo}
                      onChange={(e) => setPurchaseBillNo(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Bill Date</label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={purchaseCategory}
                    onChange={(e) => setPurchaseCategory(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  >
                    <option value="Hardware & Equipment">Hardware & Equipment</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Cloud & Servers">Cloud & Servers</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Total Bill Amount (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 25000"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">GST / ITC Paid (₹)</label>
                    <input
                      type="number"
                      placeholder="Optional (18% default)"
                      value={purchaseGst}
                      onChange={(e) => setPurchaseGst(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={purchaseStatus}
                    onChange={(e) => setPurchaseStatus(e.target.value as any)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddPurchaseOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm"
                  >
                    Save Purchase Bill
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isAddExpenseOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddExpenseOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">Add Business Expense</h3>
                <button onClick={() => setIsAddExpenseOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Expense Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Commercial Office Rent - Nov"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Rent & Facilities">Rent & Facilities</option>
                      <option value="Utilities & Internet">Utilities & Internet</option>
                      <option value="Software & Subscriptions">Software & Subscriptions</option>
                      <option value="Meals & Entertainment">Meals & Entertainment</option>
                      <option value="Marketing & Ads">Marketing & Ads</option>
                      <option value="Travel">Travel</option>
                      <option value="Office Supplies">Office Supplies</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Payment Mode</label>
                    <select
                      value={expenseMode}
                      onChange={(e) => setExpenseMode(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5000"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddExpenseOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                  >
                    Save Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Record Payment Transaction Modal */}
      <AnimatePresence>
        {isAddPaymentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddPaymentOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">Record Payment Transaction</h3>
                <button onClick={() => setIsAddPaymentOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddPayment} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Transaction Type</label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as any)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Inflow">Inflow (Money In / Received)</option>
                      <option value="Outflow">Outflow (Money Out / Paid)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as any)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Cleared">Cleared</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Transaction Purpose / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Client Invoice Settlement"
                    value={paymentTitle}
                    onChange={(e) => setPaymentTitle(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Party / Client / Payee Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Enterprises Ltd"
                    value={paymentParty}
                    onChange={(e) => setPaymentParty(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50000"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="UPI">UPI</option>
                      <option value="NEFT/RTGS">NEFT / RTGS</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Reference / UTR Number</label>
                    <input
                      type="text"
                      placeholder="e.g. UTR983471029"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddPaymentOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
                  >
                    Save Transaction
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Document Modal */}
      <AnimatePresence>
        {isAddDocOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddDocOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">Upload Document</h3>
                <button onClick={() => setIsAddDocOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddDoc} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Document Title / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FY24-25 GST Annual Return"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  >
                    <option value="Tax Filings">Tax Filings</option>
                    <option value="Registrations">Registrations</option>
                    <option value="Legal & Licenses">Legal & Licenses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Select File</label>
                  <input
                    type="file"
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-300"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddDocOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {isAddEmpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddEmpOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6 transition-colors"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">Add New Employee</h3>
                <button onClick={() => setIsAddEmpOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Full Name</label>
                  <input
                    type="text"
                    required
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation / Role</label>
                  <input
                    type="text"
                    required
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    placeholder="e.g. Senior Accountant"
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Basic Pay (₹)</label>
                    <input
                      type="number"
                      required
                      value={empBasic}
                      onChange={(e) => setEmpBasic(e.target.value ? parseFloat(e.target.value) : "")}
                      placeholder="35000"
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">HRA / Bonus (₹)</label>
                    <input
                      type="number"
                      value={empHra}
                      onChange={(e) => setEmpHra(e.target.value ? parseFloat(e.target.value) : "")}
                      placeholder="5000"
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Deductions (₹)</label>
                    <input
                      type="number"
                      value={empDeductions}
                      onChange={(e) => setEmpDeductions(e.target.value ? parseFloat(e.target.value) : "")}
                      placeholder="1800"
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddEmpOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                  >
                    Save Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Printable Payslip Template */}
      {selectedPayslipEmp && (
        <div className="fixed left-[-9999px] top-[-9999px]">
          <div ref={payslipRef} className="w-[595px] min-h-[842px] bg-white text-black p-8 font-sans space-y-6">
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 capitalize">{username}</h1>
                <p className="text-xs text-slate-500">Official Monthly Salary Slip</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">PAYSLIP</span>
                <p className="text-xs text-slate-500 mt-1">Generated: {new Date().toISOString().split("T")[0]}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold uppercase">Employee Details</span>
                <p className="font-bold text-slate-800 text-sm">{selectedPayslipEmp.name}</p>
                <p className="text-slate-600">Role: {selectedPayslipEmp.role}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-semibold uppercase">Payment Information</span>
                <p className="text-slate-600 mt-1">Status: <strong>{selectedPayslipEmp.status}</strong></p>
                <p className="text-slate-600">Date: {selectedPayslipEmp.paymentDate}</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 text-slate-700 font-bold uppercase">
                  <th className="p-3">Salary Component</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-medium">Basic Pay</td>
                  <td className="p-3 text-right">₹{selectedPayslipEmp.basic.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-medium text-emerald-600">HRA & Allowances</td>
                  <td className="p-3 text-right text-emerald-600">+₹{selectedPayslipEmp.hra.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-medium text-rose-500">PF & ESI Deductions</td>
                  <td className="p-3 text-right text-rose-500">-₹{selectedPayslipEmp.deductions.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end pt-4">
              <div className="w-56 p-4 bg-slate-900 text-white rounded-lg flex justify-between items-center text-sm font-bold">
                <span>Net Payable:</span>
                <span>₹{selectedPayslipEmp.netSalary.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-12 text-center text-xs text-slate-400 border-t border-slate-200">
              This is a computer-generated payslip created via TrioTax Dashboard.
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Billing History</h3>
                <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {billingHistory.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  No billing history recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {billingHistory.map((item) => (
                    <div key={item.id} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg flex justify-between items-center text-sm">
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{item.invoiceNumber} - {item.customer}</div>
                        <div className="text-xs text-gray-400">{item.date}</div>
                      </div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">₹{item.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
