"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare, X, Send, Phone, ShieldAlert,
  HelpCircle, MessageCircle, RefreshCw, Copy, Check
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- KNOWLEDGE BASE ---
interface ServiceInfo {
  id: string;
  name: string;
  category: string;
  price: string;
  timeline: string;
  documents: string[];
  benefits: string[];
  description: string;
  keywords: string[];
}

const SERVICES_KNOWLEDGE: ServiceInfo[] = [
  {
    id: "gst-registration",
    name: "GST Registration",
    category: "Taxation",
    price: "₹1,499",
    timeline: "3–7 working days",
    description: "Obtaining a unique 15-digit Goods and Services Tax Identification Number (GSTIN) from the government, enabling you to collect GST and claim input tax credit legally.",
    keywords: ["gst", "gstin", "register gst", "gst number", "gst certificate", "apply gst"],
    documents: [
      "PAN Card of the applicant / business entity",
      "Aadhaar Card of the authorized signatory",
      "Proof of business address (electricity bill / rent agreement)",
      "Bank account statement or cancelled cheque"
    ],
    benefits: [
      "Legally recognize business as supplier",
      "Avail input tax credits seamlessly",
      "Eligible to sell interstate and on e-commerce platforms",
      "Avoid penalties for unregistered operations"
    ]
  },
  {
    id: "gst-filing",
    name: "GST Return Filing",
    category: "Taxation",
    price: "₹999/month",
    timeline: "Monthly/Quarterly compliance",
    description: "Filing mandatory GSTR-1, GSTR-3B, and GSTR-9 returns to report sales, purchases, and tax paid to stay compliant and avoid heavy late fees.",
    keywords: ["file gst", "gst return", "gst filing", "gstr", "monthly gst", "quarterly gst", "late return"],
    documents: [
      "Sales invoices / data for the period",
      "Purchase register / purchase invoices",
      "GST portal login credentials"
    ],
    benefits: [
      "Zero penalties and late fees",
      "Accurate input tax credit reconciliation",
      "Maintain active compliance rating on portal"
    ]
  },
  {
    id: "itr-filing",
    name: "Income Tax Filing",
    category: "Taxation",
    price: "₹999 onwards",
    timeline: "2-3 working days",
    description: "Preparation and filing of Income Tax Returns (ITR-1 to ITR-7) for individuals, salaried professionals, partnerships, and corporate entities.",
    keywords: ["itr", "income tax", "file tax", "tax return", "salary tax", "tax deduction"],
    documents: [
      "PAN & Aadhaar card",
      "Form 16 (for salaried individuals)",
      "Bank account statements for the financial year",
      "Investment and tax-saving receipts"
    ],
    benefits: [
      "Avoid interest and late penalties",
      "Facilitate easy visa approvals & loan applications",
      "Claim eligible tax refunds from the IT department"
    ]
  },
  {
    id: "company-registration",
    name: "Company Registration",
    category: "Business Startup Setup",
    price: "₹2,999",
    timeline: "7–15 working days",
    description: "Incorporate a Private Limited (Pvt Ltd) Company, One Person Company (OPC), or Public Limited Company under the Ministry of Corporate Affairs (MCA).",
    keywords: ["pvt ltd", "register company", "incorporate", "start company", "company setup", "private limited", "opc"],
    documents: [
      "PAN Card of all Directors",
      "Aadhaar / Passport / Voter ID of all Directors",
      "Bank statement / Utility bill of Directors (proof of address)",
      "Proof of registered office address (NOC + Utility bill)"
    ],
    benefits: [
      "Creates a separate legal entity",
      "Provides limited liability protection for founders",
      "Easier to raise equity capital from investors",
      "High corporate credibility and status"
    ]
  },
  {
    id: "llp-registration",
    name: "LLP Registration",
    category: "Business Startup Setup",
    price: "₹2,499",
    timeline: "10-15 working days",
    description: "Register a Limited Liability Partnership (LLP), combining the operational flexibility of a partnership with the limited liability benefits of a corporate company.",
    keywords: ["llp", "limited liability partnership", "partnership setup", "llp deed"],
    documents: [
      "PAN Card of Partners",
      "Aadhaar Card / ID proof of Partners",
      "Address proof of Partners and office address",
      "LLP Partnership Agreement"
    ],
    benefits: [
      "No mandatory audit requirement up to ₹40L turnover",
      "Limited liability protection for partners",
      "Lower compliance costs compared to Pvt Ltd company"
    ]
  },
  {
    id: "startup-registration",
    name: "Startup Registration",
    category: "Business Startup Setup",
    price: "₹3,999",
    timeline: "7-10 working days",
    description: "Get recognized under DPIIT (Department for Promotion of Industry and Internal Trade) to access tax holidays, funding opportunities, and easy intellectual property applications.",
    keywords: ["startup india", "dpiit", "startup registration", "seed funding", "tax holiday", "startup tax exemption"],
    documents: [
      "Certificate of Incorporation / Registration of company",
      "Detailed write-up on innovation/scalability",
      "Pitch deck or website link"
    ],
    benefits: [
      "Eligible for 3-year income tax exemption",
      "Self-certification under labour and environmental laws",
      "Access to government seed funds and patent fast-tracking"
    ]
  },
  {
    id: "trademark-registration",
    name: "Trademark Registration",
    category: "Licensing & Registration",
    price: "₹1,999 + Govt Fees",
    timeline: "3 working days (for application)",
    description: "Protect your brand name, logo, or slogan from plagiarism by legally registering it under the Indian Intellectual Property Office.",
    keywords: ["trademark", "brand protection", "register logo", "logo registration", "brand name", "tm"],
    documents: [
      "Logo artwork / Brand name representation",
      "Signed Authorization Form (TM-48)",
      "MSME Certificate (optional, saves 50% on government fees)"
    ],
    benefits: [
      "Exclusive legal rights to use your brand",
      "Prevents competitors from using similar names/logos",
      "Serves as a valuable intangible asset for the business"
    ]
  },
  {
    id: "udyam-msme",
    name: "Udyam Adhar (MSME) Registration",
    category: "Licensing & Registration",
    price: "₹999",
    timeline: "1-2 working days",
    description: "Get registered under MSME to qualify for government subsidies, collateral-free business loans, lower interest rates, and protection against delayed payments.",
    keywords: ["msme", "udyam", "msme certificate", "udyam registration", "small business registration"],
    documents: [
      "PAN Card of the entrepreneur",
      "Aadhaar Card linked to active mobile",
      "GSTIN (if applicable)"
    ],
    benefits: [
      "Easy collateral-free bank loans",
      "Saves 50% on trademark registration government fees",
      "Subsidies on patenting and electricity bills"
    ]
  }
];

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  isHtml?: boolean;
  recommendedService?: string;
  suggestedQuestions?: string[];
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Flow State
  const [flowState, setFlowState] = useState<string | null>(null);
  const [flowData, setFlowData] = useState<{ owners?: string; type?: string; state?: string }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: `Hello 👋 Welcome to **TrioTax**.<br/><br/>I'm your **AI Tax Assistant**. I can help you with:<br/>• GST Registration & Filing<br/>• Company, LLP, & MSME Setup<br/>• Income Tax & Auditing<br/>• Trademark & Copyright protection<br/><br/>How can I assist you today?`,
        timestamp: time,
        isHtml: true,
        suggestedQuestions: [
          "I want to register a company",
          "What documents are needed for GST?",
          "How do I file ITR?",
          "Can you protect my brand name?"
        ]
      }
    ]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text.replace(/<br\s*\/?>/gi, '\n').replace(/\*\*|✅|🚀|•/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: time
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      processBotResponse(text);
    }, 1200);
  };

  const processBotResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase().trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let replyText = "";
    let recommendedService = "";
    let suggestions: string[] = ["What documents are required?", "How much does it cost?", "How long does it take?", "Talk to Expert"];
    let nextFlowState: string | null = flowState;
    let nextFlowData = { ...flowData };

    // --- CONVERSATION FLOW ROUTER (STATE MEMORY) ---
    if (flowState === "company-owners") {
      nextFlowData.owners = userQuery;
      replyText = `Understood. You have **${userQuery}** owner(s).<br/><br/>What **type of business** are you planning to operate (e.g. IT software, e-commerce, consulting, retail shop)?`;
      nextFlowState = "company-type";
      suggestions = ["E-commerce", "IT Software consulting", "Retail trading", "Restaurant"];
    } else if (flowState === "company-type") {
      nextFlowData.type = userQuery;
      replyText = `Great! An business in **${userQuery}** sounds promising.<br/><br/>Lastly, which **state** will the company operate in?`;
      nextFlowState = "company-state";
      suggestions = ["Karnataka", "Maharashtra", "Tamil Nadu", "Delhi"];
    } else if (flowState === "company-state") {
      nextFlowData.state = userQuery;
      nextFlowState = null; // flow finishes
      nextFlowData = {};

      const ownersNum = parseInt(flowData.owners || "1");
      if (ownersNum === 1) {
        replyText = `Based on your answers (1 owner, ${flowData.type} business in ${userQuery}), I highly recommend **Proprietorship Registration** for a quick launch or **One Person Company (OPC)** for corporate structure with limited liability.`;
        recommendedService = "Company Registration";
      } else {
        replyText = `Based on your answers (${ownersNum} owners, ${flowData.type} business in ${userQuery}), I recommend registering a **Private Limited Company** (for scaling/funding) or a **Limited Liability Partnership (LLP)** (for lower compliance costs).`;
        recommendedService = "Company Registration";
      }
      replyText += `<br/><br/>Would you like to know the required documents or the registration cost?`;
      suggestions = ["What documents are required?", "How much does it cost?", "Talk to an Expert"];
    }
    // --- SEMANTIC QUERY MATCHING ---
    else {
      // 1. GREETINGS
      if (query.match(/\b(hi|hello|hey|greetings|morning|evening|hola)\b/)) {
        replyText = "Hello! 👋 I'm your AI Tax Consultant. How can I help you with your compliance, registrations, or filing today?";
        suggestions = ["I want to register a company", "What documents are needed for GST?", "How do I file ITR?", "Talk to Expert"];
      }
      // 2. COMPANY REGISTRATION FLOW
      else if (query.includes("company") || query.includes("incorporate") || query.includes("pvt ltd") || query.includes("private limited") || query.includes("start a business")) {
        replyText = `I would be happy to guide you through registering a company in India.<br/><br/>To recommend the exact right structure, could you tell me:<br/>• **How many owners/partners** will the business have?`;
        nextFlowState = "company-owners";
        suggestions = ["1 owner", "2 owners", "More than 2 owners"];
      }
      // 3. GST REGISTRATION
      else if (query.includes("gst") && (query.includes("register") || query.includes("number") || query.includes("apply") || query.includes("certificate") || query.includes("get gst"))) {
        const gst = SERVICES_KNOWLEDGE.find(s => s.id === "gst-registration")!;
        replyText = `**GST Registration** is mandatory for businesses with turnover exceeding ₹20 Lakhs (₹10 Lakhs for North East) or for any inter-state supply. It takes **${gst.timeline}** and costs **${gst.price}**.<br/><br/>**Benefits include:**<br/>• Legally claim Input Tax Credit (ITC)<br/>• Sell online and across state boundaries`;
        recommendedService = "GST Registration";
        suggestions = ["What documents are required?", "How much does it cost?", "File GST returns", "Talk to Expert"];
      }
      // 4. GST FILING
      else if (query.includes("gst") && (query.includes("file") || query.includes("return") || query.includes("monthly") || query.includes("quarterly") || query.includes("late"))) {
        const gstF = SERVICES_KNOWLEDGE.find(s => s.id === "gst-filing")!;
        replyText = `Pending or late GST return filing can attract heavy penalties. TrioTax handles all GSTR-1, 3B, and annual filings accurately to maximize your Input Tax Credit (ITC) reconciliation.<br/><br/>Our price is **${gstF.price}**.`;
        recommendedService = "GST Return Filing";
        suggestions = ["What documents are required?", "How much does it cost?", "GST Registration", "Talk to Expert"];
      }
      // 5. INCOME TAX / ITR
      else if (query.includes("itr") || query.includes("income tax") || query.includes("file tax") || query.includes("tax return")) {
        const itr = SERVICES_KNOWLEDGE.find(s => s.id === "itr-filing")!;
        replyText = `Filing your **Income Tax Returns (ITR)** is crucial for loan applications, visa processing, and avoiding IT notices. TrioTax helps file ITRs starting from **${itr.price}** in **${itr.timeline}**.`;
        recommendedService = "Income Tax Filing";
        suggestions = ["What documents are required?", "How much does it cost?", "Talk to Expert"];
      }
      // 6. STARTUP INDIA
      else if (query.includes("startup") || query.includes("dpiit") || query.includes("tax exemption")) {
        const startup = SERVICES_KNOWLEDGE.find(s => s.id === "startup-registration")!;
        replyText = `**Startup India Registration (DPIIT recognition)** grants massive tax holidays (3-year exemption), seed fund access, and self-compliance benefits for early stage innovators.<br/><br/>Timeline: **${startup.timeline}**`;
        recommendedService = "Startup Registration";
        suggestions = ["What documents are required?", "How much does it cost?", "Company Registration", "Talk to Expert"];
      }
      // 7. TRADEMARK
      else if (query.includes("trademark") || query.includes("logo") || query.includes("brand") || query.includes("tm")) {
        const tm = SERVICES_KNOWLEDGE.find(s => s.id === "trademark-registration")!;
        replyText = `Protect your business identity! **Trademark Registration** gives you exclusive ownership of your brand name and logo, preventing competitors from stealing your market reputation.`;
        recommendedService = "Trademark Registration";
        suggestions = ["What documents are required?", "How much does it cost?", "MSME Registration", "Talk to Expert"];
      }
      // 8. MSME / UDYAM
      else if (query.includes("msme") || query.includes("udyam") || query.includes("udyam registration")) {
        const msme = SERVICES_KNOWLEDGE.find(s => s.id === "udyam-msme")!;
        replyText = `**Udyam (MSME) Registration** qualifies you for lower-interest business loans, subsidies on patenting, and priority government procurement. Price: **${msme.price}**.`;
        recommendedService = "MSME Registration";
        suggestions = ["What documents are required?", "How much does it cost?", "Trademark Registration", "Talk to Expert"];
      }
      // 9. ESCALATION / TALK TO EXPERT / PRICING & TIMELINE UTILITIES
      else if (query.includes("document") || query.includes("needed") || query.includes("required")) {
        // Attempt to find current active service from last recommended
        const lastRec = messages.slice().reverse().find(m => m.recommendedService)?.recommendedService;
        const matchingS = SERVICES_KNOWLEDGE.find(s => s.name === lastRec) || SERVICES_KNOWLEDGE[0];
        
        replyText = `For **${matchingS.name}**, the required documents are:<br/>` + matchingS.documents.map(d => `• ${d}`).join("<br/>");
        suggestions = ["How much does it cost?", "How long does it take?", "Talk to Expert"];
      } else if (query.includes("cost") || query.includes("price") || query.includes("fee")) {
        const lastRec = messages.slice().reverse().find(m => m.recommendedService)?.recommendedService;
        const matchingS = SERVICES_KNOWLEDGE.find(s => s.name === lastRec) || SERVICES_KNOWLEDGE[0];
        
        replyText = `The cost for **${matchingS.name}** is **${matchingS.price}** (all inclusive of professional fees and filing fees).`;
        suggestions = ["What documents are required?", "How long does it take?", "Talk to Expert"];
      } else if (query.includes("time") || query.includes("duration") || query.includes("long")) {
        const lastRec = messages.slice().reverse().find(m => m.recommendedService)?.recommendedService;
        const matchingS = SERVICES_KNOWLEDGE.find(s => s.name === lastRec) || SERVICES_KNOWLEDGE[0];
        
        replyText = `Processing and government approval for **${matchingS.name}** usually takes **${matchingS.timeline}**.`;
        suggestions = ["What documents are required?", "How much does it cost?", "Talk to Expert"];
      } else if (query.includes("contact") || query.includes("expert") || query.includes("talk") || query.includes("human") || query.includes("call") || query.includes("whatsapp")) {
        replyText = `You can easily connect with a TrioTax consultant:<br/>• **Phone**: +91 9591578333 / +91 6361556801<br/>• **Email**: support@triotax.in<br/>• **WhatsApp**: Click the buttons below to initiate chat.`;
        suggestions = ["Book Consultation", "GST Registration", "Company Registration"];
      } else {
        // AI Escalation fallback
        replyText = "I'm not completely sure about that specific legal guideline. Our senior CAs and tax experts can provide accurate, up-to-date guidance.<br/><br/>Would you like to connect with a TrioTax consultant?";
        suggestions = ["Talk to Expert", "GST Registration", "Company Registration"];
      }
    }

    setFlowState(nextFlowState);
    setFlowData(nextFlowData);

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: replyText,
      timestamp: time,
      isHtml: true,
      recommendedService: recommendedService || undefined,
      suggestedQuestions: suggestions
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer",
          isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-[#2563EB] hover:bg-blue-700"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window Popup overlay */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[380px] sm:w-[400px] h-[550px] bg-white/95 dark:bg-[#0c1a30]/95 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-350 z-50 backdrop-blur-md">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#2563EB] to-blue-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative">
                <MessageCircle className="w-5 h-5" />
                <span className="w-2.5 h-2.5 bg-emerald-400 border-2 border-[#2563EB] rounded-full absolute bottom-0 right-0 animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm">TrioTax Assistant</h3>
                <p className="text-[10px] text-blue-200">Online • AI Consultant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  setMessages([
                    {
                      id: "welcome-reset",
                      sender: "bot",
                      text: `Hello 👋 Welcome to **TrioTax**.<br/><br/>I'm your **AI Tax Assistant**. I can help you with:<br/>• GST Registration & Filing<br/>• Company, LLP, & MSME Setup<br/>• Income Tax & Auditing<br/>• Trademark & Copyright protection<br/><br/>How can I assist you today?`,
                      timestamp: time,
                      isHtml: true,
                      suggestedQuestions: ["GST Registration", "Company Registration", "Income Tax", "Trademark"]
                    }
                  ]);
                  setFlowState(null);
                  setFlowData({});
                }} 
                className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors"
                title="Reset Chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: "#EBF2FA" }}>
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div key={msg.id} className={cn("flex flex-col", isBot ? "items-start" : "items-end")}>
                  
                  {/* Bubble Row */}
                  <div className="flex gap-2 max-w-[85%] items-end">
                    
                    {/* Message Bubble */}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-xs leading-relaxed text-left relative group",
                        isBot
                          ? "bg-white dark:bg-[#0c1a30] text-gray-800 dark:text-zinc-200 border border-gray-100 dark:border-zinc-800/80 rounded-bl-none shadow-sm"
                          : "bg-[#2563EB] text-white rounded-br-none"
                      )}
                    >
                      {msg.isHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                      ) : (
                        <p>{msg.text}</p>
                      )}

                      {/* Recommend Service Box */}
                      {msg.recommendedService && (
                        <div className="mt-3 p-2 bg-blue-500/10 dark:bg-blue-400/5 border border-blue-500/20 rounded-lg flex items-center justify-between gap-3">
                          <div>
                            <span className="block text-[9px] text-[#2563EB] dark:text-blue-400 font-bold uppercase tracking-wider">Recommended Service</span>
                            <span className="block text-xs font-semibold text-gray-900 dark:text-white">{msg.recommendedService}</span>
                          </div>
                          <button
                            onClick={() => {
                              const s = SERVICES_KNOWLEDGE.find(s => s.name === msg.recommendedService);
                              if (s) {
                                handleSendMessage(`I want to know more about ${s.name}`);
                              }
                            }}
                            className="text-[10px] text-white bg-[#2563EB] hover:bg-blue-700 px-2 py-1 rounded font-medium cursor-pointer"
                          >
                            Explore
                          </button>
                        </div>
                      )}

                      <span className="block text-[8px] text-gray-400 dark:text-zinc-500 text-right mt-1.5">
                        {msg.timestamp}
                      </span>

                      {/* Copy Action Button */}
                      {isBot && (
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="absolute -right-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                          title="Copy Message"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}

                    </div>
                  </div>

                  {/* Quick replies & suggested questions under BOT response */}
                  {isBot && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pl-2 max-w-[90%]">
                      {msg.suggestedQuestions.map((q) => {
                        const isTalkExpert = q === "Talk to Expert" || q === "Talk to an Expert";
                        return (
                          <button
                            key={q}
                            onClick={() => {
                              if (isTalkExpert) {
                                handleSendMessage("I want to speak with a tax expert consultant");
                              } else {
                                handleSendMessage(q);
                              }
                            }}
                            className={cn(
                              "text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                              isTalkExpert
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                                : "bg-white dark:bg-[#0c1a30] text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400"
                            )}
                          >
                            {q}
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="bg-white dark:bg-[#0c1a30] rounded-2xl px-4 py-3 border border-gray-100 dark:border-zinc-800 rounded-bl-none shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Connect CTA bar */}
          <div className="px-4 py-1.5 bg-zinc-100/50 dark:bg-[#060e1d]/50 border-t border-b border-zinc-200/50 dark:border-zinc-800/80 flex items-center justify-between gap-1">
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Escalate:</span>
            <div className="flex items-center gap-1">
              <a
                href="https://wa.me/919591578333"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                WhatsApp
              </a>
              <span className="text-zinc-400 text-xs">•</span>
              <a
                href="mailto:support@triotax.in"
                className="text-[10px] text-[#2563EB] hover:underline"
              >
                Email
              </a>
              <span className="text-zinc-400 text-xs">•</span>
              <a
                href="tel:+919591578333"
                className="text-[10px] text-zinc-400 hover:text-white hover:underline"
              >
                Call Now
              </a>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-[#0c1a30] border-t border-gray-100 dark:border-zinc-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question (e.g. How to get GST?)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(inputValue);
                }
              }}
              className="flex-1 bg-zinc-50 dark:bg-[#060e1d] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#2563EB] transition-colors"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              className="w-10 h-10 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
