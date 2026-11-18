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
  Compass
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
  const [isCompanyProfileOpen, setIsCompanyProfileOpen] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceRecord | null>(null);

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
  const defaultClients: ClientRecord[] = [
    {
      id: 1,
      name: "Acme Enterprises India Pvt Ltd",
      gstTreatment: "Registered Business (B2B)",
      gstin: "29AABCA1234F1Z5",
      placeOfSupply: "Karnataka",
      billingAddress: { street: "Plot 42, Electronic City Phase 1", city: "Bengaluru", state: "Karnataka", pinCode: "560100" },
      shippingAddress: { street: "Plot 42, Electronic City Phase 1", city: "Bengaluru", state: "Karnataka", pinCode: "560100" },
      contact: { name: "Ramesh Gupta", email: "finance@acmeindia.com", phone: "+91 98765 43210" }
    },
    {
      id: 2,
      name: "Nexus Global Technologies LLP",
      gstTreatment: "Registered Business (B2B)",
      gstin: "27AAACN9876K1Z9",
      placeOfSupply: "Maharashtra",
      billingAddress: { street: "Mindspace Cyber City, Malad West", city: "Mumbai", state: "Maharashtra", pinCode: "400064" },
      shippingAddress: { street: "Mindspace Cyber City, Malad West", city: "Mumbai", state: "Maharashtra", pinCode: "400064" },
      contact: { name: "Ananya Deshmukh", email: "accounts@nexusglobal.com", phone: "+91 98220 11223" }
    },
    {
      id: 3,
      name: "Summit Retail Ventures",
      gstTreatment: "Unregistered Business (B2C)",
      placeOfSupply: "Delhi",
      billingAddress: { street: "14 Connaught Place, Block C", city: "New Delhi", state: "Delhi", pinCode: "110001" },
      shippingAddress: { street: "14 Connaught Place, Block C", city: "New Delhi", state: "Delhi", pinCode: "110001" },
      contact: { name: "Vikram Malhotra", email: "vikram@summitretail.in", phone: "+91 98110 55443" }
    }
  ];

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
  const defaultItems: ItemRecord[] = [
    { id: 1, name: "Corporate Tax Advisory & Annual Filing", type: "Service", hsnSac: "998231", unit: "Service", rate: 25000, gstRate: 18, description: "Monthly corporate direct & indirect tax advisory" },
    { id: 2, name: "GST Compliance & Return Preparation", type: "Service", hsnSac: "998232", unit: "Month", rate: 12500, gstRate: 18, description: "GSTR-1, GSTR-3B monthly reconciliation & filing" },
    { id: 3, name: "Custom ERP & Billing Platform License", type: "Service", hsnSac: "998314", unit: "Annual", rate: 45000, gstRate: 18, description: "Cloud-hosted multi-tenant billing license" },
    { id: 4, name: "Smart POS Invoicing Terminal", type: "Goods", hsnSac: "8471", unit: "Units", rate: 16500, gstRate: 18, description: "Hardware thermal printer billing device" },
    { id: 5, name: "Financial Audit & Secretarial Review", type: "Service", hsnSac: "998222", unit: "Audit", rate: 35000, gstRate: 18, description: "Comprehensive statutory audit report" }
  ];

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
  const defaultQuotations: QuotationRecord[] = [
    {
      id: 1,
      quoteNumber: "QT/26-27/098",
      clientId: 1,
      clientName: "Acme Enterprises India Pvt Ltd",
      clientGstin: "29AABCA1234F1Z5",
      placeOfSupply: "Karnataka",
      billingAddress: "Plot 42, Electronic City Phase 1, Bengaluru 560100",
      quoteDate: "2026-11-05",
      validUntil: "2026-12-05",
      items: [
        {
          id: 1,
          description: "Corporate Tax Advisory & Annual Filing",
          hsnSac: "998231",
          quantity: 1,
          rate: 25000,
          discount: 1000,
          gstRate: 18,
          taxableAmount: 24000,
          cgstAmount: 2160,
          sgstAmount: 2160,
          igstAmount: 0,
          totalAmount: 28320
        }
      ],
      subtotal: 25000,
      totalDiscount: 1000,
      cgstTotal: 2160,
      sgstTotal: 2160,
      igstTotal: 0,
      taxTotal: 4320,
      grandTotal: 28320,
      terms: "Quotation valid for 30 calendar days from issue date.",
      status: "Accepted"
    }
  ];

  const [quotations, setQuotations] = useState<QuotationRecord[]>(defaultQuotations);
  const [isCreateQuoteOpen, setIsCreateQuoteOpen] = useState(false);
  const [quoteClientId, setQuoteClientId] = useState<number>(1);
  const [quoteValidDays, setQuoteValidDays] = useState<number>(30);
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, itemId: 1, description: "Corporate Tax Advisory & Annual Filing", hsnSac: "998231", quantity: 1, rate: 25000, discount: 0, gstRate: 18 }
  ]);
  const [quoteTerms, setQuoteTerms] = useState("Standard payment terms: 50% advance, balance on delivery.");

  // --- Invoices (Tax Invoices) State ---
  const defaultInvoices: InvoiceRecord[] = [
    {
      id: 1,
      invoiceNumber: "INV/26-27/100",
      clientId: 1,
      customer: "Acme Enterprises India Pvt Ltd",
      clientGstin: "29AABCA1234F1Z5",
      gstTreatment: "Registered Business (B2B)",
      placeOfSupply: "Karnataka",
      billingAddress: "Plot 42, Electronic City Phase 1, Bengaluru 560100",
      invoiceDate: "2026-11-12",
      paymentTerms: "Net 30",
      dueDate: "2026-12-12",
      poNumber: "PO-ACME-8891",
      reverseCharge: false,
      supplyType: "Intra-State (CGST + SGST)",
      items: [
        {
          id: 1,
          description: "Corporate Tax Advisory & Annual Filing",
          hsnSac: "998231",
          quantity: 1,
          price: 25000,
          discount: 0,
          gstRate: 18,
          taxableAmount: 25000,
          cgstAmount: 2250,
          sgstAmount: 2250,
          igstAmount: 0,
          total: 29500
        }
      ],
      subtotal: 25000,
      totalDiscount: 0,
      cgstTotal: 2250,
      sgstTotal: 2250,
      igstTotal: 0,
      taxTotal: 4500,
      amount: 29500,
      amountPaid: 29500,
      balanceDue: 0,
      status: "Paid",
      date: "2026-11-12"
    },
    {
      id: 2,
      invoiceNumber: "INV/26-27/101",
      clientId: 2,
      customer: "Nexus Global Technologies LLP",
      clientGstin: "27AAACN9876K1Z9",
      gstTreatment: "Registered Business (B2B)",
      placeOfSupply: "Maharashtra",
      billingAddress: "Mindspace Cyber City, Malad West, Mumbai 400064",
      invoiceDate: "2026-11-15",
      paymentTerms: "Net 15",
      dueDate: "2026-11-30",
      poNumber: "PO-NX-2024-09",
      reverseCharge: false,
      supplyType: "Inter-State (IGST)",
      items: [
        {
          id: 1,
          description: "Custom ERP & Billing Platform License",
          hsnSac: "998314",
          quantity: 1,
          price: 45000,
          discount: 2000,
          gstRate: 18,
          taxableAmount: 43000,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 7740,
          total: 50740
        }
      ],
      subtotal: 45000,
      totalDiscount: 2000,
      cgstTotal: 0,
      sgstTotal: 0,
      igstTotal: 7740,
      taxTotal: 7740,
      amount: 50740,
      amountPaid: 0,
      balanceDue: 50740,
      status: "Unpaid",
      date: "2026-11-15"
    }
  ];

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
  const invoicePdfRef = useRef<HTMLDivElement>(null);

  // --- Credit & Debit Notes State ---
  const [creditDebitNotes, setCreditDebitNotes] = useState<CreditDebitNoteRecord[]>([
    {
      id: 1,
      type: "Credit Note",
      noteNumber: "CN/26-27/001",
      originalInvoiceNumber: "INV/26-27/100",
      originalInvoiceDate: "2026-11-12",
      reason: "Post-sale Discount",
      clientId: 1,
      clientName: "Acme Enterprises India Pvt Ltd",
      date: "2026-11-14",
      amount: 2000,
      taxAmount: 360,
      grandTotal: 2360,
      status: "Adjusted",
      notes: "Annual retainer volume concession"
    }
  ]);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [noteType, setNoteType] = useState<"Credit Note" | "Debit Note">("Credit Note");
  const [noteOrigInv, setNoteOrigInv] = useState("");
  const [noteOrigDate, setNoteOrigDate] = useState("");
  const [noteReason, setNoteReason] = useState<CreditDebitNoteRecord["reason"]>("Sales Return");
  const [noteClientId, setNoteClientId] = useState<number>(1);
  const [noteAmount, setNoteAmount] = useState<number | "">("");

  // --- Purchases State ---
  const [purchases, setPurchases] = useState<any[]>([
    { id: 1, billNumber: "PUR-2024-001", vendor: "Apex IT Hardware Ltd", category: "Hardware & Equipment", date: "2026-11-10", amount: 45000, gstPaid: 8100, status: "Paid" },
    { id: 2, billNumber: "PUR-2024-002", vendor: "GreenLine Office Supplies", category: "Office Supplies", date: "2026-11-14", amount: 12500, gstPaid: 2250, status: "Paid" },
    { id: 3, billNumber: "PUR-2024-003", vendor: "CloudHost Infra Technologies", category: "Cloud & Servers", date: "2026-11-16", amount: 28000, gstPaid: 5040, status: "Pending" },
  ]);
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
  const [expenses, setExpenses] = useState<any[]>([
    { id: 1, title: "Commercial Office Rent - Nov", category: "Rent & Facilities", amount: 35000, date: "2026-11-01", mode: "Bank Transfer", status: "Paid" },
    { id: 2, title: "High-speed Fiber Internet", category: "Utilities & Internet", amount: 2499, date: "2026-11-05", mode: "UPI", status: "Paid" },
    { id: 3, title: "Client Business Dinner Meeting", category: "Meals & Entertainment", amount: 4800, date: "2026-11-09", mode: "Credit Card", status: "Paid" },
    { id: 4, title: "Google Workspace & Software Tools", category: "Software & Subscriptions", amount: 8200, date: "2026-11-12", mode: "Card", status: "Paid" },
    { id: 5, title: "Digital Marketing Campaign", category: "Marketing & Ads", amount: 15000, date: "2026-11-15", mode: "UPI", status: "Paid" },
  ]);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Rent & Facilities");
  const [expenseAmount, setExpenseAmount] = useState<number | "">("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseMode, setExpenseMode] = useState("UPI");
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState("All");

  // --- Payments Tracker State ---
  const [payments, setPayments] = useState<any[]>([
    { id: 1, type: "Inflow", title: "Client Invoice Settlement", party: "Acme Enterprises India Pvt Ltd", amount: 29500, date: "2026-11-12", method: "NEFT/RTGS", ref: "UTR983471029", status: "Cleared" },
    { id: 2, type: "Outflow", title: "Cloud Server Hosting Bill", party: "CloudHost Infra", amount: 28000, date: "2026-11-16", method: "UPI", ref: "UPI88720198", status: "Cleared" },
    { id: 3, type: "Outflow", title: "Office Rent Payment", party: "Landlord Realty Inc", amount: 35000, date: "2026-11-01", method: "NEFT/RTGS", ref: "UTR658392019", status: "Cleared" },
  ]);
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
  const [employees, setEmployees] = useState<any[]>([
    { id: 1, name: "Rahul Sharma", role: "Senior Tax Consultant", basic: 55000, hra: 12000, deductions: 3500, netSalary: 63500, status: "Paid", paymentDate: "2026-11-01" },
    { id: 2, name: "Priya Nair", role: "Junior Legal Associate", basic: 32000, hra: 7000, deductions: 2100, netSalary: 36900, status: "Paid", paymentDate: "2026-11-01" }
  ]);
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
  const [documents, setDocuments] = useState<any[]>([
    { id: 1, name: "GST Registration Certificate (REG-06)", category: "Tax Filings", date: "2026-04-12", size: "1.4 MB", verified: true },
    { id: 2, name: "Certificate of Incorporation (COI)", category: "Registrations", date: "2026-03-18", size: "2.8 MB", verified: true },
    { id: 3, name: "Permanent Account Number (Company e-PAN)", category: "Registrations", date: "2026-03-20", size: "680 KB", verified: true },
    { id: 4, name: "MSME / Udyam Registration Certificate", category: "Registrations", date: "2026-05-02", size: "1.1 MB", verified: true },
    { id: 5, name: "FY2023-24 Income Tax Acknowledgement (ITR-V)", category: "Tax Filings", date: "2026-07-28", size: "950 KB", verified: true },
    { id: 6, name: "Trademark Registration Certificate (Form TM-A)", category: "Legal & Licenses", date: "2026-08-15", size: "1.9 MB", verified: true },
  ]);
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
          setClients(serverData.clientMaster || localData?.clientMaster);
        }
        if (serverData.itemMaster || localData?.itemMaster) {
          setItemsCatalog(serverData.itemMaster || localData?.itemMaster);
        }
        if (serverData.quotations || localData?.quotations) {
          setQuotations(serverData.quotations || localData?.quotations);
        }
        if (serverData.billingHistory || localData?.billingHistory) {
          setBillingHistory(serverData.billingHistory || localData?.billingHistory);
        }
        if (serverData.creditDebitNotes || localData?.creditDebitNotes) {
          setCreditDebitNotes(serverData.creditDebitNotes || localData?.creditDebitNotes);
        }
        if (serverData.purchases || localData?.purchases) {
          setPurchases(serverData.purchases || localData?.purchases);
        }
        if (serverData.expenses || localData?.expenses) {
          setExpenses(serverData.expenses || localData?.expenses);
        }
        if (serverData.payments || localData?.payments) {
          setPayments(serverData.payments || localData?.payments);
        }
        if (serverData.complianceTasks || localData?.complianceTasks) {
          setComplianceTasks(serverData.complianceTasks || localData?.complianceTasks);
        }
        if (serverData.employees || localData?.employees) {
          setEmployees(serverData.employees || localData?.employees);
        }
        if (serverData.documents || localData?.documents) {
          setDocuments(serverData.documents || localData?.documents);
        }
        return;
      }
    } catch (err) {
      console.warn("Backend data fetch error, using local fallback:", err);
    }

    if (localData) {
      if (localData.companyProfile) setCompanyProfile(prev => ({ ...prev, ...localData.companyProfile }));
      if (localData.clientMaster) setClients(localData.clientMaster);
      if (localData.itemMaster) setItemsCatalog(localData.itemMaster);
      if (localData.quotations) setQuotations(localData.quotations);
      if (localData.billingHistory) setBillingHistory(localData.billingHistory);
      if (localData.creditDebitNotes) setCreditDebitNotes(localData.creditDebitNotes);
      if (localData.purchases) setPurchases(localData.purchases);
      if (localData.expenses) setExpenses(localData.expenses);
      if (localData.payments) setPayments(localData.payments);
      if (localData.complianceTasks) setComplianceTasks(localData.complianceTasks);
      if (localData.employees) setEmployees(localData.employees);
      if (localData.documents) setDocuments(localData.documents);
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
    const client = clients.find(c => c.id === quoteClientId) || clients[0];
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
    const client = clients.find(c => c.id === invoiceClientId) || clients[0];
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
    const client = clients.find(c => c.id === noteClientId) || clients[0];
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
  const DEFAULT_SCHEDULES = [
    { id: "s1", name: "LinkedIn Engagement Monitor", sub: "LinkedIn engagement monitor", nextRun: "Tomorrow, 09:00 AM", lastRun: "Today 10:00 AM", status: "RUNNING", leads: 562, icon: Globe },
    { id: "s2", name: "Competitor Audience Tracker", sub: "Monitor competitor audiences.", nextRun: "Tomorrow, 09:00 AM", lastRun: "Today 09:00 AM", status: "ACTIVE", leads: 632, icon: Building },
    { id: "s3", name: "Buying Signals Detection", sub: "Detect buyer intent signals.", nextRun: "Tomorrow, 09:00 AM", lastRun: "Today 10:00 AM", status: "RUNNING", leads: 238, icon: TrendingUp },
    { id: "s4", name: "Funding Events Tracker", sub: "Track recent funding activities.", nextRun: "Tomorrow, 11:00 AM", lastRun: "Today 08:30 AM", status: "ACTIVE", leads: 260, icon: Compass },
    { id: "s5", name: "Website Visitor Capture", sub: "Capture website visitors.", nextRun: "Tomorrow, 02:00 PM", lastRun: "Today 11:15 AM", status: "RUNNING", leads: 360, icon: Globe },
    { id: "s6", name: "Job Change Alerts", sub: "Track career changes.", nextRun: "Tomorrow, 03:30 PM", lastRun: "Today 01:20 PM", status: "ACTIVE", leads: 580, icon: AlertCircle },
    { id: "s7", name: "High-Intent Lead Finder", sub: "Find high-intent leads.", nextRun: "Tomorrow, 09:00 AM", lastRun: "Today 10:00 AM", status: "RUNNING", leads: 250, icon: Users },
  ];

  const [mainSearchQuery, setMainSearchQuery] = useState("");

  const handleTopPrimaryAction = () => {
    switch (activeTab) {
      case "home":
        setIsCreateInvoiceOpen(true);
        break;
      case "sales":
        if (salesSubTab === "quotes") setIsCreateQuoteOpen(true);
        else if (salesSubTab === "clients") setIsAddClientOpen(true);
        else if (salesSubTab === "items") setIsAddItemOpen(true);
        else if (salesSubTab === "notes") setIsAddNoteOpen(true);
        else setIsCreateInvoiceOpen(true);
        break;
      case "purchases":
        setIsAddPurchaseOpen(true);
        break;
      case "expenses":
        setIsAddExpenseOpen(true);
        break;
      case "payments-tracker":
        setIsAddPaymentOpen(true);
        break;
      case "compliance-tracker":
        alert("Compliance tracker deadlines are maintained live by your administrator.");
        break;
      case "payroll":
        setIsAddEmpOpen(true);
        break;
      case "documents":
        setIsAddDocOpen(true);
        break;
      case "reports":
        window.print();
        break;
      default:
        setIsCreateInvoiceOpen(true);
        break;
    }
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
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Scheduled Automations</h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Create, organize, and manage your chats</p>
              </div>
              <button
                onClick={handleTopPrimaryAction}
                className="bg-black hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 uppercase tracking-wide self-start sm:self-auto transition-all"
              >
                <Plus size={14} />
                <span>+ CREATE SCHEDULED</span>
              </button>
            </div>

            {/* 4 Metric Cards Row matching Screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Active Schedules", "325", "+8.73%", "This week • Ruin AI workflow", Clock)}
              {renderKpiCard("Runs Today", "1,032", "+96.7%", "This week • Task completed", Sparkles)}
              {renderKpiCard("Leads Generate", "1,785", "+12.3%", "Last Month • Qualified prospects", Users)}
              {renderKpiCard("Next Run", "09:00 AM", "Tomorrow", "Tomorrow • LinkedIn monitor", Calendar)}
            </div>

            {/* Main Section Card matching Screenshot */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100/90 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Active Schedules</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Schedules"
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-gray-200/90 dark:border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 w-52 sm:w-60 outline-none shadow-xs focus:border-gray-400 transition-all"
                    />
                  </div>
                  <button className="p-2 border border-gray-200/90 dark:border-zinc-700 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-xs transition-colors" title="Filter">
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              {/* Table exactly as in Reference Image */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Name :</th>
                      <th className="py-3 px-3">Next Run :</th>
                      <th className="py-3 px-3">Last Run :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">Leads :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                    {DEFAULT_SCHEDULES.filter(s => s.name.toLowerCase().includes(mainSearchQuery.toLowerCase())).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-300 flex-shrink-0">
                              <item.icon size={14} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-xs">{item.name}</p>
                              <p className="text-[11px] text-gray-400 dark:text-zinc-500">{item.sub}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-gray-600 dark:text-zinc-400 font-medium">{item.nextRun}</td>
                        <td className="py-3.5 px-3 text-xs text-gray-600 dark:text-zinc-400 font-medium">{item.lastRun}</td>
                        <td className="py-3.5 px-3">{renderStatusBadge(item.status)}</td>
                        <td className="py-3.5 px-3 font-semibold text-gray-800 dark:text-zinc-200">{item.leads}</td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => alert(`Opening details for ${item.name}`)} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="Edit">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => alert(`Duplicated schedule ${item.name}`)} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="Copy">
                              <Copy size={13} />
                            </button>
                            <button onClick={() => alert(`Action removed: ${item.name}`)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-gray-400 dark:text-zinc-500 font-medium tracking-wide">
                <span>SHOVING 2 OF 120 CHATS</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:text-gray-700 dark:hover:text-zinc-300"><ChevronLeft size={14} /></button>
                  <span className="text-gray-700 dark:text-zinc-300 font-bold">2/120</span>
                  <button className="p-1 hover:text-gray-700 dark:hover:text-zinc-300"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        );

      case "sales":
      case "billing-software":
        return (
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Sales & Invoicing Pipeline</h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Create, organize, and manage your tax invoices, quotations & clients</p>
              </div>
              <button
                onClick={handleTopPrimaryAction}
                className="bg-black hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 uppercase tracking-wide self-start sm:self-auto transition-all"
              >
                <Plus size={14} />
                <span>+ {getTopActionLabel()}</span>
              </button>
            </div>

            {/* 4 Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Active Invoices", billingHistory.length || 325, "+8.73%", "This week • Realized billing", CreditCard)}
              {renderKpiCard("Gross Billed", `₹${totalSales.toFixed(2)}`, "+96.7%", "Tax Total: ₹" + totalGstOutput.toFixed(2), Sparkles)}
              {renderKpiCard("Active Clients", clients.length || 1785, "+12.3%", "Client master directory", Users)}
              {renderKpiCard("Next Filing", "20th Nov", "Tomorrow", "GSTR-1 / GSTR-3B monthly", Calendar)}
            </div>

            {/* Sales Navigation Sub-Tabs */}
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    salesSubTab === sub.id
                      ? "bg-black text-white shadow-xs"
                      : "bg-white dark:bg-zinc-900 border border-gray-200/90 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50"
                  }`}
                >
                  <sub.icon size={13} />
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Main Section Card matching Screenshot */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100/90 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                  {salesSubTab === "invoices" && "Active Sales Invoices"}
                  {salesSubTab === "quotes" && "Active Quotations & Estimates"}
                  {salesSubTab === "notes" && "Credit & Debit Notes Ledger"}
                  {salesSubTab === "clients" && "Client Master Directory"}
                  {salesSubTab === "items" && "Product & Service Catalog"}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-gray-200/90 dark:border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 w-52 sm:w-60 outline-none shadow-xs focus:border-gray-400 transition-all"
                    />
                  </div>
                  <button className="p-2 border border-gray-200/90 dark:border-zinc-700 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-xs transition-colors">
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              {salesSubTab === "invoices" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                      <tr>
                        <th className="py-3 px-3">Name :</th>
                        <th className="py-3 px-3">Party / Supply :</th>
                        <th className="py-3 px-3">Date / Terms :</th>
                        <th className="py-3 px-3">Status :</th>
                        <th className="py-3 px-3">Grand Total :</th>
                        <th className="py-3 px-3 text-right">Actions :</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                      {billingHistory.filter(i => (i.customer + i.invoiceNumber).toLowerCase().includes(mainSearchQuery.toLowerCase())).map((inv) => (
                        <tr key={inv.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                <Receipt size={14} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white text-xs">{inv.invoiceNumber}</p>
                                <p className="text-[11px] text-gray-400 dark:text-zinc-500">Tax Invoice • {inv.supplyType}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-medium text-gray-900 dark:text-zinc-200">
                            <p className="font-semibold">{inv.customer}</p>
                            <p className="text-[11px] text-gray-400 font-mono">{inv.clientGstin || "Unregistered"}</p>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-gray-600 dark:text-zinc-400">
                            <p>{inv.invoiceDate}</p>
                            <p className="text-[11px] text-gray-400">Due: {inv.dueDate}</p>
                          </td>
                          <td className="py-3.5 px-3">{renderStatusBadge(inv.status)}</td>
                          <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">₹{inv.amount.toFixed(2)}</td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleDownloadInvoicePDF(inv)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download PDF">
                                <Download size={13} />
                              </button>
                              {inv.status !== "Paid" && (
                                <button onClick={() => handleRecordInvoicePayment(inv.id)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold">
                                  Pay
                                </button>
                              )}
                              <button onClick={() => { if (confirm("Remove invoice?")) { const u = billingHistory.filter(x => x.id !== inv.id); setBillingHistory(u); saveAllData({ billingHistory: u }); } }} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {salesSubTab === "quotes" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                      <tr>
                        <th className="py-3 px-3">Name :</th>
                        <th className="py-3 px-3">Client :</th>
                        <th className="py-3 px-3">Valid Until :</th>
                        <th className="py-3 px-3">Status :</th>
                        <th className="py-3 px-3">Total :</th>
                        <th className="py-3 px-3 text-right">Actions :</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                      {quotations.map((q) => (
                        <tr key={q.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                <FileEdit size={14} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white text-xs">{q.quoteNumber}</p>
                                <p className="text-[11px] text-gray-400">POS: {q.placeOfSupply}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-gray-800 dark:text-white">{q.clientName}</td>
                          <td className="py-3.5 px-3 text-xs text-gray-600 dark:text-zinc-400">{q.validUntil}</td>
                          <td className="py-3.5 px-3">{renderStatusBadge(q.status)}</td>
                          <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">₹{q.grandTotal.toFixed(2)}</td>
                          <td className="py-3.5 px-3 text-right">
                            {q.status !== "Converted to Invoice" ? (
                              <button onClick={() => handleConvertQuoteToInvoice(q)} className="px-2.5 py-1 bg-black text-white hover:bg-zinc-800 text-[10px] font-bold rounded-lg transition-all">
                                Convert &rarr;
                              </button>
                            ) : (
                              <span className="text-[10px] text-purple-600 font-mono font-bold">{q.convertedInvoiceNumber}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {salesSubTab === "notes" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                      <tr>
                        <th className="py-3 px-3">Name :</th>
                        <th className="py-3 px-3">Original Invoice :</th>
                        <th className="py-3 px-3">Client :</th>
                        <th className="py-3 px-3">Status :</th>
                        <th className="py-3 px-3">Amount :</th>
                        <th className="py-3 px-3 text-right">Actions :</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                      {creditDebitNotes.map((note) => (
                        <tr key={note.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">{note.noteNumber} ({note.type})</td>
                          <td className="py-3.5 px-3 font-mono text-xs">{note.originalInvoiceNumber}</td>
                          <td className="py-3.5 px-3 font-semibold">{note.clientName}</td>
                          <td className="py-3.5 px-3">{renderStatusBadge(note.status)}</td>
                          <td className="py-3.5 px-3 font-bold text-rose-600">₹{note.grandTotal.toFixed(2)}</td>
                          <td className="py-3.5 px-3 text-right">
                            <button onClick={() => alert(`Note ${note.noteNumber} issued for ${note.reason}`)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
                              <Eye size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {salesSubTab === "clients" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((c) => (
                    <div key={c.id} className="bg-white dark:bg-zinc-800/80 p-4 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-xs flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">{c.gstTreatment}</span>
                          <button onClick={() => handleDeleteClient(c.id)} className="text-gray-400 hover:text-rose-500"><Trash2 size={13} /></button>
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-2">{c.name}</h3>
                        <p className="text-[11px] font-mono text-gray-500 mt-0.5">GSTIN: {c.gstin || "Unregistered"}</p>
                        <p className="text-[11px] text-gray-400">Place of Supply: <strong>{c.placeOfSupply}</strong></p>
                      </div>
                      <div className="pt-2 border-t border-gray-100 dark:border-zinc-700 text-[11px] text-gray-500">
                        <p>👤 {c.contact.name || "Contact Person"}</p>
                        <p>📧 {c.contact.email} • 📞 {c.contact.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {salesSubTab === "items" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                      <tr>
                        <th className="py-3 px-3">Name :</th>
                        <th className="py-3 px-3">Type :</th>
                        <th className="py-3 px-3">HSN/SAC :</th>
                        <th className="py-3 px-3">Unit :</th>
                        <th className="py-3 px-3">Rate (₹) :</th>
                        <th className="py-3 px-3">GST Tier :</th>
                        <th className="py-3 px-3 text-right">Actions :</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                      {itemsCatalog.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">{item.name}</td>
                          <td className="py-3.5 px-3">{item.type}</td>
                          <td className="py-3.5 px-3 font-mono font-bold">{item.hsnSac}</td>
                          <td className="py-3.5 px-3">{item.unit}</td>
                          <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">₹{item.rate.toFixed(2)}</td>
                          <td className="py-3.5 px-3 font-bold text-emerald-600">{item.gstRate}%</td>
                          <td className="py-3.5 px-3 text-right">
                            <button onClick={() => handleDeleteItem(item.id)} className="text-gray-400 hover:text-rose-500 p-1"><Trash2 size={13} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Footer */}
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-gray-400 dark:text-zinc-500 font-medium tracking-wide">
                <span>SHOWING {billingHistory.length} OF {billingHistory.length} SALES RECORDS</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:text-gray-700"><ChevronLeft size={14} /></button>
                  <span className="text-gray-700 dark:text-zinc-300 font-bold">1/1</span>
                  <button className="p-1 hover:text-gray-700"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        );

      case "purchases":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Purchase Management & ITC</h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Track vendor bills, purchase orders, and claim Input Tax Credit (ITC)</p>
              </div>
              <button
                onClick={handleTopPrimaryAction}
                className="bg-black hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 uppercase tracking-wide self-start sm:self-auto transition-all"
              >
                <Plus size={14} />
                <span>+ RECORD PURCHASE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Total Purchases", `₹${totalPurchases.toFixed(2)}`, "+8.73%", `${purchases.length} total vendor bills`, ShoppingCart)}
              {renderKpiCard("GST Input Tax Credit", `₹${totalGstItc.toFixed(2)}`, "+96.7%", "Eligible to offset outward tax liability", Sparkles)}
              {renderKpiCard("Pending Dues", `₹${purchases.filter(p=>p.status==="Pending").reduce((s,p)=>s+(p.amount||0),0).toFixed(2)}`, "+12.3%", "Bills pending clearance", Clock)}
              {renderKpiCard("Active Vendors", "3", "Monthly ITC", "Realized Input Tax", Building)}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100/90 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Vendor Inward Bills</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bills..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-gray-200/90 dark:border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                  <button className="p-2 border border-gray-200/90 dark:border-zinc-700 rounded-xl text-gray-500 hover:bg-gray-50 shadow-xs">
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Name :</th>
                      <th className="py-3 px-3">Category :</th>
                      <th className="py-3 px-3">Bill Date :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">Amount (₹) :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                    {purchases.filter(p => (p.billNumber + p.vendor).toLowerCase().includes(mainSearchQuery.toLowerCase())).map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              <ShoppingBag size={14} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-xs">{p.billNumber}</p>
                              <p className="text-[11px] text-gray-400">{p.vendor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">{p.category}</td>
                        <td className="py-3.5 px-3 text-xs text-gray-600 dark:text-zinc-400">{p.date}</td>
                        <td className="py-3.5 px-3">{renderStatusBadge(p.status)}</td>
                        <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">₹{p.amount.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleTogglePurchaseStatus(p.id)} className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-[10px] font-bold text-gray-700 dark:text-zinc-300">
                              {p.status === "Paid" ? "Mark Due" : "Mark Paid"}
                            </button>
                            <button onClick={() => handleDeletePurchase(p.id)} className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>SHOWING {purchases.length} OF {purchases.length} PURCHASES</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:text-gray-700"><ChevronLeft size={14} /></button>
                  <span className="text-gray-700 dark:text-zinc-300 font-bold">1/1</span>
                  <button className="p-1 hover:text-gray-700"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        );

      case "expenses":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Business Expense Tracker</h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Categorize operational overhead and maintain expense receipts</p>
              </div>
              <button
                onClick={handleTopPrimaryAction}
                className="bg-black hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 uppercase tracking-wide self-start sm:self-auto transition-all"
              >
                <Plus size={14} />
                <span>+ ADD EXPENSE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Total Expenses", `₹${totalExpenses.toFixed(2)}`, "+8.73%", "Operational overhead logged", DollarSign)}
              {renderKpiCard("Top Category", "Rent & Facilities", "+96.7%", "Commercial property expense", Building)}
              {renderKpiCard("Logged Records", expenses.length, "+12.3%", "Active expense receipts", Receipt)}
              {renderKpiCard("Next Due", "01st Dec", "Recurring", "Office lease commitment", Calendar)}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100/90 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Logged Expenses</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-gray-200/90 dark:border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                  <button className="p-2 border border-gray-200/90 dark:border-zinc-700 rounded-xl text-gray-500 hover:bg-gray-50 shadow-xs">
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Name :</th>
                      <th className="py-3 px-3">Category :</th>
                      <th className="py-3 px-3">Payment Date :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">Amount (₹) :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                    {expenses.filter(e => e.title.toLowerCase().includes(mainSearchQuery.toLowerCase())).map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              <DollarSign size={14} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-xs">{e.title}</p>
                              <p className="text-[11px] text-gray-400">{e.mode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">{e.category}</td>
                        <td className="py-3.5 px-3 text-xs text-gray-600 dark:text-zinc-400">{e.date}</td>
                        <td className="py-3.5 px-3">{renderStatusBadge("Paid")}</td>
                        <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">₹{e.amount.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-right">
                          <button onClick={() => handleDeleteExpense(e.id)} className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>SHOWING {expenses.length} OF {expenses.length} EXPENSES</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:text-gray-700"><ChevronLeft size={14} /></button>
                  <span className="text-gray-700 dark:text-zinc-300 font-bold">1/1</span>
                  <button className="p-1 hover:text-gray-700"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        );

      case "payments-tracker":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Payments & Cash Flow Tracker</h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Real-time ledger of inbound client collections and outbound disbursements</p>
              </div>
              <button
                onClick={handleTopPrimaryAction}
                className="bg-black hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 uppercase tracking-wide self-start sm:self-auto transition-all"
              >
                <Plus size={14} />
                <span>+ RECORD TRANSACTION</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Total Inflow (+)", `+₹${totalInflow.toFixed(2)}`, "+8.73%", "Client settlement collections", ArrowDownLeft)}
              {renderKpiCard("Total Outflow (-)", `-₹${totalOutflow.toFixed(2)}`, "+96.7%", "Vendor and overhead payments", ArrowUpRight)}
              {renderKpiCard("Net Liquidity", `₹${netCashFlow.toFixed(2)}`, "+12.3%", "Real-time cash balance", Wallet)}
              {renderKpiCard("Total Cleared", payments.length, "Cleared", "Reconciled ledger transactions", CheckCircle2)}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100/90 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Transaction Ledger</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-gray-200/90 dark:border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                  <button className="p-2 border border-gray-200/90 dark:border-zinc-700 rounded-xl text-gray-500 hover:bg-gray-50 shadow-xs">
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Name :</th>
                      <th className="py-3 px-3">Type :</th>
                      <th className="py-3 px-3">Method & Ref :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">Amount (₹) :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                    {payments.filter(p => (p.title + p.party).toLowerCase().includes(mainSearchQuery.toLowerCase())).map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${p.type === "Inflow" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                              {p.type === "Inflow" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-xs">{p.title}</p>
                              <p className="text-[11px] text-gray-400">{p.party}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.type === "Inflow" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                            {p.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-gray-600 dark:text-zinc-400">{p.method} • {p.ref}</td>
                        <td className="py-3.5 px-3">{renderStatusBadge(p.status)}</td>
                        <td className={`py-3.5 px-3 font-bold ${p.type === "Inflow" ? "text-emerald-600" : "text-rose-600"}`}>
                          {p.type === "Inflow" ? "+" : "-"}₹{p.amount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button onClick={() => handleDeletePayment(p.id)} className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>SHOWING {payments.length} OF {payments.length} TRANSACTIONS</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:text-gray-700"><ChevronLeft size={14} /></button>
                  <span className="text-gray-700 dark:text-zinc-300 font-bold">1/1</span>
                  <button className="p-1 hover:text-gray-700"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        );

      case "compliance-tracker":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Compliance tracker</h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Track all compliance tasks and deadlines updated live by your tax administrator</p>
              </div>
              <button
                onClick={handleTopPrimaryAction}
                className="bg-black hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 uppercase tracking-wide self-start sm:self-auto transition-all"
              >
                <CheckCircle size={14} />
                <span>ADMIN VERIFIED</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Active Compliances", complianceTasks.length, "+8.73%", "Statutory deadlines active", FileText)}
              {renderKpiCard("Verified Filings", "1", "+96.7%", "Approved by MCA & GSTN", CheckCircle2)}
              {renderKpiCard("Ongoing Cycles", "2", "+12.3%", "In-progress monthly returns", RefreshCw)}
              {renderKpiCard("Next Filing Due", "20th Nov", "Statutory", "GSTR-1 & GSTR-3B deadline", Calendar)}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100/90 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Statutory Deadlines & Filing Tasks</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-gray-200/90 dark:border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                  <button className="p-2 border border-gray-200/90 dark:border-zinc-700 rounded-xl text-gray-500 hover:bg-gray-50 shadow-xs">
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Name :</th>
                      <th className="py-3 px-3">Statutory Due :</th>
                      <th className="py-3 px-3">Authority :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">Verification :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                    {complianceTasks.filter(t => t.title.toLowerCase().includes(mainSearchQuery.toLowerCase())).map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              <FileCheck2 size={14} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-xs">{task.title}</p>
                              <p className="text-[11px] text-gray-400">Task Code: {task.id.toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-gray-800 dark:text-white">{task.due}</td>
                        <td className="py-3.5 px-3 text-gray-500">{task.id === "gst" ? "GSTN / CBIC" : task.id === "roc" ? "MCA (Govt of India)" : "Income Tax Dept"}</td>
                        <td className="py-3.5 px-3">{renderStatusBadge(task.status)}</td>
                        <td className="py-3.5 px-3">
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <Check size={12} /> Admin Synced
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button onClick={() => alert(`Filing task ${task.title} is verified.`)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
                            <Eye size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>SHOWING {complianceTasks.length} OF {complianceTasks.length} COMPLIANCE TASKS</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:text-gray-700"><ChevronLeft size={14} /></button>
                  <span className="text-gray-700 dark:text-zinc-300 font-bold">1/1</span>
                  <button className="p-1 hover:text-gray-700"><ChevronRight size={14} /></button>
                </div>
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Employee Payroll Management</h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Manage employee salaries, allowances, deductions, and generate monthly payslips</p>
              </div>
              <button
                onClick={handleTopPrimaryAction}
                className="bg-black hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 uppercase tracking-wide self-start sm:self-auto transition-all"
              >
                <Plus size={14} />
                <span>+ ADD EMPLOYEE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Monthly Payroll", `₹${totalMonthlyPayroll.toFixed(2)}`, "+8.73%", "Total monthly net payout", DollarSign)}
              {renderKpiCard("Staff Members", employees.length, "+96.7%", "Active team members on roll", Users)}
              {renderKpiCard("Pending Payouts", `₹${totalPendingSalaries.toFixed(2)}`, "+12.3%", "Awaiting disbursement release", Clock)}
              {renderKpiCard("Salary Cycle", "01st of Month", "Direct", "NEFT / Bank Transfer", Wallet)}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100/90 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Employee Salary Register</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-gray-200/90 dark:border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                  <button className="p-2 border border-gray-200/90 dark:border-zinc-700 rounded-xl text-gray-500 hover:bg-gray-50 shadow-xs">
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Name :</th>
                      <th className="py-3 px-3">Basic + HRA :</th>
                      <th className="py-3 px-3">Deductions :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">Net Salary (₹) :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                    {employees.filter(emp => emp.name.toLowerCase().includes(mainSearchQuery.toLowerCase())).map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              <User size={14} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-xs">{emp.name}</p>
                              <p className="text-[11px] text-gray-400">{emp.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-medium">₹{emp.basic} + ₹{emp.hra}</td>
                        <td className="py-3.5 px-3 text-rose-500 font-medium">-₹{emp.deductions}</td>
                        <td className="py-3.5 px-3">{renderStatusBadge(emp.status)}</td>
                        <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">₹{emp.netSalary.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleToggleEmpStatus(emp.id)} className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-[10px] font-bold text-gray-700 dark:text-zinc-300">
                              {emp.status === "Paid" ? "Mark Due" : "Mark Paid"}
                            </button>
                            <button onClick={() => handleDeleteEmployee(emp.id)} className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>SHOWING {employees.length} OF {employees.length} EMPLOYEES</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:text-gray-700"><ChevronLeft size={14} /></button>
                  <span className="text-gray-700 dark:text-zinc-300 font-bold">1/1</span>
                  <button className="p-1 hover:text-gray-700"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Documents & Statutory Records</h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Secure repository for GST certificates, incorporation records, registrations, and licenses</p>
              </div>
              <button
                onClick={handleTopPrimaryAction}
                className="bg-black hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 uppercase tracking-wide self-start sm:self-auto transition-all"
              >
                <Upload size={14} />
                <span>+ UPLOAD DOCUMENT</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKpiCard("Total Documents", documents.length, "+8.73%", "Statutory records archived", Folder)}
              {renderKpiCard("Verified Records", documents.filter(d=>d.verified).length, "+96.7%", "Verified by administrator", CheckCircle2)}
              {renderKpiCard("Registrations", "3", "+12.3%", "COI, PAN, MSME files", Building)}
              {renderKpiCard("Tax Filings", "2", "Statutory", "GST & ITR acknowledgement", FileSpreadsheet)}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100/90 dark:border-zinc-800 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Repository Files</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-gray-200/90 dark:border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 w-52 outline-none shadow-xs"
                    />
                  </div>
                  <button className="p-2 border border-gray-200/90 dark:border-zinc-700 rounded-xl text-gray-500 hover:bg-gray-50 shadow-xs">
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3">Name :</th>
                      <th className="py-3 px-3">Category :</th>
                      <th className="py-3 px-3">Date Uploaded :</th>
                      <th className="py-3 px-3">Status :</th>
                      <th className="py-3 px-3">File Size :</th>
                      <th className="py-3 px-3 text-right">Actions :</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
                    {documents.filter(d => d.name.toLowerCase().includes(mainSearchQuery.toLowerCase())).map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              <FileText size={14} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-xs">{doc.name}</p>
                              <p className="text-[11px] text-gray-400">PDF • Verified Record</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">{doc.category}</td>
                        <td className="py-3.5 px-3 text-xs text-gray-600 dark:text-zinc-400">{doc.date}</td>
                        <td className="py-3.5 px-3">{renderStatusBadge("Active")}</td>
                        <td className="py-3.5 px-3 font-semibold text-gray-700 dark:text-zinc-300">{doc.size}</td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => alert(`Downloading ${doc.name}`)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg">
                              <Download size={13} />
                            </button>
                            <button onClick={() => handleDeleteDoc(doc.id)} className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>SHOWING {documents.length} OF {documents.length} DOCUMENTS</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:text-gray-700"><ChevronLeft size={14} /></button>
                  <span className="text-gray-700 dark:text-zinc-300 font-bold">1/1</span>
                  <button className="p-1 hover:text-gray-700"><ChevronRight size={14} /></button>
                </div>
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

      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SIDEBAR NAVIGATION (STRICTLY MATCHING USER'S ATTACHED IMAGE)
  // ─────────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0c0c0e] text-zinc-300 border-r border-zinc-800/80 transition-colors select-none font-sans">
      {/* Brand Header */}
      <div className="p-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">TrioTax</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Workspace / Account Pill */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setIsCompanyProfileOpen(true)}
          className="w-full bg-[#16161a] hover:bg-[#1d1d22] border border-zinc-800/90 text-zinc-200 rounded-xl px-3 py-2 text-xs font-medium flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2 truncate">
            <User size={13} className="text-zinc-400 flex-shrink-0" />
            <span className="truncate uppercase tracking-wider text-[11px] font-semibold">
              {companyProfile.tradeName || companyProfile.legalName || "PERSONAL"}
            </span>
          </div>
          <ChevronDown size={13} className="text-zinc-400 flex-shrink-0" />
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => {
            setActiveTab("sales");
            setSalesSubTab("invoices");
            setIsCreateInvoiceOpen(true);
          }}
          className="w-full bg-[#18181d] hover:bg-[#202026] text-zinc-300 hover:text-white border border-zinc-800/90 rounded-xl py-2 px-3 text-xs font-semibold flex items-center gap-2 transition-all uppercase tracking-wide text-[11px]"
        >
          <Plus size={13} className="text-zinc-400" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Navigation Group Header */}
      <div className="px-4 pt-1 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Accounting & ERP
        </span>
      </div>

      {/* The 9 Tabs */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
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
              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between uppercase tracking-wider ${
                isActive
                  ? "bg-[#1f1f24] text-white border border-zinc-700/80 font-bold shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-[#141418] font-medium"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <tab.icon size={15} className={isActive ? "text-white" : "text-zinc-400"} />
                <span className="text-[11px]">{tab.label}</span>
              </div>
              {tab.id === "compliance-tracker" && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-3 pt-2 border-t border-zinc-800/80 space-y-2">
        <button
          onClick={() => setIsCompanyProfileOpen(true)}
          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-[#141418] flex items-center gap-2 transition-colors uppercase tracking-wider text-[11px]"
        >
          <Settings size={13} />
          <span>Settings</span>
        </button>

        <button
          onClick={() => alert("TrioTax GST Support: support@triotax.com | Phone: 1800-TRIOTAX")}
          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-[#141418] flex items-center gap-2 transition-colors uppercase tracking-wider text-[11px]"
        >
          <HelpCircle size={13} />
          <span>Help & Support</span>
        </button>

        {/* Progress Card Widget */}
        <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-medium">Get Started</span>
            <span className="text-zinc-500 font-bold">4/5</span>
          </div>
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full w-4/5"></div>
          </div>
          <button
            onClick={() => setIsCompanyProfileOpen(true)}
            className="w-full bg-[#1a1a1f] hover:bg-[#222228] border border-zinc-800 text-zinc-300 hover:text-white rounded-lg py-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all mt-1"
          >
            <Gift size={12} className="text-zinc-400" />
            <span>FREE PLAN</span>
          </button>
        </div>

        {/* Logout */}
        <div className="pt-1 flex items-center justify-between px-1">
          <ThemeToggle />
          <button
            onClick={onLogout}
            className="text-[11px] text-zinc-500 hover:text-red-400 flex items-center gap-1 font-medium transition-colors"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8f9fb] dark:bg-[#0c0c0e] text-gray-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-60 h-full flex-shrink-0">
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
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8f9fb] dark:bg-[#0c0c0e]">
        {/* Top Header Bar matching reference image */}
        <header className="h-16 px-6 sm:px-8 bg-[#f8f9fb] dark:bg-[#0c0c0e] flex items-center justify-between flex-shrink-0 border-b border-gray-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <Menu size={20} />
            </button>

            {/* Pill Search Bar */}
            <div className="relative w-64 sm:w-80">
              <div className="flex items-center justify-between w-full bg-white dark:bg-zinc-900 border border-gray-200/90 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs shadow-xs focus-within:border-gray-400 dark:focus-within:border-zinc-600 transition-all">
                <div className="flex items-center gap-2 flex-1">
                  <Search size={14} className="text-gray-400" />
                  <input
                    type="text"
                    value={mainSearchQuery}
                    onChange={(e) => setMainSearchQuery(e.target.value)}
                    placeholder="Search leads, campaigns, contacts..."
                    className="w-full bg-transparent outline-none text-xs text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                  />
                </div>
                <kbd className="text-[10px] font-mono bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-1.5 py-0.5 text-gray-400">⌘K</kbd>
              </div>
            </div>
          </div>

          {/* Right Icons & Profile Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />

            <button
              onClick={() => setActiveTab("compliance-tracker")}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              title="Deadlines & Calendar"
            >
              <Calendar size={16} />
            </button>

            <button
              onClick={() => alert("All statutory compliances and automated schedules are up to date.")}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors relative"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            </button>

            <button
              onClick={() => setIsCompanyProfileOpen(true)}
              className="hidden sm:flex px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200/90 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs font-semibold text-gray-800 dark:text-zinc-200 rounded-xl items-center gap-1.5 shadow-xs transition-all"
            >
              <Gift size={13} className="text-gray-700 dark:text-zinc-300" />
              <span>FREE PLAN</span>
            </button>

            {/* Profile Avatar */}
            <div
              onClick={() => setIsCompanyProfileOpen(true)}
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-700 overflow-hidden bg-slate-900 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs hover:ring-2 hover:ring-gray-300 dark:hover:ring-zinc-600 transition-all uppercase"
              title="Profile Settings"
            >
              {username.charAt(0)}
            </div>
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
        {isCreateInvoiceOpen && (
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
        {isAddPurchaseOpen && (
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
        {isAddExpenseOpen && (
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
        {isAddPaymentOpen && (
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
        {isAddEmpOpen && (
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
        {isAddDocOpen && (
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
