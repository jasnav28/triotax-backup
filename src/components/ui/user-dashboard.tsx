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
  AlertCircle,
  Building,
  Building2,
  QrCode,
  ArrowRight,
  Check,
  Edit,
  FileEdit,
  RefreshCw,
  Send,
  CheckSquare,
  XCircle,
  Tag,
  Package,
  Percent,
  Bell,
  ChevronDown,
  SlidersHorizontal,
  Copy,
  Pencil,
  MoreHorizontal,
  Gift,
  HelpCircle,
  PanelLeftClose,
  ChevronLeft,
  ChevronRight,
  Bot,
  TrendingUp,
  Globe,
  Inbox,
  Compass,
  LayoutGrid,
  History,
  Info,
  LayoutDashboard,
  ChevronUp
} from "lucide-react";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { StockTicker } from "./stock-ticker";
import { ScrollingAdBanner } from "./scrolling-ad-banner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ─────────────────────────────────────────────────────────────
// INDIAN GST CONSTANTS & STATE CODES
// ─────────────────────────────────────────────────────────────
export const INDIAN_STATES: { [code: string]: string } = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra & Nagar Haveli and Daman & Diu",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
  "97": "Other Territory"
};

export const getStateFromGSTIN = (gstin: string): string => {
  if (!gstin || gstin.trim().length < 2) return "";
  const code = gstin.trim().substring(0, 2);
  return INDIAN_STATES[code] || "";
};

// ─────────────────────────────────────────────────────────────
// DATA TYPES
// ─────────────────────────────────────────────────────────────
export interface CompanyProfile {
  legalName: string;
  tradeName: string;
  entityType: "Proprietorship" | "Partnership" | "LLP" | "Pvt Ltd" | "Public Ltd";
  state: string;
  pan: string;
  gstin: string;
  cinLlpin: string;
  registeredAddress: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
  hasBranchAddress: boolean;
  branchAddress: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId: string;
  };
  logo: string | null;
  signature: string | null;
  defaultTerms: string;
  numberingConfig: {
    invoicePrefix: string;
    invoiceNext: number;
    quotePrefix: string;
    quoteNext: number;
    financialYear: string;
  };
}

export interface ClientRecord {
  id: number;
  name: string;
  gstTreatment: "Registered Business (B2B)" | "Unregistered Business (B2C)" | "Consumer" | "Overseas (Export/SEZ)";
  gstin?: string;
  placeOfSupply: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface ItemRecord {
  id: number;
  name: string;
  type: "Service" | "Goods";
  hsnSac: string;
  unit: string;
  rate: number;
  gstRate: number; // 0, 5, 12, 18, 28
  description?: string;
}

export interface QuotationRecord {
  id: number;
  quoteNumber: string;
  clientId: number;
  clientName: string;
  clientGstin?: string;
  placeOfSupply: string;
  billingAddress: string;
  quoteDate: string;
  validUntil: string;
  items: Array<{
    id: number;
    description: string;
    hsnSac: string;
    quantity: number;
    rate: number;
    discount: number;
    gstRate: number;
    taxableAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    totalAmount: number;
  }>;
  subtotal: number;
  totalDiscount: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  taxTotal: number;
  grandTotal: number;
  terms: string;
  status: "Draft" | "Sent" | "Accepted" | "Rejected" | "Converted to Invoice";
  convertedInvoiceNumber?: string;
}

export interface InvoiceRecord {
  id: number;
  invoiceNumber: string;
  clientId: number;
  customer: string;
  clientGstin?: string;
  gstTreatment: string;
  placeOfSupply: string;
  billingAddress: string;
  shippingAddress?: string;
  invoiceDate: string;
  paymentTerms: "Due on Receipt" | "Net 15" | "Net 30" | "Net 45" | "Net 60";
  dueDate: string;
  poNumber?: string;
  reverseCharge: boolean;
  supplyType: "Intra-State (CGST + SGST)" | "Inter-State (IGST)";
  items: Array<{
    id: number;
    description: string;
    hsnSac: string;
    quantity: number;
    price: number;
    discount: number;
    gstRate: number;
    taxableAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    total: number;
  }>;
  subtotal: number;
  totalDiscount: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  taxTotal: number;
  amount: number;
  amountPaid: number;
  balanceDue: number;
  status: "Unpaid" | "Partially Paid" | "Paid" | "Overdue";
  irn?: string;
  eWayBill?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId: string;
  };
  notes?: string;
  terms?: string;
  date: string;
}

export interface CreditDebitNoteRecord {
  id: number;
  type: "Credit Note" | "Debit Note";
  noteNumber: string;
  originalInvoiceNumber: string;
  originalInvoiceDate: string;
  reason: "Sales Return" | "Post-sale Discount" | "Deficiency in Services" | "Correction in Invoice" | "Other";
  clientId: number;
  clientName: string;
  date: string;
  amount: number;
  taxAmount: number;
  grandTotal: number;
  status: "Issued" | "Adjusted" | "Refunded";
  notes?: string;
}

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
  const [salesSubTab, setSalesSubTab] = useState<"invoices" | "quotes" | "notes" | "clients" | "items">("invoices");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCompanyProfileOpen, setIsCompanyProfileOpen] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceRecord | null>(null);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);
  const [activeChartHover, setActiveChartHover] = useState<number | null>(null);
  const [activeBarHover, setActiveBarHover] = useState<number | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "analytics" | "reports" | "notifications">("overview");
  const quickAccessRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickAccessRef.current && !quickAccessRef.current.contains(event.target as Node)) {
        setIsQuickAccessOpen(false);
      }
    };
    if (isQuickAccessOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isQuickAccessOpen]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  // --- Company Profile (Master Onboarding Profile) ---
  const defaultCompanyProfile: CompanyProfile = {
    legalName: "Triotax Advisors Private Limited",
    tradeName: "TrioTax",
    entityType: "Pvt Ltd",
    state: "Karnataka",
    pan: "AAACT1234F",
    gstin: "29AAACT1234F1Z5",
    cinLlpin: "U72900KA2024PTC189201",
    registeredAddress: {
      street: "Level 4, Brigade Tech Gardens, Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560066"
    },
    hasBranchAddress: false,
    branchAddress: {
      street: "",
      city: "",
      state: "",
      pinCode: ""
    },
    bankDetails: {
      accountName: "Triotax Advisors Pvt Ltd",
      accountNumber: "50200088991122",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank Ltd",
      upiId: "triotax@hdfcbank"
    },
    logo: null,
    signature: null,
    defaultTerms: "1. Payment is strictly due according to agreed credit terms.\n2. In case of delayed settlement, interest @18% p.a. may apply.\n3. All disputes subject to local jurisdiction.",
    numberingConfig: {
      invoicePrefix: "INV/26-27/",
      invoiceNext: 101,
      quotePrefix: "QT/26-27/",
      quoteNext: 101,
      financialYear: "2026-2027"
    }
  };

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(defaultCompanyProfile);

  // --- Pre-Transaction Masters ---
  // A. Customer / Client Master
  const defaultClients: ClientRecord[] = [];

  const [clients, setClients] = useState<ClientRecord[]>(defaultClients);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clientNameInput, setClientNameInput] = useState("");
  const [clientGstTreatment, setClientGstTreatment] = useState<ClientRecord["gstTreatment"]>("Registered Business (B2B)");
  const [clientGstinInput, setClientGstinInput] = useState("");
  const [clientStateInput, setClientStateInput] = useState("Karnataka");
  const [clientStreetInput, setClientStreetInput] = useState("");
  const [clientCityInput, setClientCityInput] = useState("");
  const [clientPinInput, setClientPinInput] = useState("");
  const [clientContactName, setClientContactName] = useState("");
  const [clientEmailInput, setClientEmailInput] = useState("");
  const [clientPhoneInput, setClientPhoneInput] = useState("");

  // B. Item / Service Master
  const defaultItems: ItemRecord[] = [];

  const [itemsCatalog, setItemsCatalog] = useState<ItemRecord[]>(defaultItems);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [itemNameInput, setItemNameInput] = useState("");
  const [itemTypeInput, setItemTypeInput] = useState<"Service" | "Goods">("Service");
  const [itemHsnInput, setItemHsnInput] = useState("9982");
  const [itemUnitInput, setItemUnitInput] = useState("Service");
  const [itemRateInput, setItemRateInput] = useState<number | "">("");
  const [itemGstInput, setItemGstInput] = useState<number>(18);
  const [itemDescInput, setItemDescInput] = useState("");

  // --- Quotations / Estimates State ---
  const defaultQuotations: QuotationRecord[] = [];

  const [quotations, setQuotations] = useState<QuotationRecord[]>(defaultQuotations);
  const [isCreateQuoteOpen, setIsCreateQuoteOpen] = useState(false);
  const [quoteClientId, setQuoteClientId] = useState<number>(1);
  const [quoteValidDays, setQuoteValidDays] = useState<number>(30);
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, itemId: 1, description: "Corporate Tax Advisory & Annual Filing", hsnSac: "998231", quantity: 1, rate: 25000, discount: 0, gstRate: 18 }
  ]);
  const [quoteTerms, setQuoteTerms] = useState("Standard payment terms: 50% advance, balance on delivery.");

  // --- Invoices (Tax Invoices) State ---
  const defaultInvoices: InvoiceRecord[] = [];

  const [billingHistory, setBillingHistory] = useState<InvoiceRecord[]>(defaultInvoices);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [invoiceClientId, setInvoiceClientId] = useState<number>(1);
  const [invoiceTerms, setInvoiceTerms] = useState<InvoiceRecord["paymentTerms"]>("Net 30");
  const [invoicePoNumber, setInvoicePoNumber] = useState("");
  const [invoiceReverseCharge, setInvoiceReverseCharge] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([
    { id: 1, itemId: 1, description: "Corporate Tax Advisory & Annual Filing", hsnSac: "998231", quantity: 1, price: 25000, discount: 0, gstRate: 18 }
  ]);
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [invoiceTermsText, setInvoiceTermsText] = useState(
    "1. Payment is strictly due according to agreed credit terms.\n2. In case of delayed settlement, interest @18% p.a. may apply."
  );
  const [quoteClientId, setQuoteClientId] = useState<number>(1);
  const [quoteValidUntil, setQuoteValidUntil] = useState<string>("");
  const [quoteNotes, setQuoteNotes] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [clientGstin, setClientGstin] = useState<string>("");
  const [clientPlaceOfSupply, setClientPlaceOfSupply] = useState<string>("Karnataka");
  const [itemName, setItemName] = useState<string>("");
  const [itemHsn, setItemHsn] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<number | "">("");
  const [itemGst, setItemGst] = useState<number>(18);
  const [noteType, setNoteType] = useState<"Credit Note" | "Debit Note">("Credit Note");
  const [noteInvoiceId, setNoteInvoiceId] = useState<number>(1);
  const [noteAmount, setNoteAmount] = useState<number | "">("");
  const invoicePdfRef = useRef<HTMLDivElement>(null);

  // --- Credit & Debit Notes State ---
  const [creditDebitNotes, setCreditDebitNotes] = useState<CreditDebitNoteRecord[]>([]);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [noteType, setNoteType] = useState<"Credit Note" | "Debit Note">("Credit Note");
  const [noteOrigInv, setNoteOrigInv] = useState("");
  const [noteOrigDate, setNoteOrigDate] = useState("");
  const [noteReason, setNoteReason] = useState<CreditDebitNoteRecord["reason"]>("Sales Return");
  const [noteClientId, setNoteClientId] = useState<number>(1);
  const [noteAmount, setNoteAmount] = useState<number | "">("");

  // --- Purchases State ---
  const [purchases, setPurchases] = useState<any[]>([]);
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
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Rent & Facilities");
  const [expenseAmount, setExpenseAmount] = useState<number | "">("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseMode, setExpenseMode] = useState("UPI");
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState("All");

  // --- Payments Tracker State ---
  const [payments, setPayments] = useState<any[]>([]);
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
    { id: "gst", title: "GSTR-1 & GSTR-3B Return Filing", due: "20th of every month", status: "Ongoing" },
    { id: "tds", title: "TDS Payment Deposit", due: "7th of every month", status: "Due" },
    { id: "roc", title: "Annual ROC Filing (AOC-4 & MGT-7)", due: "30th November", status: "Due" },
    { id: "itr", title: "Corporate Income Tax Return", due: "31st October", status: "Done/Completed" },
    { id: "pf", title: "PF & ESIC Statutory Remittance", due: "15th of every month", status: "Ongoing" },
    { id: "adv_tax", title: "Advance Tax Q3 Payment", due: "15th December", status: "Due" },
  ]);

  // --- Documents State ---
  const [documents, setDocuments] = useState<any[]>([]);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("Tax Filings");
  const [docFilter, setDocFilter] = useState("All");
  const [docSearch, setDocSearch] = useState("");

  // Navigation Tabs matching user image mockup
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

  // ─────────────────────────────────────────────────────────────
  // BACKEND PERSISTENCE & DATA RESTORATION
  // ─────────────────────────────────────────────────────────────
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

  const isMockRecord = (item: any) => {
    if (!item) return false;
    const s = typeof item === "string" ? item : JSON.stringify(item);
    return (
      s.includes("Apex IT Hardware") ||
      s.includes("GreenLine Office") ||
      s.includes("CloudHost Infra") ||
      s.includes("PUR-2024-") ||
      s.includes("Commercial Office Rent - Nov") ||
      s.includes("High-speed Fiber Internet") ||
      s.includes("Client Business Dinner Meeting") ||
      s.includes("Google Workspace & Software Tools") ||
      s.includes("Digital Marketing Campaign") ||
      s.includes("UTR983471029") ||
      s.includes("UPI88720198") ||
      s.includes("UTR658392019") ||
      s.includes("Rahul Sharma") ||
      s.includes("Priya Nair") ||
      s.includes("INV/26-27/100") ||
      s.includes("INV/26-27/101") ||
      s.includes("Acme Enterprises India Pvt Ltd") ||
      s.includes("Nexus Global Technologies LLP") ||
      s.includes("Summit Retail Ventures") ||
      s.includes("GST Registration Certificate (REG-06)") ||
      s.includes("Certificate of Incorporation (COI)") ||
      s.includes("Company e-PAN") ||
      s.includes("Udyam Registration Certificate") ||
      s.includes("FY2023-24 Income Tax") ||
      s.includes("Trademark Registration Certificate")
    );
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
        const serverData = result.data || result;

        if (serverData.companyProfile || localData?.companyProfile) {
          setCompanyProfile(prev => ({ ...prev, ...(serverData.companyProfile || localData?.companyProfile) }));
        }
        if (serverData.clientMaster || localData?.clientMaster) {
          setClients((serverData.clientMaster || localData?.clientMaster || []).filter((x: any) => !isMockRecord(x)));
        }
        if (serverData.itemMaster || localData?.itemMaster) {
          setItemsCatalog((serverData.itemMaster || localData?.itemMaster || []).filter((x: any) => !isMockRecord(x)));
        }
        if (serverData.quotations || localData?.quotations) {
          setQuotations((serverData.quotations || localData?.quotations || []).filter((x: any) => !isMockRecord(x)));
        }
        if (serverData.billingHistory || localData?.billingHistory) {
          setBillingHistory((serverData.billingHistory || localData?.billingHistory || []).filter((x: any) => !isMockRecord(x)));
        }
        if (serverData.creditDebitNotes || localData?.creditDebitNotes) {
          setCreditDebitNotes((serverData.creditDebitNotes || localData?.creditDebitNotes || []).filter((x: any) => !isMockRecord(x)));
        }
        if (serverData.purchases || localData?.purchases) {
          setPurchases((serverData.purchases || localData?.purchases || []).filter((x: any) => !isMockRecord(x)));
        }
        if (serverData.expenses || localData?.expenses) {
          setExpenses((serverData.expenses || localData?.expenses || []).filter((x: any) => !isMockRecord(x)));
        }
        if (serverData.payments || localData?.payments) {
          setPayments((serverData.payments || localData?.payments || []).filter((x: any) => !isMockRecord(x)));
        }
        if (serverData.complianceTasks || localData?.complianceTasks) {
          setComplianceTasks(serverData.complianceTasks || localData?.complianceTasks);
        }
        if (serverData.employees || localData?.employees) {
          setEmployees((serverData.employees || localData?.employees || []).filter((x: any) => !isMockRecord(x)));
        }
        if (serverData.documents || localData?.documents) {
          setDocuments((serverData.documents || localData?.documents || []).filter((x: any) => !isMockRecord(x)));
        }
        return;
      }
    } catch (err) {
      console.warn("Backend data fetch error, using local fallback:", err);
    }

    if (localData) {
      if (localData.companyProfile) setCompanyProfile(prev => ({ ...prev, ...localData.companyProfile }));
      if (localData.clientMaster) setClients(localData.clientMaster.filter((x: any) => !isMockRecord(x)));
      if (localData.itemMaster) setItemsCatalog(localData.itemMaster.filter((x: any) => !isMockRecord(x)));
      if (localData.quotations) setQuotations(localData.quotations.filter((x: any) => !isMockRecord(x)));
      if (localData.billingHistory) setBillingHistory(localData.billingHistory.filter((x: any) => !isMockRecord(x)));
      if (localData.creditDebitNotes) setCreditDebitNotes(localData.creditDebitNotes.filter((x: any) => !isMockRecord(x)));
      if (localData.purchases) setPurchases(localData.purchases.filter((x: any) => !isMockRecord(x)));
      if (localData.expenses) setExpenses(localData.expenses.filter((x: any) => !isMockRecord(x)));
      if (localData.payments) setPayments(localData.payments.filter((x: any) => !isMockRecord(x)));
      if (localData.complianceTasks) setComplianceTasks(localData.complianceTasks);
      if (localData.employees) setEmployees(localData.employees.filter((x: any) => !isMockRecord(x)));
      if (localData.documents) setDocuments(localData.documents.filter((x: any) => !isMockRecord(x)));
    }
  };

  const saveAllData = async (overrides: any = {}) => {
    const payload = {
      companyProfile: overrides.companyProfile || companyProfile,
      clientMaster: overrides.clientMaster || clients,
      itemMaster: overrides.itemMaster || itemsCatalog,
      quotations: overrides.quotations || quotations,
      billingHistory: overrides.billingHistory || billingHistory,
      creditDebitNotes: overrides.creditDebitNotes || creditDebitNotes,
      purchases: overrides.purchases || purchases,
      expenses: overrides.expenses || expenses,
      payments: overrides.payments || payments,
      complianceTasks: overrides.complianceTasks || complianceTasks,
      employees: overrides.employees || employees,
      documents: overrides.documents || documents
    };

    localStorage.setItem(`triotax_user_data_${username}`, JSON.stringify(payload));
    try {
      await fetch(getCleanApiUrl(`users/${username}/data`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload })
      });
    } catch (err) {
      console.warn("Server sync error (saved locally):", err);
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

  // ─────────────────────────────────────────────────────────────
  // GST TAX & INVOICE CALCULATOR LOGIC
  // ─────────────────────────────────────────────────────────────
  const isInterStateSupply = (clientPlaceOfSupply: string, companyState: string) => {
    if (!clientPlaceOfSupply || !companyState) return false;
    return clientPlaceOfSupply.trim().toLowerCase() !== companyState.trim().toLowerCase();
  };

  // Dynamic UPI QR generator
  const getUpiQrUrl = (upiId: string, payeeName: string, amount: number, invoiceNum: string) => {
    if (!upiId) return null;
    const cleanUpi = upiId.trim();
    const upiPayload = `upi://pay?pa=${encodeURIComponent(cleanUpi)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Invoice ${invoiceNum}`)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiPayload)}`;
  };

  // HSN/SAC Summary grouping
  const getHsnSummary = (itemsList: any[], isInterState: boolean) => {
    const map: { [hsn: string]: { hsn: string; taxable: number; gstRate: number; cgst: number; sgst: number; igst: number; totalTax: number } } = {};
    itemsList.forEach((it) => {
      const hsn = it.hsnSac || "9982";
      const taxable = (it.quantity || 1) * (it.price || it.rate || 0) - (it.discount || 0);
      const rate = it.gstRate || 18;
      if (!map[hsn]) {
        map[hsn] = { hsn, taxable: 0, gstRate: rate, cgst: 0, sgst: 0, igst: 0, totalTax: 0 };
      }
      const taxVal = (taxable * rate) / 100;
      map[hsn].taxable += taxable;
      map[hsn].totalTax += taxVal;
      if (isInterState) {
        map[hsn].igst += taxVal;
      } else {
        map[hsn].cgst += taxVal / 2;
        map[hsn].sgst += taxVal / 2;
      }
    });
    return Object.values(map);
  };

  // ─────────────────────────────────────────────────────────────
  // CLIENT MASTER ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientNameInput) return;
    const newClient: ClientRecord = {
      id: Date.now(),
      name: clientNameInput,
      gstTreatment: clientGstTreatment,
      gstin: clientGstinInput.toUpperCase(),
      placeOfSupply: clientStateInput,
      billingAddress: {
        street: clientStreetInput,
        city: clientCityInput,
        state: clientStateInput,
        pinCode: clientPinInput
      },
      shippingAddress: {
        street: clientStreetInput,
        city: clientCityInput,
        state: clientStateInput,
        pinCode: clientPinInput
      },
      contact: {
        name: clientContactName,
        email: clientEmailInput,
        phone: clientPhoneInput
      }
    };

    const updated = [newClient, ...clients];
    setClients(updated);
    saveAllData({ clientMaster: updated });
    setIsAddClientOpen(false);

    // Reset inputs
    setClientNameInput("");
    setClientGstinInput("");
    setClientStreetInput("");
    setClientCityInput("");
    setClientPinInput("");
    setClientContactName("");
    setClientEmailInput("");
    setClientPhoneInput("");
  };

  const handleDeleteClient = (id: number) => {
    if (confirm("Remove this client from directory?")) {
      const updated = clients.filter(c => c.id !== id);
      setClients(updated);
      saveAllData({ clientMaster: updated });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // ITEM MASTER ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemNameInput || !itemRateInput) return;
    const newItem: ItemRecord = {
      id: Date.now(),
      name: itemNameInput,
      type: itemTypeInput,
      hsnSac: itemHsnInput,
      unit: itemUnitInput,
      rate: Number(itemRateInput) || 0,
      gstRate: Number(itemGstInput) || 18,
      description: itemDescInput
    };

    const updated = [newItem, ...itemsCatalog];
    setItemsCatalog(updated);
    saveAllData({ itemMaster: updated });
    setIsAddItemOpen(false);

    setItemNameInput("");
    setItemHsnInput("9982");
    setItemRateInput("");
    setItemDescInput("");
  };

  const handleDeleteItem = (id: number) => {
    if (confirm("Remove this product/service from catalog?")) {
      const updated = itemsCatalog.filter(i => i.id !== id);
      setItemsCatalog(updated);
      saveAllData({ itemMaster: updated });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // QUOTATION / ESTIMATE ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultFallbackClient: ClientRecord = {
      id: 0,
      name: "General Customer",
      gstin: "URP (Unregistered)",
      gstTreatment: "Consumer",
      placeOfSupply: companyProfile.state || "Maharashtra",
      billingAddress: {
        street: "Direct Supply",
        city: companyProfile.city || "Mumbai",
        state: companyProfile.state || "Maharashtra",
        pinCode: companyProfile.pinCode || "400001"
      },
      email: "billing@client.com",
      phone: "+91 98000 00000"
    };
    const client = clients.find(c => c.id === quoteClientId) || clients[0] || defaultFallbackClient;
    const isInter = isInterStateSupply(client.placeOfSupply, companyProfile.state);

    let subtotal = 0;
    let totalDiscount = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    const computedItems = quoteItems.map((it, idx) => {
      const taxable = (it.quantity * it.rate) - it.discount;
      subtotal += (it.quantity * it.rate);
      totalDiscount += it.discount;

      const taxAmount = (taxable * it.gstRate) / 100;
      let cgst = 0, sgst = 0, igst = 0;
      if (isInter) {
        igst = taxAmount;
        igstTotal += taxAmount;
      } else {
        cgst = taxAmount / 2;
        sgst = taxAmount / 2;
        cgstTotal += cgst;
        sgstTotal += sgst;
      }

      return {
        id: it.id || idx + 1,
        description: it.description,
        hsnSac: it.hsnSac,
        quantity: it.quantity,
        rate: it.rate,
        discount: it.discount,
        gstRate: it.gstRate,
        taxableAmount: taxable,
        cgstAmount: cgst,
        sgstAmount: sgst,
        igstAmount: igst,
        totalAmount: taxable + taxAmount
      };
    });

    const taxTotal = cgstTotal + sgstTotal + igstTotal;
    const grandTotal = subtotal - totalDiscount + taxTotal;

    const nextQuoteNum = `${companyProfile.numberingConfig.quotePrefix}${companyProfile.numberingConfig.quoteNext}`;

    const newQuote: QuotationRecord = {
      id: Date.now(),
      quoteNumber: nextQuoteNum,
      clientId: client.id,
      clientName: client.name,
      clientGstin: client.gstin,
      placeOfSupply: client.placeOfSupply,
      billingAddress: `${client.billingAddress.street}, ${client.billingAddress.city}, ${client.billingAddress.state} - ${client.billingAddress.pinCode}`,
      quoteDate: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + quoteValidDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: computedItems,
      subtotal,
      totalDiscount,
      cgstTotal,
      sgstTotal,
      igstTotal,
      taxTotal,
      grandTotal,
      terms: quoteTerms,
      status: "Sent"
    };

    const updatedQuotes = [newQuote, ...quotations];
    const updatedProfile = {
      ...companyProfile,
      numberingConfig: {
        ...companyProfile.numberingConfig,
        quoteNext: companyProfile.numberingConfig.quoteNext + 1
      }
    };

    setQuotations(updatedQuotes);
    setCompanyProfile(updatedProfile);
    saveAllData({ quotations: updatedQuotes, companyProfile: updatedProfile });
    setIsCreateQuoteOpen(false);
  };

  // Convert Quote To Tax Invoice
  const handleConvertQuoteToInvoice = (quote: QuotationRecord) => {
    const nextInvNum = `${companyProfile.numberingConfig.invoicePrefix}${companyProfile.numberingConfig.invoiceNext}`;
    const client = clients.find(c => c.id === quote.clientId);
    const isInter = isInterStateSupply(quote.placeOfSupply, companyProfile.state);

    const convertedInvoice: InvoiceRecord = {
      id: Date.now(),
      invoiceNumber: nextInvNum,
      clientId: quote.clientId,
      customer: quote.clientName,
      clientGstin: quote.clientGstin,
      gstTreatment: client?.gstTreatment || "Registered Business (B2B)",
      placeOfSupply: quote.placeOfSupply,
      billingAddress: quote.billingAddress,
      invoiceDate: new Date().toISOString().split("T")[0],
      paymentTerms: "Net 30",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      poNumber: `REF-${quote.quoteNumber}`,
      reverseCharge: false,
      supplyType: isInter ? "Inter-State (IGST)" : "Intra-State (CGST + SGST)",
      items: quote.items.map(it => ({
        id: it.id,
        description: it.description,
        hsnSac: it.hsnSac,
        quantity: it.quantity,
        price: it.rate,
        discount: it.discount,
        gstRate: it.gstRate,
        taxableAmount: it.taxableAmount,
        cgstAmount: it.cgstAmount,
        sgstAmount: it.sgstAmount,
        igstAmount: it.igstAmount,
        total: it.totalAmount
      })),
      subtotal: quote.subtotal,
      totalDiscount: quote.totalDiscount,
      cgstTotal: quote.cgstTotal,
      sgstTotal: quote.sgstTotal,
      igstTotal: quote.igstTotal,
      taxTotal: quote.taxTotal,
      amount: quote.grandTotal,
      amountPaid: 0,
      balanceDue: quote.grandTotal,
      status: "Unpaid",
      terms: companyProfile.defaultTerms,
      date: new Date().toISOString().split("T")[0]
    };

    const updatedInvoices = [convertedInvoice, ...billingHistory];
    const updatedQuotes = quotations.map(q => q.id === quote.id ? { ...q, status: "Converted to Invoice" as const, convertedInvoiceNumber: nextInvNum } : q);
    const updatedProfile = {
      ...companyProfile,
      numberingConfig: {
        ...companyProfile.numberingConfig,
        invoiceNext: companyProfile.numberingConfig.invoiceNext + 1
      }
    };

    setBillingHistory(updatedInvoices);
    setQuotations(updatedQuotes);
    setCompanyProfile(updatedProfile);
    saveAllData({ billingHistory: updatedInvoices, quotations: updatedQuotes, companyProfile: updatedProfile });
    setSalesSubTab("invoices");
    alert(`✅ Converted Quote ${quote.quoteNumber} to Tax Invoice ${nextInvNum}!`);
  };

  // ─────────────────────────────────────────────────────────────
  // TAX INVOICE ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleCreateTaxInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultFallbackClient: ClientRecord = {
      id: 0,
      name: "General Customer",
      gstin: "URP (Unregistered)",
      gstTreatment: "Consumer",
      placeOfSupply: companyProfile.state || "Maharashtra",
      billingAddress: {
        street: "Direct Supply",
        city: companyProfile.city || "Mumbai",
        state: companyProfile.state || "Maharashtra",
        pinCode: companyProfile.pinCode || "400001"
      },
      email: "billing@client.com",
      phone: "+91 98000 00000"
    };
    const client = clients.find(c => c.id === invoiceClientId) || clients[0] || defaultFallbackClient;
    const isInter = isInterStateSupply(client.placeOfSupply, companyProfile.state);

    let subtotal = 0;
    let totalDiscount = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    const computedItems = invoiceItems.map((it, idx) => {
      const taxable = (it.quantity * it.price) - it.discount;
      subtotal += (it.quantity * it.price);
      totalDiscount += it.discount;

      const taxAmount = (taxable * it.gstRate) / 100;
      let cgst = 0, sgst = 0, igst = 0;
      if (isInter) {
        igst = taxAmount;
        igstTotal += taxAmount;
      } else {
        cgst = taxAmount / 2;
        sgst = taxAmount / 2;
        cgstTotal += cgst;
        sgstTotal += sgst;
      }

      return {
        id: it.id || idx + 1,
        description: it.description,
        hsnSac: it.hsnSac,
        quantity: it.quantity,
        price: it.price,
        discount: it.discount,
        gstRate: it.gstRate,
        taxableAmount: taxable,
        cgstAmount: cgst,
        sgstAmount: sgst,
        igstAmount: igst,
        total: taxable + taxAmount
      };
    });

    const taxTotal = cgstTotal + sgstTotal + igstTotal;
    const grandTotal = subtotal - totalDiscount + taxTotal;
    const nextInvNum = `${companyProfile.numberingConfig.invoicePrefix}${companyProfile.numberingConfig.invoiceNext}`;

    const daysToAdd = invoiceTerms === "Due on Receipt" ? 0 : invoiceTerms === "Net 15" ? 15 : invoiceTerms === "Net 45" ? 45 : invoiceTerms === "Net 60" ? 60 : 30;
    const dueDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const newInvoice: InvoiceRecord = {
      id: Date.now(),
      invoiceNumber: nextInvNum,
      clientId: client.id,
      customer: client.name,
      clientGstin: client.gstin,
      gstTreatment: client.gstTreatment,
      placeOfSupply: client.placeOfSupply,
      billingAddress: `${client.billingAddress.street}, ${client.billingAddress.city}, ${client.billingAddress.state} - ${client.billingAddress.pinCode}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      paymentTerms: invoiceTerms,
      dueDate,
      poNumber: invoicePoNumber,
      reverseCharge: invoiceReverseCharge,
      supplyType: isInter ? "Inter-State (IGST)" : "Intra-State (CGST + SGST)",
      items: computedItems,
      subtotal,
      totalDiscount,
      cgstTotal,
      sgstTotal,
      igstTotal,
      taxTotal,
      amount: grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
      status: "Unpaid",
      notes: invoiceNotes,
      terms: companyProfile.defaultTerms,
      date: new Date().toISOString().split("T")[0]
    };

    const updatedInvoices = [newInvoice, ...billingHistory];
    const updatedProfile = {
      ...companyProfile,
      numberingConfig: {
        ...companyProfile.numberingConfig,
        invoiceNext: companyProfile.numberingConfig.invoiceNext + 1
      }
    };

    setBillingHistory(updatedInvoices);
    setCompanyProfile(updatedProfile);
    saveAllData({ billingHistory: updatedInvoices, companyProfile: updatedProfile });
    setIsCreateInvoiceOpen(false);
  };

  const handleRecordInvoicePayment = (invId: number) => {
    const inv = billingHistory.find(i => i.id === invId);
    if (!inv) return;
    const amtStr = prompt(`Record payment for invoice ${inv.invoiceNumber} (Current Balance: ₹${inv.balanceDue.toFixed(2)}):`, inv.balanceDue.toString());
    if (!amtStr) return;
    const paidAmt = parseFloat(amtStr);
    if (isNaN(paidAmt) || paidAmt <= 0) return;

    const newPaid = inv.amountPaid + paidAmt;
    const newBal = Math.max(0, inv.amount - newPaid);
    const newStatus: InvoiceRecord["status"] = newBal === 0 ? "Paid" : "Partially Paid";

    const updated = billingHistory.map(i => i.id === invId ? { ...i, amountPaid: newPaid, balanceDue: newBal, status: newStatus } : i);
    setBillingHistory(updated);

    // Also log in payment tracker
    const newPayment = {
      id: Date.now(),
      type: "Inflow",
      title: `Settlement for Invoice ${inv.invoiceNumber}`,
      party: inv.customer,
      amount: paidAmt,
      date: new Date().toISOString().split("T")[0],
      method: "Bank Transfer",
      ref: `UTR-${Date.now().toString().slice(-6)}`,
      status: "Cleared"
    };
    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);

    saveAllData({ billingHistory: updated, payments: updatedPayments });
  };

  const handleDownloadInvoicePDF = async (inv: InvoiceRecord) => {
    setPreviewInvoice(inv);
    setTimeout(async () => {
      if (!invoicePdfRef.current) return;
      try {
        const canvas = await html2canvas(invoicePdfRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${inv.invoiceNumber.replace(/[\/\\]/g, "_")}.pdf`);
      } catch (err) {
        console.error("PDF generation failed:", err);
      } finally {
        setPreviewInvoice(null);
      }
    }, 400);
  };

  // ─────────────────────────────────────────────────────────────
  // CREDIT & DEBIT NOTES ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteOrigInv || !noteAmount) return;
    const defaultFallbackClient: ClientRecord = {
      id: 0,
      name: "General Customer",
      gstin: "URP (Unregistered)",
      gstTreatment: "Consumer",
      placeOfSupply: companyProfile.state || "Maharashtra",
      billingAddress: {
        street: "Direct Supply",
        city: companyProfile.city || "Mumbai",
        state: companyProfile.state || "Maharashtra",
        pinCode: companyProfile.pinCode || "400001"
      },
      email: "billing@client.com",
      phone: "+91 98000 00000"
    };
    const client = clients.find(c => c.id === noteClientId) || clients[0] || defaultFallbackClient;
    const amt = Number(noteAmount) || 0;
    const tax = Math.round(amt * 0.18);
    const grand = amt + tax;

    const nextNoteNum = noteType === "Credit Note" ? `CN/26-27/${101 + creditDebitNotes.length}` : `DN/26-27/${101 + creditDebitNotes.length}`;

    const newNote: CreditDebitNoteRecord = {
      id: Date.now(),
      type: noteType,
      noteNumber: nextNoteNum,
      originalInvoiceNumber: noteOrigInv,
      originalInvoiceDate: noteOrigDate || new Date().toISOString().split("T")[0],
      reason: noteReason,
      clientId: client.id,
      clientName: client.name,
      date: new Date().toISOString().split("T")[0],
      amount: amt,
      taxAmount: tax,
      grandTotal: grand,
      status: "Issued"
    };

    const updated = [newNote, ...creditDebitNotes];
    setCreditDebitNotes(updated);
    saveAllData({ creditDebitNotes: updated });
    setIsAddNoteOpen(false);
    setNoteOrigInv("");
    setNoteAmount("");
  };

  // ─────────────────────────────────────────────────────────────
  // COMPANY PROFILE ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleSaveCompanyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllData({ companyProfile });
    setIsCompanyProfileOpen(false);
    alert("✅ Company Master Profile updated and synchronized!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const updated = { ...companyProfile, logo: event.target.result as string };
          setCompanyProfile(updated);
          saveAllData({ companyProfile: updated });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // PURCHASES ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseVendor || !purchaseAmount) return;
    const newPurchase = {
      id: Date.now(),
      billNumber: purchaseBillNo || `PUR-${Date.now().toString().slice(-4)}`,
      vendor: purchaseVendor,
      category: purchaseCategory,
      date: purchaseDate || new Date().toISOString().split("T")[0],
      amount: Number(purchaseAmount),
      gstPaid: purchaseGst ? Number(purchaseGst) : Math.round(Number(purchaseAmount) * 0.18),
      status: purchaseStatus
    };
    const updated = [newPurchase, ...purchases];
    setPurchases(updated);
    saveAllData({ purchases: updated });
    setIsAddPurchaseOpen(false);
    setPurchaseVendor("");
    setPurchaseBillNo("");
    setPurchaseAmount("");
    setPurchaseGst("");
    setPurchaseDate("");
  };

  const handleDeletePurchase = (id: number) => {
    if (confirm("Delete this purchase bill?")) {
      const updated = purchases.filter(p => p.id !== id);
      setPurchases(updated);
      saveAllData({ purchases: updated });
    }
  };

  const handleTogglePurchaseStatus = (id: number) => {
    const updated = purchases.map(p =>
      p.id === id ? { ...p, status: p.status === "Paid" ? "Pending" : "Paid" } : p
    );
    setPurchases(updated);
    saveAllData({ purchases: updated });
  };

  // ─────────────────────────────────────────────────────────────
  // EXPENSES ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;
    const newExpense = {
      id: Date.now(),
      title: expenseTitle,
      category: expenseCategory,
      amount: Number(expenseAmount),
      date: expenseDate || new Date().toISOString().split("T")[0],
      mode: expenseMode,
      status: "Paid"
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveAllData({ expenses: updated });
    setIsAddExpenseOpen(false);
    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseDate("");
  };

  const handleDeleteExpense = (id: number) => {
    if (confirm("Delete this expense record?")) {
      const updated = expenses.filter(e => e.id !== id);
      setExpenses(updated);
      saveAllData({ expenses: updated });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // PAYMENTS ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTitle || !paymentAmount) return;
    const newPayment = {
      id: Date.now(),
      type: paymentType,
      title: paymentTitle,
      party: paymentParty || "Direct",
      amount: Number(paymentAmount),
      date: paymentDate || new Date().toISOString().split("T")[0],
      method: paymentMethod,
      ref: paymentRef || `TXN-${Date.now().toString().slice(-6)}`,
      status: paymentStatus
    };
    const updated = [newPayment, ...payments];
    setPayments(updated);
    saveAllData({ payments: updated });
    setIsAddPaymentOpen(false);
    setPaymentTitle("");
    setPaymentParty("");
    setPaymentAmount("");
    setPaymentDate("");
    setPaymentRef("");
  };

  const handleDeletePayment = (id: number) => {
    if (confirm("Delete this transaction?")) {
      const updated = payments.filter(p => p.id !== id);
      setPayments(updated);
      saveAllData({ payments: updated });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // PAYROLL ACTIONS
  // ─────────────────────────────────────────────────────────────
  const [empStatus, setEmpStatus] = useState<"Paid" | "Pending">("Paid");
  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName) return;
    const basic = Number(empBasic) || 0;
    const hra = Number(empHra) || 0;
    const ded = Number(empDeductions) || 0;
    const net = basic + hra - ded;
    const newEmp = {
      id: Date.now(),
      name: empName,
      role: empRole || "Staff",
      basic,
      hra,
      deductions: ded,
      netSalary: net,
      status: empStatus,
      paymentDate: new Date().toISOString().split("T")[0]
    };
    const updated = [newEmp, ...employees];
    setEmployees(updated);
    saveAllData({ employees: updated });
    setIsAddEmpOpen(false);
    setEmpName("");
    setEmpRole("");
    setEmpBasic("");
    setEmpHra("");
    setEmpDeductions("");
  };

  const handleDeleteEmployee = (id: number) => {
    if (confirm("Delete this employee payroll entry?")) {
      const updated = employees.filter(e => e.id !== id);
      setEmployees(updated);
      saveAllData({ employees: updated });
    }
  };

  const handleToggleEmpStatus = (id: number) => {
    const updated = employees.map(e =>
      e.id === id ? { ...e, status: e.status === "Paid" ? "Pending" : "Paid" } : e
    );
    setEmployees(updated);
    saveAllData({ employees: updated });
  };

  // ─────────────────────────────────────────────────────────────
  // DOCUMENTS ACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleSaveDoc = (e: React.FormEvent) => {
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
    saveAllData({ documents: updated });
    setIsAddDocOpen(false);
    setDocName("");
  };

  const handleDeleteDoc = (id: number) => {
    if (confirm("Delete this document?")) {
      const updated = documents.filter(d => d.id !== id);
      setDocuments(updated);
      saveAllData({ documents: updated });
    }
  };

  // Financial aggregates
  const totalSales = billingHistory.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalPurchases = purchases.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + (emp.netSalary || 0), 0);
  const totalPendingSalaries = employees.filter(e => e.status === "Pending").reduce((sum, emp) => sum + (emp.netSalary || 0), 0);
  const totalInflow = payments.filter(p => p.type === "Inflow").reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalOutflow = payments.filter(p => p.type === "Outflow").reduce((sum, p) => sum + (p.amount || 0), 0);
  const netCashFlow = totalInflow - totalOutflow;

  const totalGstOutput = billingHistory.reduce((sum, item) => sum + (item.taxTotal || 0), 0);
  const totalGstItc = purchases.reduce((sum, p) => sum + (p.gstPaid || 0), 0);
  const netGstPayable = Math.max(0, totalGstOutput - totalGstItc);
  const operatingProfit = totalSales - (totalPurchases + totalExpenses + totalMonthlyPayroll);

  // ─────────────────────────────────────────────────────────────
  // RENDER DYNAMIC CONTENT
  // ─────────────────────────────────────────────────────────────
  
  // ─────────────────────────────────────────────────────────────
  // REFERENCE UI AUTOMATIONS DATA & COMMON HELPERS
  // ─────────────────────────────────────────────────────────────
  const [mainSearchQuery, setMainSearchQuery] = useState("");

  const handleTopPrimaryAction = () => {
    // Top action scrolls smoothly to the inline interface form at the top of the canvas
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getTopActionLabel = () => {
    switch (activeTab) {
      case "home":
        return "Create Scheduled";
      case "sales":
        if (salesSubTab === "quotes") return "Create Quotation";
        if (salesSubTab === "clients") return "Add Client";
        if (salesSubTab === "items") return "Add Item";
        if (salesSubTab === "notes") return "Issue Note";
        return "Create Invoice";
      case "purchases":
        return "Record Purchase";
      case "expenses":
        return "Add Expense";
      case "payments-tracker":
        return "Record Transaction";
      case "compliance-tracker":
        return "Admin Verified";
      case "payroll":
        return "Add Employee";
      case "documents":
        return "Upload Document";
      case "reports":
        return "Print Report";
      default:
        return "Create Scheduled";
    }
  };

  const renderKpiCard = (title: string, value: string | number, trend: string, subtitle: string, Icon: any) => (
    <div key={title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100/90 dark:border-zinc-800 shadow-xs p-4 flex flex-col justify-between hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
          <Icon size={14} className="text-gray-500 dark:text-zinc-400" /> {title}
        </span>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-1">
          <MoreHorizontal size={15} />
        </button>
      </div>
      <div className="flex items-center gap-2.5 mt-3">
        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</span>
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
          <TrendingUp size={10} /> {trend}
        </span>
      </div>
      <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1">{subtitle}</p>
    </div>
  );

  const renderStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    const isRunning = s.includes("run") || s.includes("paid") || s.includes("done") || s.includes("accept");
    const isActive = s.includes("act") || s.includes("sent") || s.includes("clear") || s.includes("verif");
    
    if (isRunning) {
      return (
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="uppercase">{status}</span>
        </span>
      );
    }
    if (isActive) {
      return (
        <span className="bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-400 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span className="uppercase">{status}</span>
        </span>
      );
    }
    return (
      <span className="bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        <span className="uppercase">{status}</span>
      </span>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER DYNAMIC CONTENT (EXACT MATCH TO REFERENCE IMAGE)
  // ─────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case "home":
      case "dashboard": {
        const filteredHomeInvoices = billingHistory.filter(i =>
          (i.invoiceNumber + i.customer + (i.clientGstin || "")).toLowerCase().includes(mainSearchQuery.toLowerCase())
        );

        // Real financial totals
        const realTotalSales = billingHistory.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
        const realTotalPurchases = purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const realTotalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        const realTotalInflow = payments.filter(p => p.type === "Inflow").reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const realTotalOutflow = payments.filter(p => p.type === "Outflow").reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const netProfit = realTotalSales - (realTotalPurchases + realTotalExpenses);

        // 6-Month Real Time Series (Jun, Jul, Aug, Sep, Oct, Nov)
        const monthDefs = [
          { key: "06", name: "Jun", x: 40 },
          { key: "07", name: "Jul", x: 160 },
          { key: "08", name: "Aug", x: 280 },
          { key: "09", name: "Sep", x: 400 },
          { key: "10", name: "Oct", x: 520 },
          { key: "11", name: "Nov", x: 640 },
        ];

        const salesActivityData = monthDefs.map((m, idx) => {
          let s = billingHistory
            .filter(inv => (inv.date || inv.invoiceDate || "").includes(`-${m.key}-`))
            .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

          let c = payments
            .filter(p => p.type === "Inflow" && (p.date || "").includes(`-${m.key}-`))
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

          if (idx === 5) {
            const untaggedSales = billingHistory
              .filter(inv => !monthDefs.some(md => (inv.date || inv.invoiceDate || "").includes(`-${md.key}-`)))
              .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
            s += untaggedSales;

            const untaggedInflows = payments
              .filter(p => p.type === "Inflow" && !monthDefs.some(md => (p.date || "").includes(`-${md.key}-`)))
              .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
            c += untaggedInflows;
          }

          return {
            month: m.name,
            sales: s,
            collections: c,
            x: m.x
          };
        });

        // Compute dynamic ceiling and Y coordinates for the curve
        const peakActivity = Math.max(10000, ...salesActivityData.map(d => Math.max(d.sales, d.collections)));
        const gridCeil = Math.ceil(peakActivity / 10000) * 10000;
        const gridLabels = [
          { val: `₹${(gridCeil / 1000).toFixed(0)}K`, y: 20 },
          { val: `₹${((gridCeil * 5 / 6) / 1000).toFixed(0)}K`, y: 46 },
          { val: `₹${((gridCeil * 4 / 6) / 1000).toFixed(0)}K`, y: 73 },
          { val: `₹${((gridCeil * 3 / 6) / 1000).toFixed(0)}K`, y: 100 },
          { val: `₹${((gridCeil * 2 / 6) / 1000).toFixed(0)}K`, y: 126 },
          { val: `₹${((gridCeil * 1 / 6) / 1000).toFixed(0)}K`, y: 153 },
          { val: "₹0", y: 180 },
        ];

        const chartPoints = salesActivityData.map(d => ({
          ...d,
          salesY: Math.round(180 - (d.sales / gridCeil) * 155),
          colY: Math.round(180 - (d.collections / gridCeil) * 155)
        }));

        const buildSvgPath = (pts: { x: number; y: number }[]) => {
          let path = `M ${pts[0].x} ${pts[0].y}`;
          for (let i = 1; i < pts.length; i++) {
            const prev = pts[i - 1];
            const curr = pts[i];
            const cpX = (prev.x + curr.x) / 2;
            path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
          }
          return path;
        };

        const salesLinePath = buildSvgPath(chartPoints.map(p => ({ x: p.x, y: p.salesY })));
        const salesAreaPath = `${salesLinePath} L 640 180 L 40 180 Z`;

        const colLinePath = buildSvgPath(chartPoints.map(p => ({ x: p.x, y: p.colY })));
        const colAreaPath = `${colLinePath} L 640 180 L 40 180 Z`;

        // Monthly Real Bar Chart Data (Inflows vs Outflows)
        const monthlyFlows = monthDefs.map((m, idx) => {
          let inf = payments
            .filter(p => p.type === "Inflow" && (p.date || "").includes(`-${m.key}-`))
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

          let out = payments
            .filter(p => p.type === "Outflow" && (p.date || "").includes(`-${m.key}-`))
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0) +
            expenses.filter(e => (e.date || "").includes(`-${m.key}-`)).reduce((s, e) => s + (Number(e.amount) || 0), 0) +
            purchases.filter(pr => (pr.date || "").includes(`-${m.key}-`)).reduce((s, pr) => s + (Number(pr.amount) || 0), 0);

          if (idx === 5) {
            inf += payments.filter(p => p.type === "Inflow" && !monthDefs.some(md => (p.date || "").includes(`-${md.key}-`))).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
            inf += billingHistory.reduce((s, i) => s + (Number(i.amountPaid) || 0), 0);
            out += expenses.filter(e => !monthDefs.some(md => (e.date || "").includes(`-${md.key}-`))).reduce((s, e) => s + (Number(e.amount) || 0), 0);
            out += purchases.filter(pr => !monthDefs.some(md => (pr.date || "").includes(`-${md.key}-`))).reduce((s, pr) => s + (Number(pr.amount) || 0), 0);
          }

          return {
            month: m.name,
            inflow: inf,
            outflow: out
          };
        });

        const maxFlow = Math.max(5000, ...monthlyFlows.map(f => Math.max(f.inflow, f.outflow)));

        // Real Combined Payment & Transaction Rows
        const realPaymentRows = [
          ...payments.map(p => ({
            id: `pay-${p.id}`,
            status: p.status === "Cleared" || p.status === "Paid" ? "Success" : "Processing",
            customer: p.party || p.title,
            ref: p.ref || (p.type === "Inflow" ? "Customer Collection" : "Vendor Settlement"),
            method: p.method || "Bank Transfer",
            amount: Number(p.amount) || 0,
            date: p.date || new Date().toISOString().split("T")[0]
          })),
          ...billingHistory.map(inv => ({
            id: `inv-${inv.id}`,
            status: inv.status === "Paid" ? "Success" : "Processing",
            customer: inv.customer,
            ref: inv.invoiceNumber,
            method: "GST Tax Invoice",
            amount: Number(inv.amount) || 0,
            date: inv.invoiceDate || inv.date || new Date().toISOString().split("T")[0]
          })),
          ...expenses.map(e => ({
            id: `exp-${e.id}`,
            status: "Success",
            customer: e.title,
            ref: e.category,
            method: e.mode || "Business Expense",
            amount: Number(e.amount) || 0,
            date: e.date || new Date().toISOString().split("T")[0]
          }))
        ].sort((a, b) => (b.date > a.date ? 1 : -1));

        return (
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Real-time enterprise accounting, tax liabilities & liquidity ledger</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => alert("Downloading Indian GST financial overview...")}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => alert("Date range: FY 2026-27 (Current Fiscal Year)")}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-medium px-3.5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Calendar size={13} />
                  <span>Pick a date</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Overview, Analytics, Reports, Notifications */}
            <div className="flex items-center gap-2 pb-1">
              {[
                { id: "overview", label: "Overview", icon: Layers },
                { id: "analytics", label: "Analytics", icon: BarChart3 },
                { id: "reports", label: "Reports", icon: FileText },
                { id: "notifications", label: "Notifications", icon: Bell },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeSubTab === tab.id
                      ? "bg-slate-900 text-white shadow-xs font-semibold"
                      : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50"
                  }`}
                >
                  <tab.icon size={13} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB VIEW 1: OVERVIEW */}
            {activeSubTab === "overview" && (
              <>
                {/* 4 Metric Cards Row with Real Financial Data in Indian Rupees (₹) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Total Invoices */}
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Layers size={13} />
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Total Invoices</span>
                        </div>
                        <Info size={13} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
                      </div>
                      <div className="flex items-baseline justify-between mt-3">
                        <div>
                          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{billingHistory.length}</p>
                          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">Realized Invoices • FY 2026-27</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px]">
                      <button onClick={() => { setActiveTab("sales"); setSalesSubTab("invoices"); }} className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-0.5 cursor-pointer">
                        <span>Details</span> &gt;
                      </button>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">Active FY</span>
                    </div>
                  </div>

                  {/* Card 2: Total Sales Revenue */}
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                            <ShoppingCart size={13} />
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Total Sales Revenue</span>
                        </div>
                        <Info size={13} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
                      </div>
                      <div className="flex items-baseline justify-between mt-3">
                        <div>
                          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            ₹{realTotalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">Cumulative B2B Billings</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px]">
                      <button onClick={() => { setActiveTab("sales"); setSalesSubTab("invoices"); }} className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-0.5 cursor-pointer">
                        <span>Details</span> &gt;
                      </button>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">Live GST</span>
                    </div>
                  </div>

                  {/* Card 3: Total Expenditures */}
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <DollarSign size={13} />
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Total Outflow & Expenses</span>
                        </div>
                        <Info size={13} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
                      </div>
                      <div className="flex items-baseline justify-between mt-3">
                        <div>
                          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            ₹{(realTotalPurchases + realTotalExpenses).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">Purchases & Operating Outlays</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px]">
                      <button onClick={() => setActiveTab("expenses")} className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-0.5 cursor-pointer">
                        <span>Details</span> &gt;
                      </button>
                      <span className="text-slate-500 font-bold flex items-center gap-0.5">Deductibles</span>
                    </div>
                  </div>

                  {/* Card 4: Net Operating Profit */}
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Wallet size={13} />
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Net Operating Margin</span>
                        </div>
                        <Info size={13} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
                      </div>
                      <div className="flex items-baseline justify-between mt-3">
                        <div>
                          <p className={`text-2xl font-bold tracking-tight ${netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                            ₹{netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">Sales - Operational Costs</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px]">
                      <button onClick={() => setActiveTab("reports")} className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-0.5 cursor-pointer">
                        <span>P&amp;L Report</span> &gt;
                      </button>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">Real-Time</span>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Two Charts with Indian Rupee (₹) Labels */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Chart: Sales Activity - Monthly (in ₹) */}
                  <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs relative">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Sales Activity - Monthly</h2>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Showing total sales and collections in Indian Rupees (₹) for the last 6 months</p>
                      </div>
                    </div>

                    <div className="relative pt-4 pb-2">
                      <svg className="w-full h-64 overflow-visible" viewBox="0 0 700 200">
                        <defs>
                          <linearGradient id="redAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="greenAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Grid Lines & Y-Axis Labels in Indian Rupees (₹) */}
                        {gridLabels.map(grid => (
                          <g key={grid.val}>
                            <text x="5" y={grid.y + 4} className="text-[10px] fill-slate-400 dark:fill-zinc-500 font-medium">
                              {grid.val}
                            </text>
                            <line x1="38" y1={grid.y} x2="685" y2={grid.y} stroke="currentColor" className="text-slate-100 dark:text-zinc-800/80" strokeWidth="1" strokeDasharray="3 3" />
                          </g>
                        ))}

                        {/* Red Area (Sales Revenue Curve) */}
                        <path d={salesAreaPath} fill="url(#redAreaGrad)" />
                        <path d={salesLinePath} fill="none" stroke="#f43f5e" strokeWidth="2.5" />

                        {/* Green Area (Collections Inflow Curve) */}
                        <path d={colAreaPath} fill="url(#greenAreaGrad)" />
                        <path d={colLinePath} fill="none" stroke="#10b981" strokeWidth="2.5" />

                        {/* X-Axis Month Labels & Interactive Invisible Hover Zones */}
                        {chartPoints.map((d, idx) => (
                          <g key={d.month} className="cursor-pointer">
                            <text x={d.x} y="196" textAnchor="middle" className="text-[11px] fill-slate-500 dark:fill-zinc-400 font-medium">
                              {d.month}
                            </text>
                            <rect
                              x={d.x - 45}
                              y="10"
                              width="90"
                              height="180"
                              fill="transparent"
                              onMouseEnter={() => setActiveChartHover(idx)}
                              onMouseLeave={() => setActiveChartHover(null)}
                            />
                            {activeChartHover === idx && (
                              <g>
                                <line x1={d.x} y1="20" x2={d.x} y2="180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                                <circle cx={d.x} cy={d.salesY} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                                <circle cx={d.x} cy={d.colY} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                              </g>
                            )}
                          </g>
                        ))}
                      </svg>

                      {/* Tooltip Box in Indian Rupees (₹) */}
                      {activeChartHover !== null && (
                        <div
                          className="absolute bg-slate-900 text-white rounded-lg p-2.5 text-xs shadow-xl pointer-events-none transition-all z-20 border border-slate-700"
                          style={{
                            left: `${(chartPoints[activeChartHover].x / 700) * 85 + 5}%`,
                            top: "20px"
                          }}
                        >
                          <p className="font-bold text-slate-200">{chartPoints[activeChartHover].month} 2026 Breakdown</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span>Sales: <strong>₹{chartPoints[activeChartHover].sales.toLocaleString('en-IN')}.00</strong></span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Collections: <strong>₹{chartPoints[activeChartHover].collections.toLocaleString('en-IN')}.00</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Chart: Real Monthly Cash Flow Comparison */}
                  <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Cash Flow</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Real-time Inflow vs Outflow comparisons</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div>
                          <span className="text-[10px] font-semibold text-emerald-600 block">TOTAL INFLOW</span>
                          <span className="text-base font-bold text-slate-900 dark:text-white">
                            ₹{(realTotalSales + realTotalInflow).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 dark:border-zinc-800" />
                        <div>
                          <span className="text-[10px] font-semibold text-rose-500 block">TOTAL OUTFLOW</span>
                          <span className="text-base font-bold text-slate-900 dark:text-white">
                            ₹{(realTotalPurchases + realTotalExpenses + realTotalOutflow).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 pb-2">
                      <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 px-1">
                        {monthlyFlows.map((item, idx) => {
                          const infHeight = maxFlow > 0 && item.inflow > 0 ? Math.max(6, Math.round((item.inflow / maxFlow) * 100)) : 3;
                          const outHeight = maxFlow > 0 && item.outflow > 0 ? Math.max(6, Math.round((item.outflow / maxFlow) * 100)) : 3;
                          return (
                            <div
                              key={idx}
                              className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                              onMouseEnter={() => setActiveBarHover(idx)}
                              onMouseLeave={() => setActiveBarHover(null)}
                            >
                              <div className="w-full flex items-end justify-center gap-1 h-32">
                                <div
                                  className="w-2.5 sm:w-3 bg-emerald-500 rounded-t-sm transition-all group-hover:brightness-110"
                                  style={{ height: `${infHeight}%` }}
                                  title={`Inflow: ₹${item.inflow}`}
                                ></div>
                                <div
                                  className="w-2.5 sm:w-3 bg-rose-400 rounded-t-sm transition-all group-hover:brightness-110"
                                  style={{ height: `${outHeight}%` }}
                                  title={`Outflow: ₹${item.outflow}`}
                                ></div>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {item.month}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {activeBarHover !== null && (
                        <div className="mt-2 text-center text-xs text-slate-600 dark:text-zinc-400 font-medium bg-slate-50 dark:bg-zinc-800 rounded-lg py-1">
                          {monthlyFlows[activeBarHover].month}: <span className="text-emerald-600 font-bold">Inflow ₹{monthlyFlows[activeBarHover].inflow.toLocaleString('en-IN')}</span> • <span className="text-rose-500 font-bold">Outflow ₹{monthlyFlows[activeBarHover].outflow.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: FULL WIDTH REAL PAYMENTS & INVOICES TABLE (IN INDIAN RUPEES ₹) */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Payments & Invoices</h2>
                      <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Realized cash collections, bank deposits & customer receipts in Indian Rupees (₹)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="relative">
                      <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Filter payments & clients..."
                        value={mainSearchQuery}
                        onChange={(e) => setMainSearchQuery(e.target.value)}
                        className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 w-60 sm:w-72 outline-none shadow-xs focus:border-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                        <tr>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3">
                            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-white">
                              <span>Customer / Reference</span>
                              <span className="text-[10px]">⇅</span>
                            </div>
                          </th>
                          <th className="py-3 px-3">Mode & Method</th>
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3 text-right">Amount (₹)</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                        {realPaymentRows.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center">
                              <div className="flex flex-col items-center justify-center text-slate-400">
                                <Wallet size={28} className="mb-2 text-slate-300 dark:text-zinc-600" />
                                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">No transactions recorded yet</p>
                                <p className="text-xs text-slate-400 mt-0.5">Use the Sales, Purchases, or Expenses tabs to start recording live transactions.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          realPaymentRows
                            .filter(p => (p.customer + p.ref + p.status).toLowerCase().includes(mainSearchQuery.toLowerCase()))
                            .map((row) => (
                              <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                                <td className="py-3.5 px-3">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                      row.status === "Success"
                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60"
                                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60"
                                    }`}
                                  >
                                    {row.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3">
                                  <p className="font-bold text-slate-900 dark:text-white">{row.customer}</p>
                                  <p className="text-[11px] text-slate-400 dark:text-zinc-500">{row.ref}</p>
                                </td>
                                <td className="py-3.5 px-3 text-slate-600 dark:text-zinc-400">
                                  {row.method}
                                </td>
                                <td className="py-3.5 px-3 text-slate-500 dark:text-zinc-400">
                                  {row.date}
                                </td>
                                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white text-right">
                                  ₹{row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="py-3.5 px-3 text-right">
                                  <button
                                    onClick={() => {
                                      const found = billingHistory.find(b => b.amount === row.amount || b.customer === row.customer) || billingHistory[0];
                                      if (found) {
                                        setPreviewInvoice(found);
                                        setIsInvoicePreviewOpen(true);
                                      } else {
                                        alert(`Payment record for ${row.customer}: ₹${row.amount}`);
                                      }
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                                    title="View invoice & receipt"
                                  >
                                    <MoreHorizontal size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* TAB VIEW 2: ANALYTICS */}
            {activeSubTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-4 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Operating Profit</p>
                    <p className={`text-2xl font-bold mt-2 ${netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      ₹{netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Real-time revenue minus operational expenditures</p>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-4 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ITC Claim Efficiency</p>
                    <p className="text-2xl font-bold mt-2 text-blue-600">
                      ₹{purchases.reduce((s, p) => s + (Number(p.gstPaid) || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Total registered Input Tax Credit under GST</p>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-4 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Invoice Value</p>
                    <p className="text-2xl font-bold mt-2 text-indigo-600">
                      ₹{(billingHistory.length ? (realTotalSales / billingHistory.length) : 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Realized average value across {billingHistory.length} bills</p>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-4 shadow-xs">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Receivables</p>
                    <p className="text-2xl font-bold mt-2 text-amber-600">
                      ₹{billingHistory.filter(i => i.status === "Unpaid" || i.status === "Overdue" || i.status === "Partial").reduce((s, i) => s + (Number(i.balanceDue) || Number(i.amount) || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Unsettled client invoices due</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Revenue vs Expenditure Distribution</h3>
                    <div className="space-y-3 pt-2 text-xs">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Total Invoiced Sales</span>
                          <span className="text-blue-600">₹{realTotalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: realTotalSales > 0 ? "100%" : "0%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Purchase Inward Bills</span>
                          <span className="text-emerald-600">₹{realTotalPurchases.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: realTotalSales > 0 ? `${Math.min(100, (realTotalPurchases / realTotalSales) * 100)}%` : "0%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Direct Business Expenses</span>
                          <span className="text-rose-500">₹{realTotalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: realTotalSales > 0 ? `${Math.min(100, (realTotalExpenses / realTotalSales) * 100)}%` : "0%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">GST Liability vs ITC Position</h3>
                    <div className="p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-xl space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-zinc-400">Total Output GST (Collected on Sales):</span>
                        <span className="font-bold text-slate-900 dark:text-white">₹{totalGstOutput.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-zinc-400">Total Input Tax Credit (Paid on Purchases):</span>
                        <span className="font-bold text-emerald-600">₹{totalGstItc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="border-t border-slate-200 dark:border-zinc-700 pt-2 flex justify-between font-bold text-sm">
                        <span>Net GST Payable / (Credit Carried Forward):</span>
                        <span className={totalGstOutput >= totalGstItc ? "text-rose-600" : "text-emerald-600"}>
                          ₹{Math.abs(totalGstOutput - totalGstItc).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 3: REPORTS */}
            {activeSubTab === "reports" && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Executive Financial Summaries</h3>
                  <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold">
                    Print Statement
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 border rounded-xl space-y-1">
                    <p className="text-slate-400 font-medium">Gross Billed Revenue</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">₹{realTotalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="p-4 border rounded-xl space-y-1">
                    <p className="text-slate-400 font-medium">Realized Operating Cost</p>
                    <p className="text-xl font-bold text-rose-600">₹{(realTotalPurchases + realTotalExpenses).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="p-4 border rounded-xl space-y-1">
                    <p className="text-slate-400 font-medium">Net Operational Profit</p>
                    <p className="text-xl font-bold text-emerald-600">₹{netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 4: NOTIFICATIONS */}
            {activeSubTab === "notifications" && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Statutory Deadlines & Compliance Alerts</h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                      <span className="font-semibold text-blue-900">GSTR-1 &amp; GSTR-3B Monthly Filing</span>
                      <span className="text-blue-700 font-medium">Statutory Due: 20th Nov</span>
                    </div>
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="font-semibold text-amber-900">TDS Monthly Payment Deposit</span>
                      <span className="text-amber-700 font-medium">Statutory Due: 7th Dec</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

case "sales":
      case "billing-software":
        return (
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sales & Invoicing Pipeline</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Generate GST tax invoices, manage quotations, credit/debit notes & client master</p>
              </div>
            </div>

            {/* 4 Metric Cards Row in Indian Rupees (₹) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Active Invoices", billingHistory.length, "FY 2026-27", "Realized sales billing", CreditCard)}
              {renderKpiCard("Gross Billed", `₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "+12.4% MoM", "Tax Total: ₹" + totalGstOutput.toFixed(2), Sparkles)}
              {renderKpiCard("Active Clients", clients.length, "Verified B2B", "Client master directory", Users)}
              {renderKpiCard("Next Filing", "20th Nov", "Statutory", "GSTR-1 & GSTR-3B monthly", Calendar)}
            </div>

            {/* Sub-Tabs: Invoices, Quotes, Notes, Clients, Items */}
            <div className="flex flex-wrap gap-2 pt-1 pb-1">
              {[
                { id: "invoices", label: `Tax Invoices (${billingHistory.length})`, icon: FileText },
                { id: "quotes", label: `Quotations (${quotations.length})`, icon: FileEdit },
                { id: "notes", label: `Credit/Debit Notes (${creditDebitNotes.length})`, icon: Receipt },
                { id: "clients", label: `Client Master (${clients.length})`, icon: Users },
                { id: "items", label: `Item Catalog (${itemsCatalog.length})`, icon: Package },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSalesSubTab(sub.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    salesSubTab === sub.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50"
                  }`}
                >
                  <sub.icon size={13} />
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>

            {/* TOP CARD: INTERFACE OF THE OPERATION (INLINE CREATION FORM - NO POPUP) */}
            {salesSubTab === "invoices" && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                      <FileText size={16} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">New GST Tax Invoice</h2>
                      <p className="text-xs text-slate-400">Generate GST compliant B2B/B2C tax invoice with real-time tax splitting</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-3 py-1 rounded-lg">
                    Invoice #{companyProfile.numberingConfig.invoicePrefix}{companyProfile.numberingConfig.invoiceNext}
                  </span>
                </div>

                <form onSubmit={handleCreateTaxInvoice} className="space-y-5 text-xs">
                  {/* Customer & Invoice Meta Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Customer / Client *</label>
                      <select
                        value={invoiceClientId}
                        onChange={(e) => setInvoiceClientId(Number(e.target.value))}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-blue-500"
                      >
                        {clients.length === 0 ? (
                          <option value={0}>General Counter Customer (Register clients in Clients tab)</option>
                        ) : clients.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.placeOfSupply})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Invoice Date *</label>
                      <input
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Payment Terms</label>
                      <select
                        value={invoiceTerms}
                        onChange={(e) => setInvoiceTerms(e.target.value as any)}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500"
                      >
                        <option value="Due on Receipt">Due on Receipt</option>
                        <option value="Net 15">Net 15 Days</option>
                        <option value="Net 30">Net 30 Days</option>
                        <option value="Net 45">Net 45 Days</option>
                        <option value="Net 60">Net 60 Days</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Client PO Reference #</label>
                      <input
                        type="text"
                        placeholder="e.g. PO-ACME-8891"
                        value={invoicePoNumber}
                        onChange={(e) => setInvoicePoNumber(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Auto Tax Splitting Banner */}
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white">Auto Tax Rule: </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {isInterStateSupply(clients.find(c => c.id === invoiceClientId)?.placeOfSupply || "", companyProfile.state)
                          ? "Inter-State Supply (100% IGST Applicable)"
                          : "Intra-State Supply (50% CGST + 50% SGST Split)"}
                      </span>
                      <span className="text-slate-400 text-[11px] block sm:inline sm:ml-2">
                        (Seller: {companyProfile.state} → Buyer: {clients.find(c => c.id === invoiceClientId)?.placeOfSupply || companyProfile.state})
                      </span>
                    </div>
                    <label className="flex items-center gap-1.5 font-medium cursor-pointer text-slate-700 dark:text-zinc-300">
                      <input
                        type="checkbox"
                        checked={invoiceReverseCharge}
                        onChange={(e) => setInvoiceReverseCharge(e.target.checked)}
                        className="rounded"
                      />
                      <span>Reverse Charge (RCM)?</span>
                    </label>
                  </div>

                  {/* Item Table matching Competitor Reference Image 2 & 3 */}
                  <div className="border border-slate-200/80 dark:border-zinc-800 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 dark:bg-zinc-800/60 px-4 py-2 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between font-semibold text-slate-700 dark:text-zinc-200">
                      <span>Item Details & Pricing</span>
                      <span className="text-[11px] text-slate-400">All amounts in Indian Rupees (₹)</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/50 dark:bg-zinc-800/40 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80 dark:border-zinc-800">
                          <tr>
                            <th className="py-2.5 px-3 min-w-[200px]">Item Description</th>
                            <th className="py-2.5 px-3 w-24">HSN/SAC</th>
                            <th className="py-2.5 px-3 w-16">Qty</th>
                            <th className="py-2.5 px-3 w-28">Rate (₹)</th>
                            <th className="py-2.5 px-3 w-24">Discount</th>
                            <th className="py-2.5 px-3 w-28">Tax Rate</th>
                            <th className="py-2.5 px-3 w-32 text-right">Amount (₹)</th>
                            <th className="py-2.5 px-2 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                          {invoiceItems.map((row, index) => {
                            const taxable = Math.max(0, (row.quantity * row.price) - row.discount);
                            const tax = (taxable * row.gstRate) / 100;
                            const total = taxable + tax;
                            return (
                              <tr key={row.id}>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={row.description}
                                    onChange={(e) => {
                                      const updated = [...invoiceItems];
                                      updated[index].description = e.target.value;
                                      setInvoiceItems(updated);
                                    }}
                                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={row.hsnSac}
                                    onChange={(e) => {
                                      const updated = [...invoiceItems];
                                      updated[index].hsnSac = e.target.value;
                                      setInvoiceItems(updated);
                                    }}
                                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-xs font-mono outline-none"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="number"
                                    min={1}
                                    value={row.quantity}
                                    onChange={(e) => {
                                      const updated = [...invoiceItems];
                                      updated[index].quantity = Math.max(1, Number(e.target.value));
                                      setInvoiceItems(updated);
                                    }}
                                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="number"
                                    min={0}
                                    value={row.price}
                                    onChange={(e) => {
                                      const updated = [...invoiceItems];
                                      updated[index].price = Math.max(0, Number(e.target.value));
                                      setInvoiceItems(updated);
                                    }}
                                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="number"
                                    min={0}
                                    value={row.discount}
                                    onChange={(e) => {
                                      const updated = [...invoiceItems];
                                      updated[index].discount = Math.max(0, Number(e.target.value));
                                      setInvoiceItems(updated);
                                    }}
                                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                                  />
                                </td>
                                <td className="p-2">
                                  <select
                                    value={row.gstRate}
                                    onChange={(e) => {
                                      const updated = [...invoiceItems];
                                      updated[index].gstRate = Number(e.target.value);
                                      setInvoiceItems(updated);
                                    }}
                                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                                  >
                                    <option value={0}>0% GST</option>
                                    <option value={5}>5% GST</option>
                                    <option value={12}>12% GST</option>
                                    <option value={18}>18% GST</option>
                                    <option value={28}>28% GST</option>
                                  </select>
                                </td>
                                <td className="p-2 text-right font-bold text-slate-800 dark:text-zinc-200">
                                  ₹{total.toFixed(2)}
                                </td>
                                <td className="p-2 text-center">
                                  {invoiceItems.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== index))}
                                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                    >
                                      <X size={14} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 bg-slate-50/50 dark:bg-zinc-800/40 border-t border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          const nextId = invoiceItems.length + 1;
                          setInvoiceItems([
                            ...invoiceItems,
                            { id: nextId, itemId: 1, description: "Professional Services / Item", hsnSac: "998314", quantity: 1, price: 5000, discount: 0, gstRate: 18 }
                          ]);
                        }}
                        className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-blue-600 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>+ Add New Row</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes & Grand Total Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Customer Notes (Printed on Invoice)</label>
                        <textarea
                          rows={2}
                          value={invoiceNotes}
                          onChange={(e) => setInvoiceNotes(e.target.value)}
                          placeholder="Thanks for your business. Payment is due within agreed credit terms."
                          className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Terms & Conditions</label>
                        <textarea
                          rows={2}
                          value={invoiceTermsText}
                          onChange={(e) => setInvoiceTermsText(e.target.value)}
                          placeholder="All payments to be made in favor of TrioTax. Interest @ 18% p.a. on delayed payments."
                          className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Real-time Tax Totals */}
                    <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-700/60 space-y-2 text-xs">
                      {(() => {
                        let subtotal = 0;
                        let totalTax = 0;
                        invoiceItems.forEach(item => {
                          const taxable = Math.max(0, (item.quantity * item.price) - item.discount);
                          const tax = (taxable * item.gstRate) / 100;
                          subtotal += taxable;
                          totalTax += tax;
                        });
                        const grandTotal = subtotal + totalTax;
                        const isInter = isInterStateSupply(clients.find(c => c.id === invoiceClientId)?.placeOfSupply || "", companyProfile.state);

                        return (
                          <>
                            <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                              <span>Subtotal (Taxable Value):</span>
                              <span className="font-semibold text-slate-800 dark:text-zinc-200">₹{subtotal.toFixed(2)}</span>
                            </div>
                            {isInter ? (
                              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                                <span>IGST (Integrated Tax 100%):</span>
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">₹{totalTax.toFixed(2)}</span>
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                                  <span>CGST (Central Tax 50%):</span>
                                  <span className="font-semibold text-slate-800 dark:text-zinc-200">₹{(totalTax / 2).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                                  <span>SGST (State Tax 50%):</span>
                                  <span className="font-semibold text-slate-800 dark:text-zinc-200">₹{(totalTax / 2).toFixed(2)}</span>
                                </div>
                              </>
                            )}
                            <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                              <span>Total GST Amount:</span>
                              <span className="font-semibold text-slate-800 dark:text-zinc-200">₹{totalTax.toFixed(2)}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200 dark:border-zinc-700 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                              <span>Total ( ₹ ):</span>
                              <span className="text-base text-blue-600 dark:text-blue-400 font-extrabold">₹{grandTotal.toFixed(2)}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <FileText size={14} />
                      <span>Generate & Issue Tax Invoice</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Quick Inline Creation for other subtabs (Quotes, Notes, Clients, Items) */}
            {salesSubTab === "quotes" && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <FileEdit className="text-blue-600" size={18} />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Create New Quotation / Estimate</h3>
                    <p className="text-xs text-slate-400">Issue B2B commercial estimates with standard terms</p>
                  </div>
                </div>
                <form onSubmit={handleCreateQuote} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Client *</label>
                    <select
                      value={quoteClientId}
                      onChange={(e) => setQuoteClientId(Number(e.target.value))}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    >
                      {clients.length === 0 ? <option value={0}>General Customer</option> : clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Expiry / Valid Till</label>
                    <input
                      type="date"
                      value={quoteValidUntil}
                      onChange={(e) => setQuoteValidUntil(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Quote Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Annual Cloud Maintenance"
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg shadow-xs flex items-center justify-center gap-1.5">
                      <Plus size={14} /> Save Quotation
                    </button>
                  </div>
                </form>
              </div>
            )}

            {salesSubTab === "clients" && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <Users className="text-blue-600" size={18} />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Add New Client / Customer</h3>
                    <p className="text-xs text-slate-400">Save client GSTIN, State code and Billing Address for 1-click invoicing</p>
                  </div>
                </div>
                <form onSubmit={handleSaveClient} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Company / Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Horizon Infotech Ltd"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Client GSTIN *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 27AAACH7409R1ZZ"
                      value={clientGstin}
                      onChange={(e) => setClientGstin(e.target.value.toUpperCase())}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 font-mono uppercase outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Place of Supply (State) *</label>
                    <select
                      value={clientPlaceOfSupply}
                      onChange={(e) => setClientPlaceOfSupply(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    >
                      {Object.entries(INDIAN_STATES).map(([code, name]) => (
                        <option key={code} value={name}>{code} - {name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg shadow-xs flex items-center justify-center gap-1.5">
                      <Plus size={14} /> Add Client
                    </button>
                  </div>
                </form>
              </div>
            )}

            {salesSubTab === "items" && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <Package className="text-blue-600" size={18} />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Add Item to Catalog</h3>
                    <p className="text-xs text-slate-400">Save products or service rates with statutory HSN/SAC codes</p>
                  </div>
                </div>
                <form onSubmit={handleSaveItem} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Item Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IT Consulting"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">HSN / SAC Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 998311"
                      value={itemHsn}
                      onChange={(e) => setItemHsn(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 15000"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">GST Rate *</label>
                    <select
                      value={itemGst}
                      onChange={(e) => setItemGst(Number(e.target.value))}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    >
                      <option value={0}>0% GST</option>
                      <option value={5}>5% GST</option>
                      <option value={12}>12% GST</option>
                      <option value={18}>18% GST</option>
                      <option value={28}>28% GST</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg shadow-xs flex items-center justify-center gap-1.5">
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                </form>
              </div>
            )}

            {salesSubTab === "notes" && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <Receipt className="text-blue-600" size={18} />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Issue Credit or Debit Note</h3>
                    <p className="text-xs text-slate-400">Post GST-compliant debit/credit adjustments against issued invoices</p>
                  </div>
                </div>
                <form onSubmit={handleSaveNote} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Note Type *</label>
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value as any)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    >
                      <option value="Credit Note">Credit Note (- Reduction)</option>
                      <option value="Debit Note">Debit Note (+ Addition)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Linked Invoice *</label>
                    <select
                      value={noteInvoiceId}
                      onChange={(e) => setNoteInvoiceId(Number(e.target.value))}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    >
                      {billingHistory.map(b => (
                        <option key={b.id} value={b.id}>{b.invoiceNumber} - {b.customer} (₹{b.amount})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Adjustment Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5000"
                      value={noteAmount}
                      onChange={(e) => setNoteAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg shadow-xs flex items-center justify-center gap-1.5">
                      <Plus size={14} /> Issue Note
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* BOTTOM CARD: HISTORY AND SAVED DATA TRACK (DATA TABLE DIRECTLY BELOW) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                  {salesSubTab === "invoices" && "Invoice History & Saved Records"}
                  {salesSubTab === "quotes" && "Active Quotations & Estimates"}
                  {salesSubTab === "notes" && "Credit & Debit Notes Ledger"}
                  {salesSubTab === "clients" && "Client & Customer Directory"}
                  {salesSubTab === "items" && "Goods & Services Item Master"}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                  <button className="p-2 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-500 hover:bg-slate-50 shadow-xs">
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                {salesSubTab === "invoices" && (
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                      <tr>
                        <th className="py-3 px-3">Invoice # :</th>
                        <th className="py-3 px-3">Party / Supply :</th>
                        <th className="py-3 px-3">Date / Terms :</th>
                        <th className="py-3 px-3">Status :</th>
                        <th className="py-3 px-3">Grand Total (₹) :</th>
                        <th className="py-3 px-3 text-right">Actions :</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                      {billingHistory.filter(i => (i.customer + i.invoiceNumber).toLowerCase().includes(mainSearchQuery.toLowerCase())).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            <FileText size={24} className="mx-auto mb-1 text-slate-300 dark:text-zinc-600" />
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">No invoices recorded yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Use the form above to generate and issue your first GST tax invoice.</p>
                          </td>
                        </tr>
                      ) : billingHistory.filter(i => (i.customer + i.invoiceNumber).toLowerCase().includes(mainSearchQuery.toLowerCase())).map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                <FileText size={14} />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white block font-mono">{inv.invoiceNumber}</span>
                                <span className="text-[11px] text-slate-400 block">{inv.items?.length || 1} line item(s)</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-medium text-slate-900 dark:text-white block">{inv.customer}</span>
                            <span className="text-[11px] text-slate-400">{inv.placeOfSupply || "Intra-State"}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="text-slate-700 dark:text-zinc-300 block">{inv.date}</span>
                            <span className="text-[11px] text-slate-400">{inv.paymentTerms || "Due on Receipt"}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              inv.status === "Paid"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : inv.status === "Partial"
                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                : inv.status === "Overdue"
                                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                                : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                            ₹{inv.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => handlePreviewPdf(inv)} title="Preview Invoice" className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors">
                                <Eye size={13} />
                              </button>
                              <button onClick={() => handleDownloadPdf(inv)} title="Download PDF" className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors">
                                <Download size={13} />
                              </button>
                              <button onClick={() => handleDeleteInvoice(inv.id)} title="Delete" className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {salesSubTab === "quotes" && (
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-3">Quote # :</th>
                        <th className="py-3 px-3">Client :</th>
                        <th className="py-3 px-3">Valid Until :</th>
                        <th className="py-3 px-3">Amount (₹) :</th>
                        <th className="py-3 px-3">Status :</th>
                        <th className="py-3 px-3 text-right">Actions :</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {quotations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            <FileEdit size={24} className="mx-auto mb-1 text-slate-300 dark:text-zinc-600" />
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">No quotations created yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Use the form above to generate a client quotation.</p>
                          </td>
                        </tr>
                      ) : quotations.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{q.quoteNumber}</td>
                          <td className="py-3.5 px-3 font-medium text-slate-800">{q.clientName}</td>
                          <td className="py-3.5 px-3 text-slate-500">{q.validUntil}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">₹{q.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">{q.status}</span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button onClick={() => handleConvertQuoteToInvoice(q)} className="text-xs text-blue-600 hover:underline font-semibold mr-2">Convert to Invoice</button>
                            <button onClick={() => handleDeleteQuote(q.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={13} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {salesSubTab === "notes" && (
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-3">Note # :</th>
                        <th className="py-3 px-3">Type :</th>
                        <th className="py-3 px-3">Linked Invoice :</th>
                        <th className="py-3 px-3">Date :</th>
                        <th className="py-3 px-3">Amount (₹) :</th>
                        <th className="py-3 px-3 text-right">Actions :</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {creditDebitNotes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            <Receipt size={24} className="mx-auto mb-1 text-slate-300 dark:text-zinc-600" />
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">No credit or debit notes issued yet</p>
                          </td>
                        </tr>
                      ) : creditDebitNotes.map((n) => (
                        <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{n.noteNumber}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${n.type === 'Credit Note' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'}`}>
                              {n.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-600">{n.originalInvoiceNumber}</td>
                          <td className="py-3.5 px-3 text-slate-500">{n.date}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">₹{n.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3.5 px-3 text-right">
                            <button onClick={() => handleDeleteNote(n.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={13} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {salesSubTab === "clients" && (
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-3">Client Name :</th>
                        <th className="py-3 px-3">GSTIN :</th>
                        <th className="py-3 px-3">Place of Supply :</th>
                        <th className="py-3 px-3 text-right">Actions :</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {clients.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400">
                            <Users size={24} className="mx-auto mb-1 text-slate-300 dark:text-zinc-600" />
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">No clients in directory yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Add a client above for 1-click tax invoicing.</p>
                          </td>
                        </tr>
                      ) : clients.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-slate-900">{c.name}</td>
                          <td className="py-3.5 px-3 font-mono text-blue-600">{c.gstin}</td>
                          <td className="py-3.5 px-3">{c.placeOfSupply}</td>
                          <td className="py-3.5 px-3 text-right">
                            <button onClick={() => handleDeleteClient(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {salesSubTab === "items" && (
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-3">Item Name :</th>
                        <th className="py-3 px-3">Type :</th>
                        <th className="py-3 px-3">HSN/SAC :</th>
                        <th className="py-3 px-3">GST Rate :</th>
                        <th className="py-3 px-3 text-right">Selling Price (₹) :</th>
                        <th className="py-3 px-3 text-right">Actions :</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {itemsCatalog.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            <Package size={24} className="mx-auto mb-1 text-slate-300 dark:text-zinc-600" />
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">No items in catalog yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Add your products or services above.</p>
                          </td>
                        </tr>
                      ) : itemsCatalog.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-slate-900">{item.name}</td>
                          <td className="py-3.5 px-3">{item.type}</td>
                          <td className="py-3.5 px-3 font-mono">{item.hsnSac}</td>
                          <td className="py-3.5 px-3 font-bold text-blue-600">{item.gstRate}%</td>
                          <td className="py-3.5 px-3 text-right font-bold text-slate-900">₹{item.sellingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3.5 px-3 text-right">
                            <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        );

      case "purchases":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Purchase Management & ITC</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Track vendor bills, purchase orders, and claim Input Tax Credit (ITC)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Total Purchases", `₹${totalPurchases.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "+8.73%", `${purchases.length} total vendor bills`, ShoppingCart)}
              {renderKpiCard("GST Input Tax Credit", `₹${totalGstItc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "+96.7%", "Eligible to offset outward tax liability", Sparkles)}
              {renderKpiCard("Pending Dues", `₹${purchases.filter(p=>p.status==="Pending").reduce((s,p)=>s+(p.amount||0),0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "+12.3%", "Bills pending clearance", Clock)}
              {renderKpiCard("Active Vendors", new Set(purchases.map(p => p.vendor)).size || 1, "Monthly ITC", "Realized Input Tax", Building)}
            </div>

            {/* TOP CARD: INTERFACE OF THE OPERATION (RECORD PURCHASE BILL FORM) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Record Purchase Bill / Inward Supply</h2>
                    <p className="text-xs text-slate-400">Record vendor inward bills and claim Input Tax Credit (ITC) under GST Section 16</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSavePurchase} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Vendor / Supplier Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Hardware Ltd"
                      value={purchaseVendor}
                      onChange={(e) => setPurchaseVendor(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Vendor Bill / Invoice # *</label>
                    <input
                      type="text"
                      placeholder="e.g. PUR-2026-004"
                      value={purchaseBillNo}
                      onChange={(e) => setPurchaseBillNo(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Purchase Category</label>
                    <select
                      value={purchaseCategory}
                      onChange={(e) => setPurchaseCategory(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    >
                      <option value="Hardware & Equipment">Hardware & Equipment</option>
                      <option value="Cloud & Servers">Cloud & Servers</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Professional Fees">Professional Fees</option>
                      <option value="Raw Materials">Raw Materials</option>
                      <option value="Logistics & Shipping">Logistics & Shipping</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Bill Amount (Taxable) in ₹ *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 25000"
                      value={purchaseAmount}
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : "";
                        setPurchaseAmount(val);
                        if (val && !purchaseGst) {
                          setPurchaseGst(Math.round(Number(val) * 0.18));
                        }
                      }}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-700 dark:text-zinc-300 font-semibold">GST Paid / ITC (₹)</label>
                      {purchaseAmount ? (
                        <button
                          type="button"
                          onClick={() => setPurchaseGst(Math.round(Number(purchaseAmount) * 0.18))}
                          className="text-[10px] text-emerald-600 hover:underline"
                        >
                          Auto 18%
                        </button>
                      ) : null}
                    </div>
                    <input
                      type="number"
                      placeholder="e.g. 4500"
                      value={purchaseGst}
                      onChange={(e) => setPurchaseGst(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Bill Date</label>
                    <input
                      type="date"
                      value={purchaseDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Payment Status</label>
                    <select
                      value={purchaseStatus}
                      onChange={(e) => setPurchaseStatus(e.target.value as any)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <span>Save Purchase Bill & Register ITC</span>
                  </button>
                </div>
              </form>
            </div>

            {/* BOTTOM CARD: HISTORY AND SAVED DATA TRACK (INWARD BILLS & ITC REGISTER) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Vendor Inward Bills & ITC Register</h2>
                  <div className="flex gap-1">
                    {(["All", "Paid", "Pending"] as const).map(flt => (
                      <button
                        key={flt}
                        onClick={() => setPurchaseFilter(flt)}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                          purchaseFilter === flt
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {flt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search bills..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Bill Number :</th>
                      <th className="py-3 px-3">Vendor Name :</th>
                      <th className="py-3 px-3">Category :</th>
                      <th className="py-3 px-3">Bill Date :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">Taxable (₹) :</th>
                      <th className="py-3 px-3">GST ITC (₹) :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                    {purchases.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400">
                            <ShoppingBag size={24} className="mx-auto mb-1 text-slate-300 dark:text-zinc-600" />
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">No purchase bills recorded yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Use the form above to record inward supplies & claim ITC.</p>
                          </td>
                        </tr>
                      ) : purchases
                      .filter(p => purchaseFilter === "All" || p.status === purchaseFilter)
                      .filter(p => (p.vendor + (p.billNumber || "")).toLowerCase().includes(mainSearchQuery.toLowerCase()))
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                            {p.billNumber || `PUR-${p.id.toString().slice(-4)}`}
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-zinc-200">
                            {p.vendor}
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 dark:text-zinc-400">
                            {p.category}
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 dark:text-zinc-400">
                            {p.date}
                          </td>
                          <td className="py-3.5 px-3">
                            <button
                              onClick={() => handleTogglePurchaseStatus(p.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer ${
                                p.status === "Paid"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {p.status}
                            </button>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                            ₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{Number(p.gstPaid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => handleDeletePurchase(p.id)}
                              title="Delete Purchase Bill"
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "expenses":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Business Expense Management</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Track deductible operating expenses, overhead costs, and category breakdowns</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Total Expenses", `₹${totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "+8.73%", `${expenses.length} operating line items`, DollarSign)}
              {renderKpiCard("Active Categories", new Set(expenses.map(e => e.category)).size || 1, "Cost centers", "Audited expense categories", Folder)}
              {renderKpiCard("Monthly Outflow", `₹${totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "+12.3%", "Current month realized", Wallet)}
              {renderKpiCard("Tax Deductible", `₹${(totalExpenses * 0.95).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "Section 37", "Eligible business deductions", Shield)}
            </div>

            {/* TOP CARD: INTERFACE OF THE OPERATION (ADD BUSINESS EXPENSE FORM) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Business Expense</h2>
                    <p className="text-xs text-slate-400">Log operational expenditures, deductibles & petty cash outlays</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Expense Title / Purpose *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AWS Cloud Infrastructure Hosting"
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Category</label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    >
                      <option value="Software & Subscriptions">Software & Subscriptions</option>
                      <option value="Office Rent & Facilities">Office Rent & Facilities</option>
                      <option value="Travel & Commute">Travel & Commute</option>
                      <option value="Utilities & Internet">Utilities & Internet</option>
                      <option value="Professional Fees">Professional Fees</option>
                      <option value="Marketing & Advertising">Marketing & Advertising</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 18500"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Payment Mode</label>
                    <select
                      value={expenseMode}
                      onChange={(e) => setExpenseMode(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                      <option value="Credit Card">Corporate Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Cash">Cash / Petty</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <DollarSign size={14} />
                    <span>Record Business Expense</span>
                  </button>
                </div>
              </form>
            </div>

            {/* BOTTOM CARD: HISTORY AND SAVED DATA TRACK (EXPENSE LEDGER) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Business Expense Ledger & History</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Expense Title :</th>
                      <th className="py-3 px-3">Category :</th>
                      <th className="py-3 px-3">Date :</th>
                      <th className="py-3 px-3">Payment Mode :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">Amount (₹) :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                    {expenses.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            <DollarSign size={24} className="mx-auto mb-1 text-slate-300 dark:text-zinc-600" />
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">No business expenses recorded yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Use the form above to log operational expenditures.</p>
                          </td>
                        </tr>
                      ) : expenses
                      .filter(e => (e.title + e.category).toLowerCase().includes(mainSearchQuery.toLowerCase()))
                      .map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                            {exp.title}
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 dark:text-zinc-400">
                            {exp.category}
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 dark:text-zinc-400">
                            {exp.date}
                          </td>
                          <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-zinc-300">
                            {exp.mode}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              Paid
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                            ₹{Number(exp.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              title="Delete Expense"
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "payments-tracker":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Payments & Cash Flow Tracker</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Real-time ledger of inbound client settlements, vendor payouts, and net operating liquidity</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Total Settlements", `₹${payments.reduce((s,p)=>s+(p.amount||0),0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "+8.73%", `${payments.length} ledger entries`, Wallet)}
              {renderKpiCard("Inflows (Collections)", `₹${payments.filter(p=>p.type==="Inflow").reduce((s,p)=>s+(p.amount||0),0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "+96.7%", "Client invoice clearances", ArrowDownLeft)}
              {renderKpiCard("Outflows (Disbursed)", `₹${payments.filter(p=>p.type==="Outflow").reduce((s,p)=>s+(p.amount||0),0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "+12.3%", "Supplier & expense payments", ArrowUpRight)}
              {renderKpiCard("Pending Clearance", `₹${payments.filter(p=>p.status==="Pending").reduce((s,p)=>s+(p.amount||0),0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "Uncleared", "Cheque / NEFT in transit", Clock)}
            </div>

            {/* TOP CARD: INTERFACE OF THE OPERATION (RECORD TRANSACTION FORM) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                    <Wallet size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Record Cash Flow & Payment Transaction</h2>
                    <p className="text-xs text-slate-400">Track real-time bank settlements, collections & payout disbursements</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Transaction Type *</label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as any)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none"
                    >
                      <option value="Inflow">Inflow (+ Inward Collection/Income)</option>
                      <option value="Outflow">Outflow (- Disbursement/Expense)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Transaction Title / Description *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Client Invoice Settlement - Horizon Tech"
                      value={paymentTitle}
                      onChange={(e) => setPaymentTitle(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Counterparty (Customer / Vendor)</label>
                    <input
                      type="text"
                      placeholder="e.g. Horizon Infotech Ltd"
                      value={paymentParty}
                      onChange={(e) => setPaymentParty(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50000"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    >
                      <option value="UPI">UPI</option>
                      <option value="NEFT/RTGS">NEFT / RTGS</option>
                      <option value="IMPS">IMPS</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Reference / UTR #</label>
                    <input
                      type="text"
                      placeholder="e.g. UTR829103982"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as any)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    >
                      <option value="Cleared">Cleared</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Wallet size={14} />
                    <span>Record Settlement Entry</span>
                  </button>
                </div>
              </form>
            </div>

            {/* BOTTOM CARD: HISTORY AND SAVED DATA TRACK (SETTLEMENT REGISTER) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Cash Flow Register & Settlement History</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Type :</th>
                      <th className="py-3 px-3">Transaction & Counterparty :</th>
                      <th className="py-3 px-3">Method & UTR :</th>
                      <th className="py-3 px-3">Date :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">Amount (₹) :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                    {payments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            <Wallet size={24} className="mx-auto mb-1 text-slate-300 dark:text-zinc-600" />
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">No payment transactions recorded yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Use the form above to record inward/outward liquidity.</p>
                          </td>
                        </tr>
                      ) : payments
                      .filter(p => (p.title + p.party + (p.ref || "")).toLowerCase().includes(mainSearchQuery.toLowerCase()))
                      .map((pay) => (
                        <tr key={pay.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              pay.type === "Inflow"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200"
                                : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200"
                            }`}>
                              {pay.type === "Inflow" ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                              {pay.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-semibold text-slate-900 dark:text-white block">{pay.title}</span>
                            <span className="text-[11px] text-slate-400">{pay.party}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-medium text-slate-700 dark:text-zinc-300 block">{pay.method}</span>
                            <span className="font-mono text-[11px] text-slate-400">{pay.ref}</span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 dark:text-zinc-400">
                            {pay.date}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              pay.status === "Cleared"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {pay.status}
                            </span>
                          </td>
                          <td className={`py-3.5 px-3 font-bold ${
                            pay.type === "Inflow" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          }`}>
                            {pay.type === "Inflow" ? "+" : "-"}₹{Number(pay.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => handleDeletePayment(pay.id)}
                              title="Delete Transaction"
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "compliance-tracker":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Compliance Tracker</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Track all statutory compliance tasks and deadlines updated live by your tax administrator</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
                <CheckCircle size={14} />
                <span>Admin Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Active Compliances", complianceTasks.length, "+8.73%", "Statutory deadlines active", FileText)}
              {renderKpiCard("Verified Filings", "1", "+96.7%", "Approved by MCA & GSTN", CheckCircle2)}
              {renderKpiCard("Ongoing Cycles", "2", "+12.3%", "In-progress monthly returns", RefreshCw)}
              {renderKpiCard("Next Filing Due", "20th Nov", "Statutory", "GSTR-1 & GSTR-3B deadline", Calendar)}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Statutory Deadlines & Filing Tasks</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Compliance Title :</th>
                      <th className="py-3 px-3">Statutory Due :</th>
                      <th className="py-3 px-3">Authority :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">Verification :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                    {complianceTasks.filter(t => t.title.toLowerCase().includes(mainSearchQuery.toLowerCase())).map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-900 dark:text-white block">{task.title}</span>
                          <span className="text-[11px] text-slate-400">{task.description}</span>
                        </td>
                        <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-zinc-300">
                          {task.dueDate}
                        </td>
                        <td className="py-3.5 px-3 font-mono font-semibold text-blue-600">
                          {task.authority}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            task.status === "Complied"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : task.status === "Action Required"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 size={13} /> {task.verifiedBy || "CA / Tax Admin"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "payroll":
      case "payrolls":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Payroll & Workforce Directory</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Manage employee compensation, statutory deductions (PF/TDS), and monthly salary disbursements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Total Monthly Payroll", `₹${totalMonthlyPayroll.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "+8.73%", "Gross monthly salary", Users)}
              {renderKpiCard("Active Employees", employees.length, "Full-time", "Enrolled team roster", Briefcase)}
              {renderKpiCard("Pending Disbursals", `₹${totalPendingSalaries.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, "Pending clearance", "To be credited", Clock)}
              {renderKpiCard("Avg Employee Pay", `₹${employees.length ? (totalMonthlyPayroll / employees.length).toFixed(2) : '0.00'}`, "Per member", "Median compensation", Sparkles)}
            </div>

            {/* TOP CARD: INTERFACE OF THE OPERATION (ADD EMPLOYEE FORM) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Employee & Setup Salary Structure</h2>
                    <p className="text-xs text-slate-400">Enroll workforce members, configure monthly compensation and net payout</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Employee Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohit Verma"
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Designation / Role *</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Accounts Manager"
                      value={empRole}
                      onChange={(e) => setEmpRole(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Salary Status</label>
                    <select
                      value={empStatus}
                      onChange={(e) => setEmpStatus(e.target.value as any)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Basic Salary (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45000"
                      value={empBasic}
                      onChange={(e) => setEmpBasic(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">HRA & Allowances (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={empHra}
                      onChange={(e) => setEmpHra(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Deductions (PF, TDS, PT) (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={empDeductions}
                      onChange={(e) => setEmpDeductions(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {/* Live Estimated Net Salary calculation banner */}
                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    Net Take-Home Calculation: ₹{Number(empBasic || 0)} (Basic) + ₹{Number(empHra || 0)} (HRA) - ₹{Number(empDeductions || 0)} (Deductions)
                  </span>
                  <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                    Net Pay: ₹{Math.max(0, (Number(empBasic || 0) + Number(empHra || 0) - Number(empDeductions || 0))).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Users size={14} />
                    <span>Enroll Employee & Save Payroll</span>
                  </button>
                </div>
              </form>
            </div>

            {/* BOTTOM CARD: HISTORY AND SAVED DATA TRACK (EMPLOYEE DIRECTORY & SALARY REGISTER) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Employee Directory & Salary Register</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Employee Name :</th>
                      <th className="py-3 px-3">Role / Designation :</th>
                      <th className="py-3 px-3">Basic (₹) :</th>
                      <th className="py-3 px-3">HRA (₹) :</th>
                      <th className="py-3 px-3">Deductions (₹) :</th>
                      <th className="py-3 px-3">Net Salary (₹) :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                    {employees.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400">
                            <Users size={24} className="mx-auto mb-1 text-slate-300 dark:text-zinc-600" />
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">No employees enrolled in payroll yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Use the form above to add staff and setup compensation.</p>
                          </td>
                        </tr>
                      ) : employees
                      .filter(e => (e.name + (e.role || "")).toLowerCase().includes(mainSearchQuery.toLowerCase()))
                      .map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                            {emp.name}
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 dark:text-zinc-400">
                            {emp.role}
                          </td>
                          <td className="py-3.5 px-3">
                            ₹{Number(emp.basic || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3">
                            ₹{Number(emp.hra || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3 text-rose-600">
                            ₹{Number(emp.deductions || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                            ₹{Number(emp.netSalary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-3">
                            <button
                              onClick={() => handleToggleEmpStatus(emp.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer ${
                                emp.status === "Paid"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {emp.status}
                            </button>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => handleDeleteEmployee(emp.id)}
                              title="Delete Employee"
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Documents & Statutory Vault</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Secure cloud repository for verified GST returns, ROC filings, trade licenses & KYC files</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Stored Records", documents.length, "+8.73%", "Verified statutory records", Folder)}
              {renderKpiCard("Verified Compliances", documents.filter(d=>d.verified).length, "+96.7%", "CA & tax administrator certified", CheckCircle2)}
              {renderKpiCard("Categories", new Set(documents.map(d=>d.category)).size || 1, "+12.3%", "Filing & regulatory folders", Layers)}
              {renderKpiCard("Next Filing Period", "20th Nov", "Statutory", "Monthly GST returns due", Calendar)}
            </div>

            {/* TOP CARD: INTERFACE OF THE OPERATION (STORE DOCUMENT FORM) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                    <Folder size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Store Statutory Record & Compliance Document</h2>
                    <p className="text-xs text-slate-400">Upload & archive GST returns, ROC filings, audit reports, licenses & KYC</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Document Title / Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GSTR-3B Acknowledgement Oct 2026"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Category</label>
                    <select
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                    >
                      <option value="Tax Filings">Tax Filings (GST, TDS, ITR)</option>
                      <option value="Registrations">Registrations (COI, PAN, MSME)</option>
                      <option value="Legal & Licenses">Legal & Licenses (FSSAI, Trade, TM)</option>
                      <option value="Financial Statements">Financial Statements & Balance Sheet</option>
                      <option value="Audit Reports">Audit Reports</option>
                      <option value="Invoices & Vouchers">Invoices & Vouchers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Select File (PDF, DOCX, PNG, JPG)</label>
                    <input
                      type="file"
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Upload size={14} />
                    <span>Upload & Store in Vault</span>
                  </button>
                </div>
              </form>
            </div>

            {/* BOTTOM CARD: HISTORY AND SAVED DATA TRACK (DOCUMENT VAULT & RECORDS) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Statutory Document Vault & Records</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Document Title :</th>
                      <th className="py-3 px-3">Category :</th>
                      <th className="py-3 px-3">Upload Date :</th>
                      <th className="py-3 px-3">File Size :</th>
                      <th className="py-3 px-3">Verification :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                    {documents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            <Folder size={24} className="mx-auto mb-1 text-slate-300 dark:text-zinc-600" />
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">No statutory documents stored yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Use the form above to archive compliance records & KYC.</p>
                          </td>
                        </tr>
                      ) : documents
                      .filter(d => (d.name + d.category).toLowerCase().includes(mainSearchQuery.toLowerCase()))
                      .map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <FileCheck2 size={16} className="text-blue-600 flex-shrink-0" />
                              <span className="font-semibold text-slate-900 dark:text-white">{doc.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 dark:text-zinc-400">
                            {doc.category}
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 dark:text-zinc-400">
                            {doc.date}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-600">
                            {doc.size}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                              <CheckCircle2 size={13} /> Verified
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => alert(`Downloading ${doc.name}...`)}
                                title="Download"
                                className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Download size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteDoc(doc.id)}
                                title="Delete"
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Reports & Financial Statements</h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Executive statements, GSTR-1/3B tax liability summaries, and operational profit & loss snapshots</p>
              </div>
              <button
                onClick={handleTopPrimaryAction}
                className="bg-black hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 uppercase tracking-wide self-start sm:self-auto transition-all"
              >
                <Printer size={14} />
                <span>+ PRINT REPORT</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Gross Revenue", `₹${totalSales.toFixed(2)}`, "+8.73%", "Sales billing revenue", TrendingUp)}
              {renderKpiCard("Total Purchases", `₹${totalPurchases.toFixed(2)}`, "+96.7%", "Inward procurement expense", ShoppingBag)}
              {renderKpiCard("Operating Overheads", `₹${totalExpenses.toFixed(2)}`, "+12.3%", "Facilities, tools & payroll", DollarSign)}
              {renderKpiCard("Net Operating Profit", `₹${operatingProfit.toFixed(2)}`, "EBITDA", "Net calculated profitability", BarChart3)}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100/90 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Executive Statements & Tax Liability Snapshot</h2>
                <span className="text-xs text-gray-400 font-mono">FY 2026-27</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">GST Output Liability</span>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">₹{totalGstOutput.toFixed(2)}</p>
                  <p className="text-[11px] text-gray-400">Total forward tax collected on sales</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">Input Tax Credit (ITC)</span>
                  <p className="text-xl font-bold text-emerald-600">₹{totalGstItc.toFixed(2)}</p>
                  <p className="text-[11px] text-gray-400">Total inward GST credit available</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">Net GST Payable</span>
                  <p className="text-xl font-bold text-blue-600">₹{netGstPayable.toFixed(2)}</p>
                  <p className="text-[11px] text-gray-400">Cash ledger liability to offset</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "company-profile":
        return (
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Company Profile</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Manage your legal entity, Indian GSTIN, PAN, bank settlement & invoice numbering</p>
              </div>
              <button
                onClick={() => {
                  saveAllData({ companyProfile });
                  alert("Company profile updated and saved successfully!");
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Check size={14} />
                <span>Save Profile</span>
              </button>
            </div>

            {/* Profile Form Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6">
              {/* Entity Identity */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">1. Legal Entity & GST Identification</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Legal Registered Name *</label>
                    <input
                      type="text"
                      value={companyProfile.legalName}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, legalName: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Trade / Brand Name</label>
                    <input
                      type="text"
                      value={companyProfile.tradeName}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, tradeName: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Entity Type</label>
                    <select
                      value={companyProfile.entityType}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, entityType: e.target.value as any })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                    >
                      <option value="Pvt Ltd">Private Limited (Pvt Ltd)</option>
                      <option value="LLP">Limited Liability Partnership (LLP)</option>
                      <option value="Partnership">Partnership Firm</option>
                      <option value="Proprietorship">Sole Proprietorship</option>
                      <option value="Public Ltd">Public Limited Company</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">State of Registration *</label>
                    <select
                      value={companyProfile.state}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, state: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                    >
                      {INDIAN_STATES.map(s => (
                        <option key={s.code} value={s.name}>{s.code} - {s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">GSTIN (15 Alphanumeric) *</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={companyProfile.gstin}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, gstin: e.target.value.toUpperCase() })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">PAN *</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={companyProfile.pan}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, pan: e.target.value.toUpperCase() })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Registered Address */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">2. Registered Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      value={companyProfile.registeredAddress.street}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        registeredAddress: { ...companyProfile.registeredAddress, street: e.target.value }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={companyProfile.registeredAddress.city}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        registeredAddress: { ...companyProfile.registeredAddress, city: e.target.value }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={companyProfile.registeredAddress.pinCode}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        registeredAddress: { ...companyProfile.registeredAddress, pinCode: e.target.value }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bank & Settlement Details */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">3. Bank & UPI Settlement (Prints on Invoices)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Account Name</label>
                    <input
                      type="text"
                      value={companyProfile.bankDetails.accountName}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        bankDetails: { ...companyProfile.bankDetails, accountName: e.target.value }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={companyProfile.bankDetails.bankName}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        bankDetails: { ...companyProfile.bankDetails, bankName: e.target.value }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Account Number</label>
                    <input
                      type="text"
                      value={companyProfile.bankDetails.accountNumber}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        bankDetails: { ...companyProfile.bankDetails, accountNumber: e.target.value }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={companyProfile.bankDetails.ifscCode}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        bankDetails: { ...companyProfile.bankDetails, ifscCode: e.target.value.toUpperCase() }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">UPI ID (For Dynamic QR Code)</label>
                    <input
                      type="text"
                      value={companyProfile.bankDetails.upiId}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        bankDetails: { ...companyProfile.bankDetails, upiId: e.target.value }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Numbering & Financial Year Configuration */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">4. Invoice Numbering & Sequence</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Financial Year</label>
                    <input
                      type="text"
                      value={companyProfile.numberingConfig.financialYear}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        numberingConfig: { ...companyProfile.numberingConfig, financialYear: e.target.value }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Invoice Prefix</label>
                    <input
                      type="text"
                      value={companyProfile.numberingConfig.invoicePrefix}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        numberingConfig: { ...companyProfile.numberingConfig, invoicePrefix: e.target.value }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Next Invoice Number</label>
                    <input
                      type="number"
                      value={companyProfile.numberingConfig.invoiceNext}
                      onChange={(e) => setCompanyProfile({
                        ...companyProfile,
                        numberingConfig: { ...companyProfile.numberingConfig, invoiceNext: parseInt(e.target.value) || 1 }
                      })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => {
                    saveAllData({ companyProfile });
                    alert("Company Profile saved successfully!");
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings & Preferences</h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Manage Indian GST filing rules, invoicing preferences, currency & data backups</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs space-y-6 text-xs">
              {/* GST & Currency Preferences */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">1. Currency & Invoicing Standards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">
                    <p className="font-bold text-slate-900 dark:text-white">Default Operating Currency</p>
                    <p className="text-slate-500 mt-1">Locked to <strong>Indian Rupee (₹ - INR)</strong> for full statutory Indian GST compliance.</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">
                    <p className="font-bold text-slate-900 dark:text-white">Tax Splitting Mechanism</p>
                    <p className="text-slate-500 mt-1">Automatic: Intra-State (CGST + SGST 50/50 split) vs Inter-State (IGST 100%).</p>
                  </div>
                </div>
              </div>

              {/* Statutory Rules */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">2. Statutory E-Way Bill & E-Invoice Rules</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">E-Way Bill Mandatory Threshold</p>
                      <p className="text-slate-400">Consignments with taxable value exceeding ₹50,000</p>
                    </div>
                    <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">₹50,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">UPI QR Code Generation on Tax Invoices</p>
                      <p className="text-slate-400">Embeds dynamic payment QR code with invoice amount and VPA</p>
                    </div>
                    <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">Active</span>
                  </div>
                </div>
              </div>

              {/* Data Backup & Cloud Sync */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">3. Database & LocalStorage Synchronization</h3>
                <p className="text-slate-500 mb-3">All your invoices, client catalogs, purchases, expenses and payroll records are dual-persisted across localStorage and the backend API.</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const data = {
                        companyProfile,
                        billingHistory,
                        quotations,
                        creditDebitNotes,
                        clients,
                        items,
                        purchases,
                        expenses,
                        payments,
                        employees,
                        documents
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `triotax_erp_backup_${new Date().toISOString().split("T")[0]}.json`;
                      a.click();
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    Export Full ERP Backup (JSON)
                  </button>
                  <button
                    onClick={() => alert("All statutory data is currently synchronized with the cloud database.")}
                    className="px-4 py-2 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    Verify Sync Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SIDEBAR NAVIGATION (WITH 3-LINE HAMBURGER TOGGLE & SHRINK MODE)
  // ─────────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className={`flex flex-col h-full bg-white dark:bg-zinc-950 text-slate-700 dark:text-zinc-200 border-r border-slate-200/80 dark:border-zinc-800 transition-all duration-300 select-none font-sans ${
      isSidebarCollapsed ? "w-[68px]" : "w-60"
    }`}>
      {/* Brand Header with Artboard 3.png and 3-lines hamburger menu right beside it */}
      <div className={`p-3.5 pb-3 flex items-center border-b border-slate-100 dark:border-zinc-800/80 transition-all ${
        isSidebarCollapsed ? "justify-center flex-col gap-2 px-2" : "justify-between px-4"
      }`}>
        {isSidebarCollapsed ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <img src="/Artboard 3.png" alt="TrioTax" className="h-7 w-auto object-contain flex-shrink-0" />
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              title="Expand sidebar"
            >
              <Menu size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <img src="/Artboard 3.png" alt="TrioTax" className="h-7 w-auto object-contain flex-shrink-0" />
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                TrioTax
              </span>
              {/* 3-lines hamburger menu button right beside the logo */}
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer ml-1"
                title="Collapse sidebar"
              >
                <Menu size={18} />
              </button>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              title="Close Sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          </>
        )}
      </div>

      {/* Navigation Group Header */}
      {isSidebarCollapsed ? (
        <div className="my-2 mx-3 h-px bg-slate-100 dark:bg-zinc-800/80" />
      ) : (
        <div className="px-4 pt-3 pb-1">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            General
          </span>
        </div>
      )}

      {/* The 9 Tabs */}
      <div className={`flex-1 space-y-1 overflow-y-auto ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
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
              title={tab.label}
              className={`w-full transition-all flex items-center font-medium cursor-pointer rounded-lg ${
                isSidebarCollapsed
                  ? "justify-center p-2.5"
                  : "justify-between px-3 py-2 text-xs"
              } ${
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-zinc-900"
              }`}
            >
              <div className={`flex items-center ${isSidebarCollapsed ? "justify-center relative" : "gap-2.5"}`}>
                <tab.icon
                  size={isSidebarCollapsed ? 18 : 15}
                  className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-zinc-500"}
                />
                {!isSidebarCollapsed && <span>{tab.label}</span>}
                {tab.id === "compliance-tracker" && isSidebarCollapsed && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
                )}
              </div>
              {!isSidebarCollapsed && tab.id === "compliance-tracker" && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              )}
            </button>
          );
        })}

        {/* Section: Administration */}
        {isSidebarCollapsed ? (
          <div className="my-2 mx-3 h-px bg-slate-100 dark:bg-zinc-800/80" />
        ) : (
          <div className="px-1 pt-3 pb-1">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Administration
            </span>
          </div>
        )}

        <button
          onClick={() => {
            setActiveTab("company-profile");
            setIsMobileMenuOpen(false);
          }}
          title="Company Profile"
          className={`w-full transition-all flex items-center font-medium cursor-pointer rounded-lg ${
            isSidebarCollapsed
              ? "justify-center p-2.5"
              : "justify-between px-3 py-2 text-xs"
          } ${
            activeTab === "company-profile"
              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold shadow-xs"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-zinc-900"
          }`}
        >
          <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-2.5"}`}>
            <Building2
              size={isSidebarCollapsed ? 18 : 15}
              className={activeTab === "company-profile" ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}
            />
            {!isSidebarCollapsed && <span>Company Profile</span>}
          </div>
          {!isSidebarCollapsed && <ChevronRight size={13} className="text-slate-400" />}
        </button>

        <button
          onClick={() => {
            setActiveTab("settings");
            setIsMobileMenuOpen(false);
          }}
          title="Settings"
          className={`w-full transition-all flex items-center font-medium cursor-pointer rounded-lg ${
            isSidebarCollapsed
              ? "justify-center p-2.5"
              : "justify-between px-3 py-2 text-xs"
          } ${
            activeTab === "settings"
              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold shadow-xs"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-zinc-900"
          }`}
        >
          <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-2.5"}`}>
            <Settings
              size={isSidebarCollapsed ? 18 : 15}
              className={activeTab === "settings" ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}
            />
            {!isSidebarCollapsed && <span>Settings</span>}
          </div>
          {!isSidebarCollapsed && <ChevronRight size={13} className="text-slate-400" />}
        </button>
      </div>

      {/* Bottom User Profile Section */}
      <div className={`border-t border-slate-100 dark:border-zinc-800 ${
        isSidebarCollapsed ? "p-2 space-y-2 flex flex-col items-center" : "p-3 space-y-2"
      }`}>
        {isSidebarCollapsed ? (
          <>
            <div
              onClick={() => setActiveTab("company-profile")}
              className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs cursor-pointer hover:ring-2 hover:ring-blue-500/20"
              title={`${username} (${username}@triotax.in)`}
            >
              {username.charAt(0)}
            </div>
            <div className="flex flex-col items-center gap-1.5 pt-1 w-full border-t border-slate-100 dark:border-zinc-800/80">
              <ThemeToggle />
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => setActiveTab("company-profile")}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs">
                  {username.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{username}</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{username}@triotax.in</p>
                </div>
              </div>
              <ChevronUp size={14} className="text-slate-400" />
            </div>

            <div className="flex items-center justify-between px-2 pt-1 border-t border-slate-100 dark:border-zinc-800/80">
              <ThemeToggle />
              <button
                onClick={onLogout}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50/70 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden font-sans">
      {/* Desktop Sidebar with dynamic width and smooth transition */}
      <aside className={`hidden md:block h-full flex-shrink-0 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? "w-[68px]" : "w-60"
      }`}>
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
              className="w-60 h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/70 dark:bg-zinc-950">
        {/* Top Header Bar matching reference image & user quick access */}
        <header className="h-14 px-4 sm:px-8 bg-white dark:bg-zinc-950 flex items-center justify-between flex-shrink-0 border-b border-gray-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <Menu size={20} />
            </button>

            {/* History / Recent Activity Icon matching Reference Image */}
            <button
              onClick={() => alert("Recent Activity: System synced with GST Portal & Database.")}
              className="text-gray-400 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors hidden sm:flex items-center justify-center"
              title="Recent Activity / History"
            >
              <History size={16} />
            </button>

            {/* Search Bar with Dropdown indicator matching Reference Image */}
            <div className="relative w-56 sm:w-80 md:w-96">
              <div className="flex items-center justify-between w-full bg-white dark:bg-zinc-900 border border-gray-200/90 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs shadow-xs focus-within:border-gray-400 dark:focus-within:border-zinc-600 transition-all">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Search size={14} className="text-gray-400 flex-shrink-0" />
                  <ChevronDown size={11} className="text-gray-400 flex-shrink-0 -ml-0.5" />
                  <input
                    type="text"
                    value={mainSearchQuery}
                    onChange={(e) => setMainSearchQuery(e.target.value)}
                    placeholder={
                      activeTab === "sales"
                        ? "Search in Invoices, Quotes, Clients ( / )..."
                        : activeTab === "payments-tracker"
                        ? "Search in Payments Received ( / )..."
                        : "Search in ERP System ( / )..."
                    }
                    className="w-full bg-transparent outline-none text-xs text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500 truncate"
                  />
                </div>
                <kbd className="hidden sm:inline-block text-[10px] font-mono bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-1.5 py-0.5 text-gray-400">⌘K</kbd>
              </div>
            </div>
          </div>

          {/* Right Header Navigation & Actions matching Reference Image */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Organization Identifier Pill / Dropdown */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
              <span>This is a <strong className="text-gray-800 dark:text-zinc-200 font-semibold">Test</strong> organization.</span>
              <button
                onClick={() => setIsCompanyProfileOpen(true)}
                className="flex items-center gap-1 font-semibold text-gray-800 dark:text-zinc-200 hover:text-emerald-600 transition-colors ml-1"
                title="Switch Organization / Profile"
              >
                <span>{companyProfile.tradeName || companyProfile.legalName || "Demo Org"}</span>
                <ChevronDown size={13} className="text-gray-500" />
              </button>
            </div>

            <div className="hidden lg:block h-4 w-px bg-gray-200 dark:bg-zinc-700 mx-1"></div>

            {/* THE GREEN PLUS QUICK ACCESS BUTTON AND DROPDOWN */}
            <div className="relative" ref={quickAccessRef}>
              <button
                onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
                className="w-8 h-8 rounded-lg bg-[#10b981] hover:bg-[#059669] flex items-center justify-center text-white shadow-xs transition-all active:scale-95 cursor-pointer ring-2 ring-emerald-500/20"
                title="Quick Create & All Options"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>

              {/* Quick Access Flyout Dropdown */}
              <AnimatePresence>
                {isQuickAccessOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-[340px] sm:w-[580px] md:w-[680px] bg-white dark:bg-zinc-900 border border-gray-200/90 dark:border-zinc-800 rounded-2xl shadow-2xl p-5 sm:p-6 z-50 text-left select-none"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                      {/* Column 1: GENERAL */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800">
                          <LayoutGrid size={15} className="text-gray-500 dark:text-zinc-400" />
                          <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                            GENERAL
                          </span>
                        </div>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("payroll");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Add Users</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("sales");
                              setSalesSubTab("items");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Item</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("payroll");
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Log Time</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("compliance-tracker");
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Weekly Log</span>
                          </button>
                        </div>
                      </div>

                      {/* Column 2: SALES */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800">
                          <ShoppingCart size={15} className="text-gray-500 dark:text-zinc-400" />
                          <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                            SALES
                          </span>
                        </div>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("sales");
                              setSalesSubTab("clients");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Customer</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("sales");
                              setSalesSubTab("quotes");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Quotes</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("sales");
                              setSalesSubTab("invoices");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Delivery Challan</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("sales");
                              setSalesSubTab("invoices");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Invoices</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("sales");
                              setSalesSubTab("invoices");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Recurring Invoice</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("payments-tracker");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Customer Payment</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("sales");
                              setSalesSubTab("notes");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Credit Notes</span>
                          </button>
                        </div>
                      </div>

                      {/* Column 3: PURCHASES */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800">
                          <ShoppingBag size={15} className="text-gray-500 dark:text-zinc-400" />
                          <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                            PURCHASES
                          </span>
                        </div>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("expenses");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Expenses</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("purchases");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Purchase Bills</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("documents");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Upload Documents</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsQuickAccessOpen(false);
                              setActiveTab("compliance-tracker");
                            }}
                            className="group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left"
                          >
                            <div className="w-4 h-4 rounded-full bg-gray-300/80 dark:bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-emerald-500 transition-colors flex-shrink-0">
                              <Plus size={10} strokeWidth={3} />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">Compliance Task</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => alert("All statutory compliances and automated schedules are up to date.")}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors relative"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            </button>

            {/* Settings Gear */}
            <button
              onClick={() => setIsCompanyProfileOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              title="Settings & Company Profile"
            >
              <Settings size={16} />
            </button>

            {/* Profile Avatar */}
            <div
              onClick={() => setIsCompanyProfileOpen(true)}
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-700 overflow-hidden bg-slate-900 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs hover:ring-2 hover:ring-gray-300 dark:hover:ring-zinc-600 transition-all uppercase"
              title="Profile Settings"
            >
              {username.charAt(0)}
            </div>

            {/* Grid Launcher Icon */}
            <button
              onClick={() => setActiveTab("reports")}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors hidden sm:block"
              title="Overview & Reports"
            >
              <LayoutGrid size={16} />
            </button>

            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-8 py-5">
          {renderContent()}
        </main>
      </div>


      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODALS & DRAWERS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isCompanyProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCompanyProfileOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/40">
                <div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-white flex items-center gap-2">
                    <Building size={20} className="text-blue-600" /> Company Master Profile & GST Setup
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Defines your legal entity identity, tax calculations, and dynamic UPI payment QR codes.</p>
                </div>
                <button onClick={() => setIsCompanyProfileOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveCompanyProfile} className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
                {/* 1. Legal & Identity */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b pb-1">1. Legal Entity & Tax Identifiers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Legal Entity Name *</label>
                      <input
                        type="text"
                        required
                        value={companyProfile.legalName}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, legalName: e.target.value })}
                        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Triotax Advisors Pvt Ltd"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Trade Name (Brand Name)</label>
                      <input
                        type="text"
                        value={companyProfile.tradeName}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, tradeName: e.target.value })}
                        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                        placeholder="e.g. TrioTax"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Entity Type *</label>
                      <select
                        value={companyProfile.entityType}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, entityType: e.target.value as any })}
                        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      >
                        <option value="Proprietorship">Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="LLP">LLP</option>
                        <option value="Pvt Ltd">Pvt Ltd</option>
                        <option value="Public Ltd">Public Ltd</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Company PAN (10 chars) *</label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={companyProfile.pan}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, pan: e.target.value.toUpperCase() })}
                        className="w-full font-mono uppercase border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                        placeholder="AAAAA9999A"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">GSTIN (15 chars) *</label>
                      <input
                        type="text"
                        required
                        maxLength={15}
                        value={companyProfile.gstin}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          const detectedState = getStateFromGSTIN(val);
                          setCompanyProfile({
                            ...companyProfile,
                            gstin: val,
                            state: detectedState || companyProfile.state
                          });
                        }}
                        className="w-full font-mono uppercase border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                        placeholder="29AAAAA9999A1Z5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Home State (Auto-detected from GSTIN) *</label>
                      <select
                        value={companyProfile.state}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, state: e.target.value })}
                        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      >
                        {Object.entries(INDIAN_STATES).map(([code, sName]) => (
                          <option key={code} value={sName}>({code}) {sName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">CIN / LLPIN (For Companies / LLPs)</label>
                      <input
                        type="text"
                        value={companyProfile.cinLlpin}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, cinLlpin: e.target.value.toUpperCase() })}
                        className="w-full font-mono uppercase border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                        placeholder="e.g. U72900KA2024PTC123456"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Registered Address */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b pb-1">2. Registered Address</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={companyProfile.registeredAddress.street}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, registeredAddress: { ...companyProfile.registeredAddress, street: e.target.value } })}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      placeholder="Building, Street, Landmark"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">City</label>
                      <input
                        type="text"
                        value={companyProfile.registeredAddress.city}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, registeredAddress: { ...companyProfile.registeredAddress, city: e.target.value } })}
                        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">State</label>
                      <input
                        type="text"
                        value={companyProfile.registeredAddress.state}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, registeredAddress: { ...companyProfile.registeredAddress, state: e.target.value } })}
                        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">PIN Code (6 digits)</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={companyProfile.registeredAddress.pinCode}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, registeredAddress: { ...companyProfile.registeredAddress, pinCode: e.target.value } })}
                        className="w-full font-mono border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Bank & UPI Configuration */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b pb-1">3. Bank Account & Dynamic UPI QR Code</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Account Holder Name</label>
                      <input
                        type="text"
                        value={companyProfile.bankDetails.accountName}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, bankDetails: { ...companyProfile.bankDetails, accountName: e.target.value } })}
                        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={companyProfile.bankDetails.bankName}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, bankDetails: { ...companyProfile.bankDetails, bankName: e.target.value } })}
                        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={companyProfile.bankDetails.accountNumber}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, bankDetails: { ...companyProfile.bankDetails, accountNumber: e.target.value } })}
                        className="w-full font-mono border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">IFSC Code (AAAA0999999)</label>
                      <input
                        type="text"
                        maxLength={11}
                        value={companyProfile.bankDetails.ifscCode}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, bankDetails: { ...companyProfile.bankDetails, ifscCode: e.target.value.toUpperCase() } })}
                        className="w-full font-mono uppercase border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">UPI ID (For Invoice QR Code)</label>
                      <input
                        type="text"
                        value={companyProfile.bankDetails.upiId}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, bankDetails: { ...companyProfile.bankDetails, upiId: e.target.value } })}
                        className="w-full font-mono border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                        placeholder="e.g. business@hdfcbank"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Numbering Series Config */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b pb-1">4. Document Numbering Configuration (Per Financial Year)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Invoice Prefix</label>
                      <input
                        type="text"
                        value={companyProfile.numberingConfig.invoicePrefix}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, numberingConfig: { ...companyProfile.numberingConfig, invoicePrefix: e.target.value } })}
                        className="w-full font-mono border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Quotation Prefix</label>
                      <input
                        type="text"
                        value={companyProfile.numberingConfig.quotePrefix}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, numberingConfig: { ...companyProfile.numberingConfig, quotePrefix: e.target.value } })}
                        className="w-full font-mono border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCompanyProfileOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md">Save Company Profile</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 2: ADD CLIENT MASTER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAddClientOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddClientOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative z-10 p-6 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white flex items-center gap-2">
                  <Users size={20} className="text-blue-600" /> Add Customer / Client Master
                </h3>
                <button onClick={() => setIsAddClientOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveClient} className="space-y-4 text-sm overflow-y-auto flex-1 p-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Customer / Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Enterprises Pvt Ltd"
                      value={clientNameInput}
                      onChange={(e) => setClientNameInput(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">GST Treatment *</label>
                    <select
                      value={clientGstTreatment}
                      onChange={(e) => setClientGstTreatment(e.target.value as any)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Registered Business (B2B)">Registered Business (B2B)</option>
                      <option value="Unregistered Business (B2C)">Unregistered Business (B2C)</option>
                      <option value="Consumer">Consumer</option>
                      <option value="Overseas (Export/SEZ)">Overseas (Export / SEZ)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">GSTIN {clientGstTreatment === "Registered Business (B2B)" && "*"}</label>
                    <input
                      type="text"
                      required={clientGstTreatment === "Registered Business (B2B)"}
                      maxLength={15}
                      placeholder="e.g. 29AAAAA9999A1Z5"
                      value={clientGstinInput}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        const st = getStateFromGSTIN(val);
                        setClientGstinInput(val);
                        if (st) setClientStateInput(st);
                      }}
                      className="w-full font-mono uppercase border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Place of Supply (State) *</label>
                    <select
                      value={clientStateInput}
                      onChange={(e) => setClientStateInput(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      {Object.entries(INDIAN_STATES).map(([code, sName]) => (
                        <option key={code} value={sName}>({code}) {sName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="Building, Road, Industrial Area"
                    value={clientStreetInput}
                    onChange={(e) => setClientStreetInput(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input
                      type="text"
                      value={clientCityInput}
                      onChange={(e) => setClientCityInput(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={clientPinInput}
                      onChange={(e) => setClientPinInput(e.target.value)}
                      className="w-full font-mono border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={clientContactName}
                      onChange={(e) => setClientContactName(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={clientEmailInput}
                      onChange={(e) => setClientEmailInput(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={clientPhoneInput}
                      onChange={(e) => setClientPhoneInput(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddClientOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm">Save Client</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 3: ADD ITEM MASTER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAddItemOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddItemOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6">
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white flex items-center gap-2">
                  <Package size={20} className="text-emerald-600" /> Add Product / Service Master
                </h3>
                <button onClick={() => setIsAddItemOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Item / Service Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Secretarial Audit"
                    value={itemNameInput}
                    onChange={(e) => setItemNameInput(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select
                      value={itemTypeInput}
                      onChange={(e) => setItemTypeInput(e.target.value as any)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Service">Service</option>
                      <option value="Goods">Goods</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">HSN / SAC Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9982"
                      value={itemHsnInput}
                      onChange={(e) => setItemHsnInput(e.target.value)}
                      className="w-full font-mono border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Selling Rate (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="15000"
                      value={itemRateInput}
                      onChange={(e) => setItemRateInput(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                    <input
                      type="text"
                      placeholder="Service / Units"
                      value={itemUnitInput}
                      onChange={(e) => setItemUnitInput(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">GST Rate (%)</label>
                    <select
                      value={itemGstInput}
                      onChange={(e) => setItemGstInput(Number(e.target.value))}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value={0}>0% (Exempt)</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddItemOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm">Save Item</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 4: CREATE QUOTATION / ESTIMATE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isCreateQuoteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateQuoteOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/40">
                <div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-white flex items-center gap-2">
                    <FileEdit size={20} className="text-emerald-600" /> Create Quotation / Estimate
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Quote #{companyProfile.numberingConfig.quotePrefix}{companyProfile.numberingConfig.quoteNext}</p>
                </div>
                <button onClick={() => setIsCreateQuoteOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <form onSubmit={handleCreateQuotation} className="p-6 space-y-5 text-sm overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Customer *</label>
                    <select
                      value={quoteClientId}
                      onChange={(e) => setQuoteClientId(Number(e.target.value))}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 font-medium text-gray-800 dark:text-white outline-none"
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.placeOfSupply})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Validity (Expiry Days)</label>
                    <div className="flex gap-2">
                      {[15, 30, 60].map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setQuoteValidDays(d)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${quoteValidDays === d ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                        >
                          +{d} Days
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Items in Quotation */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">Quote Line Items</h4>
                    <button
                      type="button"
                      onClick={() => setQuoteItems([...quoteItems, { id: Date.now(), itemId: itemsCatalog[0]?.id || 1, description: itemsCatalog[0]?.name || "", hsnSac: itemsCatalog[0]?.hsnSac || "9982", quantity: 1, rate: itemsCatalog[0]?.rate || 10000, discount: 0, gstRate: itemsCatalog[0]?.gstRate || 18 }])}
                      className="text-xs font-semibold text-emerald-600 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Line Item
                    </button>
                  </div>

                  {quoteItems.map((it, idx) => (
                    <div key={it.id || idx} className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl space-y-2 border border-gray-100 dark:border-zinc-800">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Description"
                            value={it.description}
                            onChange={(e) => {
                              const updated = [...quoteItems];
                              updated[idx].description = e.target.value;
                              setQuoteItems(updated);
                            }}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white dark:bg-zinc-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="HSN/SAC"
                            value={it.hsnSac}
                            onChange={(e) => {
                              const updated = [...quoteItems];
                              updated[idx].hsnSac = e.target.value;
                              setQuoteItems(updated);
                            }}
                            className="w-full text-xs font-mono border border-gray-300 rounded px-2 py-1.5 bg-white dark:bg-zinc-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={it.quantity}
                            onChange={(e) => {
                              const updated = [...quoteItems];
                              updated[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
                              setQuoteItems(updated);
                            }}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white dark:bg-zinc-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Rate (₹)"
                            value={it.rate}
                            onChange={(e) => {
                              const updated = [...quoteItems];
                              updated[idx].rate = parseFloat(e.target.value) || 0;
                              setQuoteItems(updated);
                            }}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white dark:bg-zinc-800"
                          />
                        </div>
                        <div className="col-span-1 text-center">
                          <button
                            type="button"
                            onClick={() => setQuoteItems(quoteItems.filter((_, i) => i !== idx))}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateQuoteOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">Generate Quotation</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 5: CREATE TAX INVOICE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {false && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateInvoiceOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/40">
                <div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-white flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" /> Generate GST Tax Invoice
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Invoice #{companyProfile.numberingConfig.invoicePrefix}{companyProfile.numberingConfig.invoiceNext}</p>
                </div>
                <button onClick={() => setIsCreateInvoiceOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <form onSubmit={handleCreateTaxInvoice} className="p-6 space-y-5 text-sm overflow-y-auto flex-1">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Customer *</label>
                    <select
                      value={invoiceClientId}
                      onChange={(e) => setInvoiceClientId(Number(e.target.value))}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 font-medium text-gray-800 dark:text-white outline-none"
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.placeOfSupply})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment Terms</label>
                    <select
                      value={invoiceTerms}
                      onChange={(e) => setInvoiceTerms(e.target.value as any)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Due on Receipt">Due on Receipt</option>
                      <option value="Net 15">Net 15 Days</option>
                      <option value="Net 30">Net 30 Days</option>
                      <option value="Net 45">Net 45 Days</option>
                      <option value="Net 60">Net 60 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Client PO Reference #</label>
                    <input
                      type="text"
                      placeholder="e.g. PO-2026-99"
                      value={invoicePoNumber}
                      onChange={(e) => setInvoicePoNumber(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {/* Supply Type & Reverse Charge */}
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-white">Auto Tax Detection: </span>
                    <span className="font-semibold text-blue-600">
                      {isInterStateSupply(clients.find(c => c.id === invoiceClientId)?.placeOfSupply || "", companyProfile.state)
                        ? "Inter-State Supply (IGST Applicable)"
                        : "Intra-State Supply (CGST + SGST Split 50/50)"}
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invoiceReverseCharge}
                      onChange={(e) => setInvoiceReverseCharge(e.target.checked)}
                      className="rounded"
                    />
                    Reverse Charge (RCM)?
                  </label>
                </div>

                {/* Line Items */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">Invoice Items</h4>
                    <button
                      type="button"
                      onClick={() => setInvoiceItems([...invoiceItems, { id: Date.now(), itemId: itemsCatalog[0]?.id || 1, description: itemsCatalog[0]?.name || "", hsnSac: itemsCatalog[0]?.hsnSac || "9982", quantity: 1, price: itemsCatalog[0]?.rate || 10000, discount: 0, gstRate: itemsCatalog[0]?.gstRate || 18 }])}
                      className="text-xs font-semibold text-blue-600 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Line Item
                    </button>
                  </div>

                  {invoiceItems.map((it, idx) => (
                    <div key={it.id || idx} className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl space-y-2 border border-gray-100 dark:border-zinc-800">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Description"
                            value={it.description}
                            onChange={(e) => {
                              const updated = [...invoiceItems];
                              updated[idx].description = e.target.value;
                              setInvoiceItems(updated);
                            }}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white dark:bg-zinc-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="HSN/SAC"
                            value={it.hsnSac}
                            onChange={(e) => {
                              const updated = [...invoiceItems];
                              updated[idx].hsnSac = e.target.value;
                              setInvoiceItems(updated);
                            }}
                            className="w-full text-xs font-mono border border-gray-300 rounded px-2 py-1.5 bg-white dark:bg-zinc-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={it.quantity}
                            onChange={(e) => {
                              const updated = [...invoiceItems];
                              updated[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
                              setInvoiceItems(updated);
                            }}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white dark:bg-zinc-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Price (₹)"
                            value={it.price}
                            onChange={(e) => {
                              const updated = [...invoiceItems];
                              updated[idx].price = parseFloat(e.target.value) || 0;
                              setInvoiceItems(updated);
                            }}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white dark:bg-zinc-800"
                          />
                        </div>
                        <div className="col-span-1 text-center">
                          <button
                            type="button"
                            onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx))}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateInvoiceOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md">Create GST Invoice</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 6: CREATE CREDIT / DEBIT NOTE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAddNoteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddNoteOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6">
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white flex items-center gap-2">
                  <Receipt size={20} className="text-indigo-600" /> Issue Credit / Debit Note
                </h3>
                <button onClick={() => setIsAddNoteOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveNote} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Note Type *</label>
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value as any)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Credit Note">Credit Note</option>
                      <option value="Debit Note">Debit Note</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Client *</label>
                    <select
                      value={noteClientId}
                      onChange={(e) => setNoteClientId(Number(e.target.value))}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Original Invoice Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. INV/26-27/100"
                      value={noteOrigInv}
                      onChange={(e) => setNoteOrigInv(e.target.value)}
                      className="w-full font-mono border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Original Invoice Date</label>
                    <input
                      type="date"
                      value={noteOrigDate}
                      onChange={(e) => setNoteOrigDate(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Reason for Note</label>
                    <select
                      value={noteReason}
                      onChange={(e) => setNoteReason(e.target.value as any)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Sales Return">Sales Return</option>
                      <option value="Post-sale Discount">Post-sale Discount</option>
                      <option value="Deficiency in Services">Deficiency in Services</option>
                      <option value="Correction in Invoice">Correction in Invoice</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Taxable Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5000"
                      value={noteAmount}
                      onChange={(e) => setNoteAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddNoteOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm">Issue Note</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MODAL 7: RECORD PURCHASE BILL */}
        {/* ───────────────────────────────────────────────────────────── */}
        {false && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddPurchaseOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="text-emerald-600" size={20} /> Record Purchase Bill
                </h3>
                <button onClick={() => setIsAddPurchaseOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePurchase} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Vendor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Hardware Ltd"
                    value={purchaseVendor}
                    onChange={(e) => setPurchaseVendor(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Bill Number</label>
                    <input
                      type="text"
                      placeholder="e.g. PUR-2024-004"
                      value={purchaseBillNo}
                      onChange={(e) => setPurchaseBillNo(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={purchaseCategory}
                      onChange={(e) => setPurchaseCategory(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Hardware & Equipment">Hardware & Equipment</option>
                      <option value="Cloud & Servers">Cloud & Servers</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Professional Fees">Professional Fees</option>
                      <option value="Raw Materials">Raw Materials</option>
                      <option value="Logistics & Shipping">Logistics & Shipping</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Bill Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 25000"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">GST Paid / ITC (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500 (Optional)"
                      value={purchaseGst}
                      onChange={(e) => setPurchaseGst(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Bill Date</label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment Status</label>
                    <select
                      value={purchaseStatus}
                      onChange={(e) => setPurchaseStatus(e.target.value as any)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddPurchaseOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm">Save Purchase Bill</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MODAL 8: ADD BUSINESS EXPENSE */}
        {/* ───────────────────────────────────────────────────────────── */}
        {false && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddExpenseOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <DollarSign className="text-blue-600" size={20} /> Add Business Expense
                </h3>
                <button onClick={() => setIsAddExpenseOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveExpense} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Expense Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Office Rent or Team Lunch"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="Rent & Facilities">Rent & Facilities</option>
                      <option value="Utilities & Internet">Utilities & Internet</option>
                      <option value="Meals & Entertainment">Meals & Entertainment</option>
                      <option value="Software & Subscriptions">Software & Subscriptions</option>
                      <option value="Marketing & Ads">Marketing & Ads</option>
                      <option value="Travel & Commute">Travel & Commute</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 3500"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment Date</label>
                    <input
                      type="date"
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment Mode</label>
                    <select
                      value={expenseMode}
                      onChange={(e) => setExpenseMode(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddExpenseOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm">Record Expense</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MODAL 9: RECORD PAYMENT TRANSACTION */}
        {/* ───────────────────────────────────────────────────────────── */}
        {false && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddPaymentOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Wallet className="text-indigo-600" size={20} /> Record Cash Flow Transaction
                </h3>
                <button onClick={() => setIsAddPaymentOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePayment} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Transaction Type *</label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as any)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none font-bold"
                    >
                      <option value="Inflow">Inflow (+ Collection/Income)</option>
                      <option value="Outflow">Outflow (- Disbursement/Expense)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50000"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Transaction Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Client Invoice Settlement"
                    value={paymentTitle}
                    onChange={(e) => setPaymentTitle(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Counterparty (Client / Vendor)</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Enterprises India"
                    value={paymentParty}
                    onChange={(e) => setPaymentParty(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    >
                      <option value="UPI">UPI</option>
                      <option value="NEFT/RTGS">NEFT / RTGS</option>
                      <option value="IMPS">IMPS</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Reference / UTR Number</label>
                    <input
                      type="text"
                      placeholder="e.g. UTR92847291"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
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

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddPaymentOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm">Save Transaction</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MODAL 10: ADD EMPLOYEE TO PAYROLL */}
        {/* ───────────────────────────────────────────────────────────── */}
        {false && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddEmpOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Users className="text-blue-600" size={20} /> Add Employee to Payroll
                </h3>
                <button onClick={() => setIsAddEmpOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEmployee} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Employee Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohit Verma"
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Designation / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Accounts Manager"
                      value={empRole}
                      onChange={(e) => setEmpRole(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Basic Salary (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 40000"
                      value={empBasic}
                      onChange={(e) => setEmpBasic(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">HRA (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 8000"
                      value={empHra}
                      onChange={(e) => setEmpHra(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Deductions (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2400 (PF/PT)"
                      value={empDeductions}
                      onChange={(e) => setEmpDeductions(e.target.value ? parseFloat(e.target.value) : "")}
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex justify-between items-center text-xs">
                  <span className="font-semibold text-blue-800 dark:text-blue-300">Estimated Net Salary:</span>
                  <span className="font-bold text-sm text-blue-900 dark:text-blue-200">
                    ₹{((Number(empBasic) || 0) + (Number(empHra) || 0) - (Number(empDeductions) || 0)).toFixed(2)}
                  </span>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddEmpOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm">Save Employee</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MODAL 11: UPLOAD DOCUMENT */}
        {/* ───────────────────────────────────────────────────────────── */}
        {false && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddDocOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Upload className="text-blue-600" size={20} /> Upload & Store Document
                </h3>
                <button onClick={() => setIsAddDocOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveDoc} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Document Title / Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GSTR-3B Acknowledgement Oct 2026"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 text-gray-800 dark:text-white outline-none"
                  >
                    <option value="Tax Filings">Tax Filings (GST, TDS, ITR)</option>
                    <option value="Registrations">Registrations (COI, PAN, MSME)</option>
                    <option value="Legal & Licenses">Legal & Licenses (FSSAI, Trade, TM)</option>
                    <option value="Financial Statements">Financial Statements & Balance Sheet</option>
                    <option value="Audit Reports">Audit Reports</option>
                    <option value="Invoices & Vouchers">Invoices & Vouchers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Select File (PDF, DOCX, PNG, JPG)</label>
                  <input
                    type="file"
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddDocOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm">Upload & Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* HIDDEN PRINTABLE GST TAX INVOICE TEMPLATE (PDF EXPORT) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {previewInvoice && (
        <div className="fixed left-[-9999px] top-[-9999px]">
          <div ref={invoicePdfRef} className="w-[595px] min-h-[842px] bg-white text-black p-8 font-sans space-y-5 text-xs">
            {/* Header */}
            <div className="border-b-2 border-black pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-gray-900 uppercase">{companyProfile.legalName}</h1>
                <p className="font-semibold text-gray-700">{companyProfile.tradeName}</p>
                <p className="text-[11px] text-gray-600 mt-1 max-w-[280px]">
                  {companyProfile.registeredAddress.street}, {companyProfile.registeredAddress.city}, {companyProfile.registeredAddress.state} - {companyProfile.registeredAddress.pinCode}
                </p>
                <p className="font-mono text-[11px] mt-1"><strong>GSTIN:</strong> {companyProfile.gstin}</p>
                <p className="font-mono text-[11px]"><strong>PAN:</strong> {companyProfile.pan} • <strong>CIN:</strong> {companyProfile.cinLlpin}</p>
              </div>

              <div className="text-right">
                <span className="text-lg font-extrabold text-blue-700 uppercase tracking-wider">TAX INVOICE</span>
                <p className="font-mono font-bold text-sm mt-1">#{previewInvoice.invoiceNumber}</p>
                <p className="text-gray-500 mt-0.5">Date: {previewInvoice.invoiceDate}</p>
                <p className="text-gray-500">Due Date: {previewInvoice.dueDate}</p>
                {previewInvoice.poNumber && <p className="text-gray-500 font-mono mt-0.5">PO Ref: {previewInvoice.poNumber}</p>}
              </div>
            </div>

            {/* Billed To & Place of Supply */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border border-gray-200">
              <div>
                <span className="text-gray-500 font-bold uppercase text-[10px]">Details of Receiver (Billed To)</span>
                <p className="font-bold text-sm text-gray-900 mt-0.5">{previewInvoice.customer}</p>
                <p className="text-gray-600 mt-0.5">{previewInvoice.billingAddress}</p>
                <p className="font-mono mt-1"><strong>GSTIN:</strong> {previewInvoice.clientGstin || "Unregistered (B2C)"}</p>
              </div>

              <div className="text-right">
                <span className="text-gray-500 font-bold uppercase text-[10px]">Tax & Regulatory Data</span>
                <p className="mt-1"><strong>Place of Supply:</strong> {previewInvoice.placeOfSupply}</p>
                <p><strong>Supply Type:</strong> {previewInvoice.supplyType}</p>
                <p><strong>Reverse Charge:</strong> {previewInvoice.reverseCharge ? "Applicable" : "No"}</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left border border-black border-collapse text-[11px]">
              <thead className="bg-gray-100 font-bold border-b border-black">
                <tr>
                  <th className="p-2 border-r border-black">#</th>
                  <th className="p-2 border-r border-black">Item Description</th>
                  <th className="p-2 border-r border-black">HSN/SAC</th>
                  <th className="p-2 border-r border-black text-center">Qty</th>
                  <th className="p-2 border-r border-black text-right">Rate (₹)</th>
                  <th className="p-2 border-r border-black text-right">Taxable</th>
                  <th className="p-2 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {previewInvoice.items.map((it, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="p-2 border-r border-black">{idx + 1}</td>
                    <td className="p-2 border-r border-black font-medium">{it.description}</td>
                    <td className="p-2 border-r border-black font-mono">{it.hsnSac}</td>
                    <td className="p-2 border-r border-black text-center">{it.quantity}</td>
                    <td className="p-2 border-r border-black text-right">₹{it.price.toFixed(2)}</td>
                    <td className="p-2 border-r border-black text-right">₹{it.taxableAmount.toFixed(2)}</td>
                    <td className="p-2 text-right font-bold">₹{it.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* HSN / SAC Summary Table */}
            <div>
              <span className="font-bold text-[10px] uppercase text-gray-600">HSN / SAC Tax Breakdown (Mandatory under GST)</span>
              <table className="w-full text-left border border-gray-400 border-collapse text-[10px] mt-1">
                <thead className="bg-gray-100 font-semibold border-b border-gray-400">
                  <tr>
                    <th className="p-1 border-r border-gray-400">HSN/SAC</th>
                    <th className="p-1 border-r border-gray-400 text-right">Taxable (₹)</th>
                    {previewInvoice.supplyType.includes("Intra") ? (
                      <>
                        <th className="p-1 border-r border-gray-400 text-right">CGST</th>
                        <th className="p-1 border-r border-gray-400 text-right">SGST</th>
                      </>
                    ) : (
                      <th className="p-1 border-r border-gray-400 text-right">IGST</th>
                    )}
                    <th className="p-1 text-right">Total Tax (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {getHsnSummary(previewInvoice.items, !previewInvoice.supplyType.includes("Intra")).map((h, i) => (
                    <tr key={i} className="border-b border-gray-200">
                      <td className="p-1 border-r border-gray-400 font-mono">{h.hsn}</td>
                      <td className="p-1 border-r border-gray-400 text-right">₹{h.taxable.toFixed(2)}</td>
                      {previewInvoice.supplyType.includes("Intra") ? (
                        <>
                          <td className="p-1 border-r border-gray-400 text-right">₹{h.cgst.toFixed(2)}</td>
                          <td className="p-1 border-r border-gray-400 text-right">₹{h.sgst.toFixed(2)}</td>
                        </>
                      ) : (
                        <td className="p-1 border-r border-gray-400 text-right">₹{h.igst.toFixed(2)}</td>
                      )}
                      <td className="p-1 text-right font-bold">₹{h.totalTax.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Dynamic UPI QR Section */}
            <div className="flex justify-between items-start pt-2 border-t border-black">
              {/* Bank Details & QR */}
              <div className="flex gap-3 items-center">
                {companyProfile.bankDetails.upiId && (
                  <div className="p-2 border border-black rounded text-center">
                    <img
                      src={getUpiQrUrl(companyProfile.bankDetails.upiId, companyProfile.legalName, previewInvoice.amount, previewInvoice.invoiceNumber) || ""}
                      alt="UPI QR"
                      className="w-20 h-20 mx-auto"
                    />
                    <span className="text-[9px] font-bold block mt-1">Scan & Pay via UPI</span>
                  </div>
                )}
                <div className="text-[10px] space-y-0.5">
                  <span className="font-bold uppercase text-gray-500">Bank Settlement Details</span>
                  <p><strong>A/C Name:</strong> {companyProfile.bankDetails.accountName}</p>
                  <p><strong>Bank:</strong> {companyProfile.bankDetails.bankName}</p>
                  <p><strong>A/C No:</strong> {companyProfile.bankDetails.accountNumber}</p>
                  <p><strong>IFSC:</strong> {companyProfile.bankDetails.ifscCode}</p>
                  <p><strong>UPI ID:</strong> {companyProfile.bankDetails.upiId}</p>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="w-56 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Taxable Subtotal:</span>
                  <span>₹{previewInvoice.subtotal.toFixed(2)}</span>
                </div>
                {previewInvoice.supplyType.includes("Intra") ? (
                  <>
                    <div className="flex justify-between text-gray-600">
                      <span>CGST (Central Tax):</span>
                      <span>₹{previewInvoice.cgstTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>SGST (State Tax):</span>
                      <span>₹{previewInvoice.sgstTotal.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-gray-600">
                    <span>IGST (Integrated Tax):</span>
                    <span>₹{previewInvoice.igstTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm border-t-2 border-black pt-1 mt-1">
                  <span>Grand Total (INR):</span>
                  <span>₹{previewInvoice.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Terms & Signatory */}
            <div className="flex justify-between items-end pt-4 border-t border-gray-300 text-[10px]">
              <div className="max-w-[320px] whitespace-pre-line text-gray-500">
                <strong>Terms & Conditions:</strong><br />
                {previewInvoice.terms || companyProfile.defaultTerms}
              </div>
              <div className="text-right">
                <p className="font-bold uppercase text-gray-900">{companyProfile.legalName}</p>
                <div className="h-10"></div>
                <p className="border-t border-black pt-1 inline-block min-w-[140px] text-center font-semibold">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
