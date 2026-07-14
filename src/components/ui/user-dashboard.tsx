import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, CreditCard, BarChart3, Settings, LogOut, Menu, X, User, Upload, Download, Plus, Trash2, Eye, EyeOff, Type, FileText } from "lucide-react";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { StockTicker } from "./stock-ticker";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface UserDashboardProps {
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("home");
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
  const [billingHistory, setBillingHistory] = useState<any[]>([
    { id: 1, date: "2026-06-15", invoiceNumber: "INV-1024", customer: "Acme Corp", amount: 1500 },
    { id: 2, date: "2026-05-15", invoiceNumber: "INV-0981", customer: "Stark Industries", amount: 2000 }
  ]);

  const mockBillingHistory = [
    { date: "2026-06-15", note: "Invoice #1024 paid" },
    { date: "2026-05-15", note: "Invoice #0981 paid" }
  ];

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "billing", label: "Billing Software", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
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
  const calculateTax = () => calculateSubtotal() * 0.18; // Assuming 18% GST for demo
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

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, User!</h2>
            
            <StockTicker />

            {/* GST Filing Status Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">GST Filing Status</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Admin Note:</span> "Please upload PAN"
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-4 py-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-sm font-bold rounded-full">
                  Billing Status: Ongoing
                </span>
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  View History &rarr;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4">
                  <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Metric {i}</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">1,024</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "billing":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Billing Software</h2>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                {/* Logo & Template */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Invoice Settings</h3>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      {logo ? (
                        <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">Upload Logo</p>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                    <div className="flex-1 space-y-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Template</p>
                      <div className="flex gap-4">
                        <button onClick={() => setTemplate(1)} className={`px-4 py-2 rounded-lg text-sm font-medium border ${template === 1 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400'}`}>Template 1 (Modern)</button>
                        <button onClick={() => setTemplate(2)} className={`px-4 py-2 rounded-lg text-sm font-medium border ${template === 2 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400'}`}>Template 2 (Classic)</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Form */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice Number</label>
                      <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                      <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label>
                      <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Acme Corp" className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Items</h4>
                    {items.map((item, index) => (
                      <div key={item.id} className="flex gap-3 items-start">
                        <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} className="flex-1 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 outline-none text-sm" />
                        <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} className="w-20 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 outline-none text-sm" />
                        <input type="number" placeholder="Price" value={item.price} onChange={(e) => updateItem(item.id, "price", Number(e.target.value))} className="w-24 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 outline-none text-sm" />
                        <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button onClick={addItem} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                      <Plus size={16} /> Add Item
                    </button>
                  </div>
                </div>
                
                {/* Billing History Section */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <FileText size={18} /> Billing History
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {billingHistory.map((bill) => (
                      <div key={bill.id} className="p-3 border border-gray-100 dark:border-zinc-800 rounded-lg flex justify-between items-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{bill.invoiceNumber} - {bill.customer}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{bill.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">₹{bill.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {billingHistory.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No bills generated yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Live Preview</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setIsAdvancedEdit(!isAdvancedEdit)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isAdvancedEdit ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700'}`}>
                      <Type size={16} /> Advanced Edit {isAdvancedEdit ? 'On' : 'Off'}
                    </button>
                    <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                      <Download size={16} /> Download PDF
                    </button>
                  </div>
                </div>
                
                {/* PDF Wrapper */}
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 overflow-x-auto relative">
                  {isAdvancedEdit && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 px-4 py-2 rounded-full shadow-xl z-20 flex gap-2 text-sm items-center transition-colors">
                      <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold', false, ''); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-700 dark:text-gray-300 font-bold" title="Bold">B</button>
                      <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic', false, ''); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-700 dark:text-gray-300 italic" title="Italic">I</button>
                      <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline', false, ''); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-700 dark:text-gray-300 underline" title="Underline">U</button>
                      <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                      <select onChange={(e) => document.execCommand('fontSize', false, e.target.value)} className="bg-transparent text-gray-700 dark:text-gray-300 outline-none text-xs border border-gray-200 dark:border-zinc-700 rounded px-1 py-1 cursor-pointer">
                        <option value="">Size</option>
                        <option value="1">Small</option>
                        <option value="3">Normal</option>
                        <option value="5">Large</option>
                        <option value="7">Huge</option>
                      </select>
                      <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                      <input type="color" onChange={(e) => document.execCommand('foreColor', false, e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" title="Text Color" />
                      <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                      <span className="text-xs text-gray-500 font-medium ml-1">Drag elements & Click text to edit</span>
                    </div>
                  )}
                  <div ref={invoiceRef} className="min-w-[600px] bg-white text-black p-8 relative" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    {/* Invoice Template 1 (Modern) */}
                    {template === 1 && (
                      <div className="space-y-8">
                        <motion.div drag={isAdvancedEdit} dragMomentum={false} className="flex justify-between items-start border-b-2 border-[#111827] pb-6 relative group">
                          {isAdvancedEdit && <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-lg"></div>}
                          <div>
                            {logo ? <img src={logo} alt="Logo" className="h-16 object-contain mb-4" /> : <div className="h-16 w-32 bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] mb-4 font-semibold text-xs">YOUR LOGO</div>}
                            <h1 className="text-3xl font-black text-[#111827] tracking-tight" contentEditable={isAdvancedEdit} suppressContentEditableWarning>INVOICE</h1>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-[#6b7280]">Invoice No.</p>
                            <p className="text-lg font-medium text-[#111827]" contentEditable={isAdvancedEdit} suppressContentEditableWarning>{invoiceNumber || '---'}</p>
                            <p className="text-sm font-bold text-[#6b7280] mt-2">Date</p>
                            <p className="text-md font-medium text-[#111827]" contentEditable={isAdvancedEdit} suppressContentEditableWarning>{invoiceDate || '---'}</p>
                          </div>
                        </motion.div>

                        <motion.div drag={isAdvancedEdit} dragMomentum={false} className="relative group p-2 -m-2">
                          {isAdvancedEdit && <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-lg"></div>}
                          <p className="text-sm font-bold text-[#6b7280] mb-1">Billed To:</p>
                          <p className="text-xl font-bold text-[#111827]" contentEditable={isAdvancedEdit} suppressContentEditableWarning>{customerName || 'Customer Name'}</p>
                        </motion.div>

                        <motion.div drag={isAdvancedEdit} dragMomentum={false} className="relative group">
                          {isAdvancedEdit && <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-lg"></div>}
                          <table className="w-full text-left border-collapse mt-8">
                            <thead>
                              <tr className="bg-[#111827] text-white">
                                <th className="p-3 text-sm font-medium w-3/5 rounded-tl-lg">Description</th>
                                <th className="p-3 text-sm font-medium text-center">Qty</th>
                                <th className="p-3 text-sm font-medium text-right">Price</th>
                                <th className="p-3 text-sm font-medium text-right rounded-tr-lg">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item, idx) => (
                                <tr key={item.id} className="border-b border-[#e5e7eb]">
                                  <td className="p-3 text-sm text-[#111827]" contentEditable={isAdvancedEdit} suppressContentEditableWarning>{item.description || 'Item description'}</td>
                                  <td className="p-3 text-sm text-center text-[#111827]">{item.quantity}</td>
                                  <td className="p-3 text-sm text-right text-[#111827]">₹{item.price.toFixed(2)}</td>
                                  <td className="p-3 text-sm text-right font-medium text-[#111827]">₹{(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </motion.div>

                        <motion.div drag={isAdvancedEdit} dragMomentum={false} className="flex justify-end pt-4 relative group">
                          {isAdvancedEdit && <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-lg"></div>}
                          <div className="w-1/2 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#4b5563]">Subtotal</span>
                              <span className="font-medium text-[#111827]">₹{calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#4b5563]">GST (18%)</span>
                              <span className="font-medium text-[#111827]">₹{calculateTax().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-black pt-3 border-t-2 border-[#111827]">
                              <span className="text-[#111827]">Total</span>
                              <span className="text-[#111827]">₹{calculateTotal().toFixed(2)}</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* Invoice Template 2 (Classic) */}
                    {template === 2 && (
                      <div className="space-y-6">
                        <motion.div drag={isAdvancedEdit} dragMomentum={false} className="text-center pb-6 border-b border-[#d1d5db] relative group">
                          {isAdvancedEdit && <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-lg"></div>}
                          {logo ? <img src={logo} alt="Logo" className="h-16 object-contain mx-auto mb-2" /> : <div className="h-16 w-32 bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] mx-auto mb-2 font-semibold text-xs">YOUR LOGO</div>}
                          <h1 className="text-2xl font-serif font-bold text-[#1f2937]" contentEditable={isAdvancedEdit} suppressContentEditableWarning>TAX INVOICE</h1>
                        </motion.div>
                        
                        <motion.div drag={isAdvancedEdit} dragMomentum={false} className="flex justify-between text-sm font-serif relative group p-2 -m-2">
                          {isAdvancedEdit && <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-lg"></div>}
                          <div>
                            <p className="font-bold text-[#111827]">Bill To:</p>
                            <p className="text-[#111827]" contentEditable={isAdvancedEdit} suppressContentEditableWarning>{customerName || 'Customer Name'}</p>
                          </div>
                          <div className="text-right text-[#111827]">
                            <p><span className="font-bold">Invoice #:</span> <span contentEditable={isAdvancedEdit} suppressContentEditableWarning>{invoiceNumber}</span></p>
                            <p><span className="font-bold">Date:</span> <span contentEditable={isAdvancedEdit} suppressContentEditableWarning>{invoiceDate}</span></p>
                          </div>
                        </motion.div>

                        <motion.div drag={isAdvancedEdit} dragMomentum={false} className="relative group">
                          {isAdvancedEdit && <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-lg"></div>}
                          <table className="w-full text-left border-collapse border border-[#d1d5db] font-serif text-sm">
                            <thead>
                              <tr className="bg-[#f3f4f6] text-[#111827]">
                                <th className="p-2 border border-[#d1d5db]">Description</th>
                                <th className="p-2 border border-[#d1d5db] text-center">Qty</th>
                                <th className="p-2 border border-[#d1d5db] text-right">Unit Price</th>
                                <th className="p-2 border border-[#d1d5db] text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item) => (
                                <tr key={item.id} className="text-[#111827]">
                                  <td className="p-2 border border-[#d1d5db]" contentEditable={isAdvancedEdit} suppressContentEditableWarning>{item.description || 'Item description'}</td>
                                  <td className="p-2 border border-[#d1d5db] text-center">{item.quantity}</td>
                                  <td className="p-2 border border-[#d1d5db] text-right">₹{item.price.toFixed(2)}</td>
                                  <td className="p-2 border border-[#d1d5db] text-right">₹{(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </motion.div>

                        <motion.div drag={isAdvancedEdit} dragMomentum={false} className="flex justify-end font-serif text-sm relative group">
                          {isAdvancedEdit && <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-lg"></div>}
                          <div className="w-64 border border-[#d1d5db] p-4 space-y-2 text-[#111827]">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>₹{calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax (18%):</span>
                              <span>₹{calculateTax().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#d1d5db]">
                              <span>Total:</span>
                              <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h2>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 h-96 flex items-center justify-center">
              <p className="text-gray-400">Detailed Analytics Chart Placeholder</p>
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input type="text" className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" defaultValue="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input type="email" className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" defaultValue="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                      <input type="text" className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" defaultValue="Acme Corp" />
                    </div>
                    <div className="pt-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Save Profile
                      </button>
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
                      <button className="bg-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-gray-100 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
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
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-1">
        <button
          onClick={() => {
            setActiveTab("settings");
            setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "settings" 
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
          }`}
        >
          <Settings size={18} />
          Settings
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-900 w-full overflow-hidden transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-zinc-950 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 h-16 flex items-center px-4 justify-between md:justify-end transition-colors">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">John Doe</div>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
              JD
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      {/* Billing History Modal */}
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
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh] border border-gray-100 dark:border-zinc-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Billing History</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your past GST filings and payments.</p>
                </div>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                      <tr>
                        <th className="p-3 font-medium border-b border-gray-200 dark:border-zinc-700">Date</th>
                        <th className="p-3 font-medium border-b border-gray-200 dark:border-zinc-700">Note / Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBillingHistory.length > 0 ? (
                        mockBillingHistory.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="p-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{item.date}</td>
                            <td className="p-3 text-gray-800 dark:text-gray-300">{item.note}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="p-4 text-center text-gray-500 italic">No billing history found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-end">
                <button 
                  onClick={() => setIsHistoryOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
