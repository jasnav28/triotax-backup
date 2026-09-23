import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, CreditCard, BarChart3, Settings, LogOut, Menu, X, User, Upload, Download, Plus, Trash2, Eye, EyeOff, Type, FileText, CheckCircle, Wallet, Users, DollarSign, Briefcase, Calendar } from "lucide-react";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { StockTicker } from "./stock-ticker";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface UserDashboardProps {
  onLogout: () => void;
  username?: string;
  initialTab?: string;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, username = "user", initialTab = "dashboard" }) => {
  const [activeTab, setActiveTab] = useState(initialTab || "dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // --- Settings State ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Billing/Invoice State ---
  const [logo, setLogo] = useState<string | null>(null);
  const [template, setTemplate] = useState<1 | 2>(1);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ id: 1, description: "", quantity: 1, price: 0 }]);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isAdvancedEdit, setIsAdvancedEdit] = useState(false);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);

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

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "home", label: "Home", icon: Home },
    { id: "billing-software", label: "Billing Software", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "compliance-tracker", label: "Compliance Tracker", icon: FileText },
    { id: "payrolls", label: "Payrolls", icon: Wallet },
  ];

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
      
      // Save to billing history
      setBillingHistory([
        {
          id: Date.now(),
          date: invoiceDate || new Date().toISOString().split("T")[0],
          invoiceNumber,
          customer: customerName || "Customer Name",
          amount: calculateTotal()
        },
        ...billingHistory
      ]);
    } catch (error) {
      console.error("Error generating PDF", error);
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

    setEmployees([newEmp, ...employees]);
    setEmpName("");
    setEmpRole("");
    setEmpBasic("");
    setEmpHra("");
    setEmpDeductions("");
    setIsAddEmpOpen(false);
  };

  const handleMarkPaid = (id: number) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, status: "Paid", paymentDate: new Date().toISOString().split("T")[0] } : emp
    ));
  };

  const handleDeleteEmployee = (id: number) => {
    if (confirm("Remove this employee from payroll?")) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
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

  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + (emp.netSalary || 0), 0);
  const totalPendingSalaries = employees.filter(e => e.status === "Pending").reduce((sum, emp) => sum + (emp.netSalary || 0), 0);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
      case "home":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {username}!</h2>
            
            <StockTicker />

            {/* GST Filing Status Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Account Compliance Status</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Admin Note:</span> All account services are active.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-bold rounded-full flex items-center gap-1.5">
                  <CheckCircle size={14} /> Account Active
                </span>
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  View Invoices &rarr;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4">
                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Invoices Created</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{billingHistory.length}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4">
                <div className="h-10 w-10 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Billed</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    ₹{billingHistory.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4">
                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Payroll Employees</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{employees.length}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4">
                <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Monthly Payroll</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{totalMonthlyPayroll.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "billing-software":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Billing Software</h2>
            
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
                      className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isAdvancedEdit ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <Type size={16} /> Rich Edit
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
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="flex-1 border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity || ""}
                          onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                          className="w-20 border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.price || ""}
                          onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                          className="w-28 border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Total: ₹{calculateTotal().toFixed(2)}</span>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
                    >
                      <Download size={16} /> Download PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-100 dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 flex flex-col items-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 self-start">Live Preview</h3>
                
                <div
                  ref={invoiceRef}
                  contentEditable={isAdvancedEdit}
                  suppressContentEditableWarning={true}
                  className={`w-full max-w-[595px] min-h-[842px] bg-white text-black p-8 shadow-md rounded-sm ${
                    isAdvancedEdit ? "outline-dashed outline-2 outline-indigo-500" : ""
                  }`}
                >
                  {template === 1 ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-start border-b border-gray-200 pb-6">
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

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase">Billed To</p>
                          <p className="font-bold text-gray-800">{customerName || "Customer Name"}</p>
                        </div>
                      </div>

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

                      <div className="flex justify-end pt-4">
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
                    </div>
                  ) : (
                    <div className="space-y-6 font-serif">
                      <div className="text-center border-b-2 border-black pb-4">
                        <h1 className="text-3xl font-bold tracking-wide capitalize">{username}</h1>
                        <p className="text-xs italic text-gray-600">INVOICE #{invoiceNumber}</p>
                      </div>

                      <div className="flex justify-between text-xs">
                        <div>
                          <p className="font-bold">Billed To:</p>
                          <p>{customerName || "Customer Name"}</p>
                        </div>
                        <div className="text-right">
                          <p><strong>Date:</strong> {invoiceDate || new Date().toISOString().split("T")[0]}</p>
                        </div>
                      </div>

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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Billing Activity</h3>
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-200 dark:border-zinc-800 rounded-lg">
                  {billingHistory.length === 0 ? "No invoices generated yet. Create your first invoice in Billing Software." : `${billingHistory.length} total invoices created.`}
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Compliance Health</h3>
                <div className="h-64 flex flex-col items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={40} />
                  <span className="font-bold text-lg text-gray-800 dark:text-white">100% Compliant</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">All required filings up to date</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "compliance-tracker":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Compliance Tracker</h2>
            <p className="text-gray-500 dark:text-gray-400">Track all your compliance tasks and deadlines in one place.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "GST Return Filing", due: "25th of every month", status: "Active", color: "green" },
                { title: "TDS Payment", due: "7th of every month", status: "Active", color: "green" },
                { title: "Annual ROC Filing", due: "30th September", status: "Active", color: "green" },
                { title: "Income Tax Return", due: "31st July", status: "Active", color: "green" },
                { title: "PF & ESI Payment", due: "15th of every month", status: "Active", color: "blue" },
                { title: "Advance Tax Payment", due: "15th December", status: "Active", color: "blue" },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.color === "green" ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                    "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  }`}>
                    <FileText size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Due: {item.due}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.color === "green" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "payrolls":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Employee Payroll Management</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage employee salaries, allowances, deductions, and generate monthly payslips.</p>
              </div>
              <button
                onClick={() => setIsAddEmpOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm self-start sm:self-auto"
              >
                <Plus size={18} /> Add Employee
              </button>
            </div>

            {/* Payroll Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Staff</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{employees.length}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                  <DollarSign size={22} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monthly Outflow</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">₹{totalMonthlyPayroll.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
                <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                  <Wallet size={22} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Disbursal</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">₹{totalPendingSalaries.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Employee Salary List</h3>
                <span className="text-xs text-gray-400 font-medium">{employees.length} Employees Registered</span>
              </div>

              {employees.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Employees Added</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5">Click "Add Employee" to start managing staff salaries and payslips.</p>
                  <button
                    onClick={() => setIsAddEmpOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    + Add First Employee
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-950/50 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-zinc-800">
                        <th className="p-4 font-medium">Employee Name & Role</th>
                        <th className="p-4 font-medium">Basic Pay</th>
                        <th className="p-4 font-medium">HRA / Allowances</th>
                        <th className="p-4 font-medium">PF/ESI Deductions</th>
                        <th className="p-4 font-medium">Net Salary</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp.id} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-gray-800 dark:text-gray-200">{emp.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{emp.role}</div>
                          </td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">₹{emp.basic.toFixed(2)}</td>
                          <td className="p-4 text-green-600 dark:text-green-400">+₹{emp.hra.toFixed(2)}</td>
                          <td className="p-4 text-red-500 dark:text-red-400">-₹{emp.deductions.toFixed(2)}</td>
                          <td className="p-4 font-bold text-gray-900 dark:text-white">₹{emp.netSalary.toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                              emp.status === "Paid" 
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {emp.status !== "Paid" && (
                                <button
                                  onClick={() => handleMarkPaid(emp.id)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                                >
                                  Mark Paid
                                </button>
                              )}
                              <button
                                onClick={() => handleDownloadPayslip(emp)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Download Payslip PDF"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(emp.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Remove Employee"
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 transition-colors">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          User Dashboard
        </h1>
      </div>
      
      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsMobileMenuOpen(false);
              window.history.pushState(null, "", `/${username}-user/${tab.id}`);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
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

      {/* Main Content */}
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
              {tabs.find((t) => t.id === activeTab)?.label || "Dashboard"}
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
