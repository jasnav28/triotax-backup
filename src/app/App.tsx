import { useState, useEffect, useRef } from "react";
import {
  FileText, RefreshCw, Building2, Users, Shield, Award, Briefcase,
  TrendingUp, CheckCircle2, Globe, Calculator, Store, Key, CreditCard,
  BookOpen, BarChart2, ClipboardList, Rocket, FileCheck, Scale, Search,
  Star, ArrowRight, Phone, Mail, MapPin, ChevronDown,
  Menu, X, Check, Zap, DollarSign, IndianRupee, Headphones, Lock,
  ThumbsUp, Send, Facebook, Twitter, Linkedin, Instagram,
  Calendar, Clock, GraduationCap, Heart, Target,
  ChevronRight, Building, Users2, Lightbulb, Sun, Moon, LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Chatbot } from "@/app/components/ui/chatbot";
import TravelConnectSignIn from "@/components/ui/travel-connect-signin-1";
import AdminPage from "@/components/ui/admin-page";
import UserDashboard from "@/components/ui/user-dashboard";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SERVICE_CATEGORIES = [
  {
    id: "business-startup",
    title: "Business Startup Setup",
    desc: "Establish your business entity legally in India. We help you choose and setup the ideal structure—from Partnerships to Private Limited Companies.",
    features: [
      "Limited Liability options",
      "100% online registration",
      "Startup India recognition support"
    ],
    offerings: [
      { id: "proprietorship", title: "Proprietorship Registration", desc: "Start your single-owner business quickly with GST and MSME setup." },
      { id: "partnership", title: "Partnership Firm Registration", desc: "Register a partnership firm with structured deeds and agreements." },
      { id: "llp", title: "Limited Liability Partnership (LLP)", desc: "Combine partnership flexibility with private limited liability protection." },
      { id: "pvt-ltd", title: "Private Limited Company Registration", desc: "Incorporate a private limited company with MCA and compliance support." },
      { id: "public-ltd", title: "Public Limited Company Registration", desc: "Raise capital from the public by registering a public limited company." },
      { id: "opc", title: "One Person Company (OPC) Registration", desc: "Single-founder incorporation with limited liability benefits." },
      { id: "subsidiary", title: "Indian Subsidiary Registration", desc: "Setup a subsidiary of your foreign company in India." },
      { id: "section-8", title: "Section 8 (NGO) Company Registration", desc: "Establish a non-profit company for charitable or social causes." },
      { id: "trust-reg", title: "Trust Registration", desc: "Register public or private charitable trusts for social welfare." }
    ]
  },
  {
    id: "licensing-registration",
    title: "Licensing & Registration Services",
    desc: "Obtain mandatory government registrations, licenses, and intellectual property protections required to operate legally.",
    features: [
      "GST & FSSAI registrations",
      "Trademark & brand protection",
      "Local municipality trade licenses"
    ],
    offerings: [
      { id: "shop-establishment", title: "Shops & Establishment Registration", desc: "Register commercial establishments under state labour departments." },
      { id: "clra-license", title: "CLRA (Contract Labour) License", desc: "Get CLRA licenses for deploying or hiring contract labour." },
      { id: "trade-license", title: "Trade License Registration", desc: "Obtain municipal authority licenses to carry out specific trades." },
      { id: "bocw", title: "BOCW Registration", desc: "Register for Building and Other Construction Workers compliance." },
      { id: "fssai-food", title: "FSSAI (Food License) Registration", desc: "Mandatory food safety license for cafes, restaurants, and F&B brands." },
      { id: "dsc-sig", title: "Digital Signature Certificate (DSC)", desc: "Secure digital signatures for MCA, GST, and legal filing portals." },
      { id: "iec-code", title: "Import Export Code (IEC)", desc: "Get your DGFT license to start international import/export business." },
      { id: "drug-license", title: "Drug License", desc: "Obtain retail or wholesale drug licenses for pharma businesses." },
      { id: "icegate", title: "ICEGATE Registration", desc: "Register on the Indian Customs Electronic Gateway portal." },
      { id: "iso-cert", title: "ISO Certification", desc: "Get ISO 9001, 27001, or other quality management certifications." },
      { id: "pf-reg", title: "PF Registration", desc: "Register for Employee Provident Fund for teams of 20+ members." },
      { id: "psara", title: "PSARA Registration", desc: "Obtain licenses for private security agencies under state laws." },
      { id: "esic-reg", title: "ESIC Registration", desc: "Register for Employee State Insurance for employees health coverage." },
      { id: "copyright", title: "Copyright Registration", desc: "Protect creative works, code, books, and artistic designs legally." },
      { id: "startup-india", title: "Startup India Registration", desc: "Get DPIIT recognition, tax exemptions, and compliance benefits." },
      { id: "trademark-reg", title: "Trademark Registration", desc: "Register your brand, logo, and slogans to prevent unauthorized use." },
      { id: "udyam-msme", title: "Udyam Adhar (MSME) Registration", desc: "Register as MSME to avail government subsidies, loans, and benefits." },
      { id: "darpan-reg", title: "DARPAN Registration", desc: "NGO registration on NITI Aayog portal to acquire government grants." }
    ]
  },
  {
    id: "digital-essentials",
    title: "Digital Essentials & Creative Services",
    desc: "Establish a strong online presence and streamline operations with website development, logo design, billing & enterprise software, and custom marketing media.",
    features: [
      "Modern Responsive Design",
      "GST Invoicing Integration",
      "Custom Brand Identity"
    ],
    offerings: [
      { id: "web-dev", title: "Website Design & Development", desc: "Get custom high-performance business websites and e-commerce portals." },
      { id: "logo-design", title: "Logo & Brand Design", desc: "Create stunning corporate logos, brand guidelines, and visual assets." },
      { id: "billing-software", title: "Billing & Enterprise Software", desc: "Deploy tailored ERP, billing, inventory, and accounting software." },
      { id: "marketing-posters", title: "Marketing Posters & Videos", desc: "Design social media banners, marketing flyers, and brand videos." }
    ]
  },
  {
    id: "labour-compliance",
    title: "Labour Compliance & Law Advisory",
    desc: "Ensure complete adherence to labor regulations and employee welfare. We manage EPF, ESI, LWF, POSH, and statutory registers.",
    features: [
      "EPFO & ESIC monthly returns",
      "POSH policy implementation",
      "Statutory register maintenance"
    ],
    offerings: [
      { id: "pf-filings", title: "Provident Fund (EPFO) Filings", desc: "Monthly PF calculations, challan generation, and return filing." },
      { id: "esi-filings", title: "ESI Filings", desc: "Manage Employee State Insurance contributions and monthly filings." },
      { id: "pt-registration", title: "Professional Tax (PT) Registration & Filing", desc: "State-wise PT registration and monthly/annual return filings." },
      { id: "lwf-filings", title: "Labour Welfare Fund (LWF) Filings", desc: "Compliance and filings for state Labour Welfare Funds." },
      { id: "posh", title: "POSH Compliance", desc: "Formulate POSH policies, training, and internal committee setup." },
      { id: "statutory-registers", title: "Maintenance of Statutory Registers", desc: "Digitized upkeep of salary, attendance, and compliance registers." },
      { id: "labour-advisor", title: "Labour Law Advisor", desc: "Expert advisory on payroll compliance and labour law audits." }
    ]
  },
  {
    id: "taxation",
    title: "Taxation Services",
    desc: "Stay fully compliant with Indian direct and indirect tax laws. We manage GST registration, GST return filings, Income Tax (ITR) filings, and TDS returns.",
    features: [
      "Accurate Tax computations",
      "Timely quarterly/monthly filing",
      "Optimize deductions & refunds"
    ],
    offerings: [
      { id: "itr-filing", title: "Income Tax Filing (ITR-1 to ITR-7)", desc: "Accurate preparation and filing of ITR for individuals and corporates." },
      { id: "tax-assessment", title: "Income Tax Assessment", desc: "Represent your business in income tax assessments and scrutiny cases." },
      { id: "tax-notice", title: "Income Tax Notice Handling & Resolution", desc: "Draft responses and resolve income tax notices professionally." },
      { id: "tds-tcs", title: "TDS and TCS Return Filing", desc: "Quarterly return filing for tax deducted/collected at source." },
      { id: "revised-itr", title: "Revised ITR Return / Updated Return (ITR-U)", desc: "Correct errors or file updated returns for previous financial years." },
      { id: "gst-new", title: "GST New Registration", desc: "Get your GSTIN quickly with expert validation of details." },
      { id: "gst-filing", title: "GST Filings (GSTR-1, GSTR-3B & CMP-08)", desc: "Smooth monthly/quarterly GST return filings with input tax credit matching." },
      { id: "gst-annual", title: "GST Annual Return (GSTR-9 & GSTR-9C)", desc: "Reconciliation and filing of annual returns and audit statements." },
      { id: "gst-cancel", title: "GST Cancellation and Revocation", desc: "Handle surrender of GSTIN or revocation of cancelled registration." },
      { id: "gst-notice", title: "GST Notice Handling & Resolution", desc: "Represent and reply to tax notices, audits, and department queries." }
    ]
  },
  {
    id: "mca-corporate",
    title: "MCA & Corporate Services",
    desc: "Keep your corporate structure up-to-date and fully compliant. We handle ROC filings, address changes, board updates, and annual filings.",
    features: [
      "ROC Annual Filings",
      "Director appointment & removal",
      "MOA & AOA amendments"
    ],
    offerings: [
      { id: "mca-compliance", title: "Company, LLP & OPC Compliance Management", desc: "Full statutory compliance support for registered business entities." },
      { id: "mca-change-name", title: "Change of Company Name", desc: "Filing and approval for modifying your legal entity name." },
      { id: "mca-change-address", title: "Change in Registered Office Address", desc: "Filing INC-22 for changing your company's registered office state or address." },
      { id: "mca-transfer-shares", title: "Transfer of Shares", desc: "Execute legal share transfers and update shareholder registers." },
      { id: "mca-alteration-moa", title: "Alteration of MOA & AOA", desc: "Amned your Memorandum and Articles of Association legally with MCA." },
      { id: "mca-appointment-directors", title: "Appointment / Removal of Directors", desc: "File DIR-12 for board appointments, resignations, or removals." },
      { id: "mca-winding-up", title: "Winding Up of Company", desc: "Close and dissolve your company or LLP legally." },
      { id: "mca-revival", title: "Revival of Company", desc: "Restore struck-off companies with the NCLT." },
      { id: "mca-maintenance-registers", title: "Maintenance of Secretarial Registers", desc: "Organize and update legal registers, minutes, and share certificates." }
    ]
  },
  {
    id: "corporate-legal",
    title: "Corporate Legal Services",
    desc: "Secure your business transactions and relationships with expert drafting of contracts, legal notices, NDAs, and joint venture agreements.",
    features: [
      "Custom business contract drafts",
      "Advocate-vetted legal notices",
      "Strict confidentiality protocols"
    ],
    offerings: [
      { id: "legal-contract-drafting", title: "Contract Drafting Services", desc: "Custom drafting of professional business agreements and contracts." },
      { id: "legal-notices", title: "Legal Notices & Demand Letters", desc: "Draft and send advocate-vetted legal demand notices." },
      { id: "legal-bond-drafting", title: "Bond Drafting", desc: "Draft legally enforceable indemnity, service, or commercial bonds." },
      { id: "legal-employment-contract", title: "Employment Contract Drafting", desc: "Draft robust appointment letters and employment agreements." },
      { id: "legal-nda", title: "Non-Disclosure Agreement (NDA) Drafting", desc: "Custom NDAs to protect proprietary files, data, and business secrets." },
      { id: "legal-mou", title: "Memorandum of Understanding (MOU) Drafting", desc: "Draft MOUs to establish strategic business collaborations." },
      { id: "legal-franchise", title: "Franchise & Licensing Agreements", desc: "Draft legal terms for franchising or licensing your business." },
      { id: "legal-shareholder", title: "Shareholder & Joint Venture Agreements", desc: "Draft clear equity structures and operational terms for partners." },
      { id: "legal-document-review", title: "Legal Document Review & Modification", desc: "Vetting and updating existing contracts to protect your interests." }
    ]
  }
];

const SERVICES = SERVICE_CATEGORIES.flatMap((category) => {
  return category.offerings.map((offering) => {
    let IconComponent = FileText;
    const titleLower = offering.title.toLowerCase();
    
    if (titleLower.includes("registration") || titleLower.includes("setup") || titleLower.includes("incorporation") || titleLower.includes("company")) {
      IconComponent = Building2;
    } else if (titleLower.includes("tax") || titleLower.includes("itr") || titleLower.includes("tds") || titleLower.includes("tcs") || titleLower.includes("taxation")) {
      IconComponent = Calculator;
    } else if (titleLower.includes("gst") || titleLower.includes("filings") || titleLower.includes("annual return")) {
      IconComponent = FileText;
    } else if (titleLower.includes("compliance") || titleLower.includes("secretarial") || titleLower.includes("registers")) {
      IconComponent = ClipboardList;
    } else if (titleLower.includes("website") || titleLower.includes("digital") || titleLower.includes("software") || titleLower.includes("design") || titleLower.includes("marketing")) {
      IconComponent = Globe;
    } else if (titleLower.includes("license") || titleLower.includes("fssai") || titleLower.includes("certification") || titleLower.includes("iso")) {
      IconComponent = Award;
    } else if (titleLower.includes("agreement") || titleLower.includes("deed") || titleLower.includes("legal") || titleLower.includes("contract") || titleLower.includes("notice") || titleLower.includes("mou") || titleLower.includes("nda")) {
      IconComponent = Scale;
    } else {
      IconComponent = FileCheck;
    }
    
    return {
      id: offering.id,
      icon: IconComponent,
      title: offering.title,
      desc: offering.desc,
      category: category.title
    };
  });
});

const SERVICES_MID = Math.ceil(SERVICES.length / 2);
const SERVICES_ROW1 = SERVICES.slice(0, SERVICES_MID);
const SERVICES_ROW2 = SERVICES.slice(SERVICES_MID);

const WHY_US = [
  { icon: Zap, title: "Fast Processing", desc: "We prioritize speed without compromising accuracy — most registrations done in record time." },
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Transparent, competitive pricing with no hidden charges. Premium services at fair rates." },
  { icon: Headphones, title: "Dedicated Support", desc: "A dedicated relationship manager for every client, available Mon–Sat, 9 AM to 7 PM." },
  { icon: Lock, title: "Secure Documentation", desc: "Bank-grade encryption and strict data privacy protocols to protect your business documents." },
  { icon: ThumbsUp, title: "100% Compliance", desc: "We guarantee full statutory compliance, keeping your business safe from penalties and risk." },
];

const STATS = [
  { value: 5000, suffix: "+", label: "Satisfied Clients" },
  { value: 4, suffix: "+", label: "Years of Excellence" },
  { value: 5000, suffix: "+", label: "Registrations Done" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

const PROCESS = [
  { step: "01", title: "Consultation", desc: "Free initial consultation to understand your needs and recommend the right compliance path." },
  { step: "02", title: "Documentation", desc: "Our experts guide you through collecting and preparing all necessary documents accurately." },
  { step: "03", title: "Verification", desc: "Thorough review and verification of all submitted documents for accuracy and regulatory compliance." },
  { step: "04", title: "Registration", desc: "We handle the entire filing and registration process with the relevant government authorities." },
  { step: "05", title: "Delivery", desc: "Receive your certificates, licenses, or registrations with complete documentation and support." },
];

const INDUSTRIES = [
  { name: "Manufacturing & Engineering", icon: Building, desc: "Factory Compliance, Labour Law, Contractor Compliance", image: "photo-1565043589221-1a6fd9ae45c7" },
  { name: "Information Technology (IT & ITES)", icon: Globe, desc: "HR Compliance, Payroll Compliance, Regulatory Advisory", image: "photo-1497366216548-37526070297c" },
  { name: "Construction & Infrastructure", icon: Building2, desc: "BOCW Compliance, Labour Licensing, Vendor Audits", image: "photo-1504307651254-35680f356dfd" },
  { name: "Facility Management", icon: Users2, desc: "Contract Labour Compliance, Statutory Compliance", image: "photo-1556761175-4b46a572b786" },
  { name: "Logistics & Warehousing", icon: Briefcase, desc: "Labour Law Compliance, Payroll & Vendor Compliance", image: "photo-1578575437130-527eed3abbec" },
  { name: "Retail & E-Commerce", icon: Store, desc: "Shops & Establishment Compliance, Payroll Support", image: "photo-1441986300917-64674bd600d8" },
  { name: "Healthcare & Pharmaceuticals", icon: Heart, desc: "Regulatory Compliance, Labour & HR Compliance", image: "photo-1559757148-5c350d0d3c56" },
  { name: "Hospitality & Food Services", icon: Award, desc: "Establishment Licensing, Employee Compliance", image: "photo-1414235077428-338989a2e8c0" },
  { name: "Security Services", icon: Shield, desc: "Contract Labour Compliance, Wage & Statutory Audits", image: "photo-1504307651254-35680f356dfd" },
  { name: "Automobile & Ancillary Industries", icon: Building, desc: "Factory Compliance, Industrial Relations Support", image: "photo-1565043589221-1a6fd9ae45c7" },
  { name: "Startups, SMEs & Large Enterprises", icon: Rocket, desc: "End-to-End Compliance & Regulatory Solutions", image: "photo-1556761175-4b46a572b786" }
];

const TESTIMONIALS = [
  {
    name: "Rajesh Sharma",
    role: "Director, TechNova Pvt Ltd",
    image: "photo-1472099645785-5658abf4ff4e",
    rating: 5,
    text: "TRIOTAX handled our Pvt Ltd incorporation and GST registration seamlessly. Their team was responsive, professional, and delivered everything within the promised timeline. Highly recommend.",
  },
  {
    name: "Priya Mehta",
    role: "Founder, Spice Garden Restaurant",
    image: "photo-1494790108377-be9c29b29330",
    rating: 5,
    text: "Getting our FSSAI license and GST registration through TRIOTAX was a great experience. They simplified a complex process and kept us updated at every step. Outstanding service!",
  },
  {
    name: "Amit Verma",
    role: "CEO, ExportLink Traders",
    image: "photo-1507003211169-0a1dd7228f2d",
    rating: 5,
    text: "We needed IEC registration urgently for an export deal. The TRIOTAX team expedited the process and we received our code in just 2 days. Exceptional speed and professionalism.",
  },
];

const BLOG_POSTS = [
  {
    title: "GST Annual Return Filing: Everything You Need to Know in 2025",
    category: "GST & Tax",
    date: "December 15, 2024",
    image: "photo-1554224154-26032ffc0d07",
    excerpt: "A comprehensive guide to GSTR-9 deadlines, required documents, and penalties for non-compliance this financial year.",
    readTime: "8 min read",
  },
  {
    title: "Private Limited vs LLP: Which is Right for Your Business?",
    category: "Company Registration",
    date: "December 10, 2024",
    image: "photo-1486406146926-c627a92ad1ab",
    excerpt: "Comparing the two most popular business structures in India — benefits, compliance requirements, and tax implications.",
    readTime: "10 min read",
  },
  {
    title: "Startup India Registration: Benefits and Eligibility Criteria",
    category: "Startup",
    date: "December 5, 2024",
    image: "photo-1551288049-bebda4e38f71",
    excerpt: "How to register under DPIIT's Startup India initiative and unlock tax exemptions, funding access, and more.",
    readTime: "6 min read",
  },
  {
    title: "Understanding Trademark Registration: A Complete 2025 Guide",
    category: "Legal",
    date: "November 28, 2024",
    image: "photo-1589829545856-d10d557cf95f",
    excerpt: "Everything you need to know about protecting your brand in India — from classes to renewal and opposition proceedings.",
    readTime: "12 min read",
  },
  {
    title: "MSME Registration Benefits: Why Every Small Business Should Register",
    category: "MSME",
    date: "November 20, 2024",
    image: "photo-1454165804606-c3d57bc86b40",
    excerpt: "From collateral-free loans to government subsidies, discover the powerful advantages of MSME registration.",
    readTime: "7 min read",
  },
  {
    title: "ROC Compliance Calendar 2025: Key Deadlines You Cannot Miss",
    category: "Compliance",
    date: "November 12, 2024",
    image: "photo-1560472354-b33ff0c44a43",
    excerpt: "Stay ahead of all your ROC filing deadlines for FY 2024-25 with our comprehensive compliance calendar.",
    readTime: "5 min read",
  },
];

const FAQS_HOME = [
  { q: "How long does GST registration take?", a: "GST registration typically takes 3–7 working days from the date of application, provided all documents are in order. Our team ensures a smooth, expedited process." },
  { q: "What documents are required for Pvt Ltd Company registration?", a: "You will need PAN and Aadhaar of directors, address proof, identity proof, passport-size photographs, digital signature certificates, and proof of registered office address." },
  { q: "Is MSME registration mandatory for small businesses?", a: "MSME registration is not mandatory, but highly beneficial. Registered MSMEs receive government subsidies, priority lending, and protection against delayed payments." },
  { q: "How much does a trademark registration cost?", a: "Government fees for trademark registration start at ₹4,500 for individuals and MSMEs and ₹9,000 for companies. Our professional fees are additional and competitively priced." },
  { q: "Do you offer post-registration compliance support?", a: "Yes, we offer comprehensive compliance packages including annual ROC filings, GST returns, income tax filings, and ongoing statutory compliance management." },
  { q: "Can I register a company online through your services?", a: "Absolutely. Our entire process is digital. Submit documents online, track your application, and receive certificates electronically — no office visit required." },
];

const PRICING_PLANS = [
  {
    name: "Proprietorship Registration",
    price: "₹3,000",
    period: "starting from",
    desc: "A simple business structure suited for sole owners and individual operators.",
    features: [
      "Proprietorship Business Setup",
      "GST Registration",
      "MSME (Udyam) Registration",
      "Basic Business Compliance Guidance",
      "Account Opening Assistance"
    ],
    cta: "Get Started",
    popular: false,
    turnaround: "3-5 Working Days",
    idealFor: "Freelancers, Traders, Consultants, Small Business Owners, and Startups"
  },
  {
    name: "Private Limited / LLP Registration",
    price: "₹5,000",
    period: "starting from",
    desc: "Perfect for high-growth startups, corporate credibility, and limited liability.",
    features: [
      "Name Reservation (RUN/SPICe+)",
      "Digital Signature Certificate (DSC)",
      "Director Identification Number (DIN)",
      "Certificate of Incorporation (COI)",
      "PAN & TAN Application",
      "MOA & AOA Drafting and Filing",
      "Company Incorporation Filing with MCA",
      "Account Opening Assistance"
    ],
    cta: "Get Started",
    popular: true,
    turnaround: "5-12 Working Days",
    idealFor: "Startups, Growing Businesses, Investors, and Companies seeking limited liability protection"
  },
  {
    name: "Income Tax Return (ITR) Filing",
    price: "₹1,000",
    period: "starting from",
    desc: "Statutory income tax declaration and compliance for individuals and entities.",
    features: [
      "Income Tax Return Preparation & Filing",
      "Tax Computation Review",
      "Verification & Submission Assistance",
      "Guidance on Applicable Deductions and Exemptions",
      "Post-Filing Support"
    ],
    cta: "Get Started",
    popular: false,
    turnaround: "3-5 Working Days",
    idealFor: "Freelancers, Traders, Consultants, Small Business Owners, and Startups"
  }
];

const CAREERS = [
  { title: "GST & Tax Consultant", dept: "Taxation", type: "Full-time", location: "Delhi NCR", exp: "3+ Years" },
  { title: "Business Development Executive", dept: "Sales", type: "Full-time", location: "Mumbai", exp: "1–3 Years" },
  { title: "Digital Marketing Specialist", dept: "Marketing", type: "Full-time", location: "Remote", exp: "2+ Years" },
  { title: "Legal Research Intern", dept: "Legal", type: "Internship", location: "Mumbai", exp: "0–1 Year" },
];

const TEAM = [
  { name: "Arvind Kapoor", role: "Founder & Managing Director", image: "photo-1560250097-0b93528c311a", bio: "CA with 18 years in corporate law and regulatory compliance. Former partner at a Big4 firm.", linkedin: "#" },
  { name: "Sunita Rao", role: "Head of Taxation", image: "photo-1573496359142-b8d87734a5a2", bio: "Expert in GST, income tax, and international taxation with 14 years of advisory experience.", linkedin: "#" },
  { name: "Ravi Krishnan", role: "Company Secretary & Legal Head", image: "photo-1519085360753-af0119f7cbe7", bio: "Fellow CS with deep expertise in MCA compliance, SEBI regulations, and corporate governance.", linkedin: "#" },
  { name: "Ananya Bose", role: "Head of Client Relations", image: "photo-1580489944761-15a19d654956", bio: "MBA with 10 years in client advisory, ensuring every client receives dedicated, personalized service.", linkedin: "#" },
];

// ─── TYPES & HOOKS ────────────────────────────────────────────────────────────

type Page = "home" | "about" | "services" | "service-detail" | "pricing" | "industries" | "blog" | "contact" | "faq" | "career" | "login" | "admin" | "user";

function useCounter(target: number, active: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const steps = 60;
    const duration = 2000;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, active]);
  return count;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
      style={{ backgroundColor: "#EEF4FB", color: "#0F4C81" }}
    >
      {children}
    </div>
  );
}

function StatCounter({ value, suffix, label, light = false }: { value: number; suffix: string; label: string; light?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCounter(value, active);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl lg:text-5xl font-bold mb-2"
        style={{ fontFamily: "'Poppins', sans-serif", color: light ? "#ffffff" : "#0F4C81" }}
      >
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm" style={{ color: light ? "#93C5FD" : "#64748B" }}>
        {label}
      </div>
    </div>
  );
}

function ServiceCard({ service, onClick }: { service: typeof SERVICES[0]; onClick: () => void }) {
  const Icon = service.icon;
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
      style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-[#0F4C81]"
        style={{ backgroundColor: "#EEF4FB" }}
      >
        <Icon className="w-6 h-6 transition-colors duration-300 group-hover:text-white" style={{ color: "#0F4C81" }} />
      </div>
      <span
        className="text-xs font-semibold px-2.5 py-0.5 rounded-full w-fit mb-3"
        style={{ backgroundColor: "#F0F7FF", color: "#0F4C81" }}
      >
        {service.category}
      </span>
      <h3 className="font-bold text-sm text-gray-900 mb-2">{service.title}</h3>
      <p className="text-xs text-gray-500 mb-4 flex-1 leading-relaxed">{service.desc}</p>
      <button
        className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
        style={{ color: "#0F4C81" }}
      >
        Learn More <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-shadow duration-300"
      style={{ boxShadow: open ? "0 4px 20px rgba(15,76,129,0.1)" : "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
      >
        <span className="font-semibold text-sm text-gray-800">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: open ? "#0F4C81" : undefined }}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-gray-50">
          <p className="text-sm text-gray-600 leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function NavBar({
  activePage,
  setActivePage,
  setSelectedServiceId,
  theme,
  setTheme
}: {
  activePage: Page;
  setActivePage: (p: Page) => void;
  setSelectedServiceId?: (id: string) => void;
  theme?: "light" | "dark";
  setTheme?: (t: "light" | "dark") => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(SERVICE_CATEGORIES[0]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "About", page: "about" },
    { label: "Services", page: "services" },
    { label: "Pricing", page: "pricing" },
    { label: "Industries", page: "industries" },
    { label: "Blog", page: "blog" },
    { label: "FAQ", page: "faq" },
    { label: "Careers", page: "career" },
  ];

  const navigate = (page: Page) => {
    setActivePage(page);
    setMenuOpen(false);
    setMegaOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isDarkMode = theme === "dark";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{ backgroundColor: isDarkMode ? "rgba(0,0,0,0.97)" : "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative">
        <div className="flex items-center justify-between" style={{ height: "72px" }}>
          <button onClick={() => navigate("home")} className="flex items-center">
            <img
              src={isDarkMode ? "/Artboard.png" : "/Artboard 3.png"}
              alt="TRIOTAX Logo"
              className="h-[67px] object-contain"
            />
          </button>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map(({ label, page }) => {
              if (page === "services") {
                return (
                  <div
                    key={page}
                    className="relative py-6"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <button
                      onClick={() => navigate(page)}
                      className={`text-sm font-bold transition-colors pb-0.5 flex items-center gap-1.5 ${
                        activePage === page
                          ? "border-b-2"
                          : isDarkMode ? "text-gray-300 hover:text-white" : "text-black hover:text-gray-600"
                      }`}
                      style={
                        activePage === page
                          ? { color: isDarkMode ? "#60A5FA" : "#0F4C81", borderColor: isDarkMode ? "#60A5FA" : "#0F4C81" }
                          : {}
                      }
                    >
                      {label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                );
              }
              return (
                <button
                  key={page}
                  onClick={() => navigate(page)}
                  className={`text-sm font-bold transition-colors pb-0.5 ${
                    activePage === page
                      ? "border-b-2"
                      : isDarkMode ? "text-gray-300 hover:text-white" : "text-black hover:text-gray-600"
                  }`}
                  style={
                    activePage === page
                      ? { color: isDarkMode ? "#60A5FA" : "#0F4C81", borderColor: isDarkMode ? "#60A5FA" : "#0F4C81" }
                      : {}
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate("login")}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-all ${isDarkMode ? "hover:bg-white/10" : "hover:bg-blue-50"}`}
              style={{ borderColor: isDarkMode ? "#60A5FA" : "#0F4C81", color: isDarkMode ? "#60A5FA" : "#0F4C81" }}
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
            <button
              onClick={() => navigate("contact")}
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all ${isDarkMode ? "hover:bg-white/10" : "hover:bg-blue-50"}`}
              style={{ borderColor: isDarkMode ? "#60A5FA" : "#0F4C81", color: isDarkMode ? "#60A5FA" : "#0F4C81" }}
            >
              Contact Us
            </button>
            <button
              onClick={() => {
                setActivePage("home");
                setTimeout(() => {
                  const el = document.getElementById("calendar-booking");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-all hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#0F4C81" }}
            >
              Free Consultation
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg">
              {menuOpen ? <X className={`w-6 h-6 ${isDarkMode ? "text-white" : ""}`} /> : <Menu className={`w-6 h-6 ${isDarkMode ? "text-white" : ""}`} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={`lg:hidden border-t py-4 ${isDarkMode ? "bg-black border-zinc-800" : "bg-white border-gray-100"}`}>
            {navLinks.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                className={`block w-full text-left px-4 py-3 text-sm font-bold rounded-lg mx-2 ${isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-black hover:bg-gray-100"}`}
                style={{ width: "calc(100% - 16px)", color: activePage === page ? (isDarkMode ? "#60A5FA" : "#0F4C81") : undefined, fontWeight: 700 }}
              >
                {label}
              </button>
            ))}
            <div className="px-4 pt-3 flex flex-col gap-3">
              <button
                onClick={() => navigate("login")}
                className={`flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold rounded-xl border transition-all ${isDarkMode ? "hover:bg-white/10" : "hover:bg-blue-50"}`}
                style={{ borderColor: isDarkMode ? "#60A5FA" : "#0F4C81", color: isDarkMode ? "#60A5FA" : "#0F4C81" }}
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>
              <button
                onClick={() => {
                  setActivePage("home");
                  setMenuOpen(false);
                  setTimeout(() => {
                    const el = document.getElementById("calendar-booking");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="w-full py-3 text-sm font-semibold rounded-xl text-white cursor-pointer"
                style={{ backgroundColor: "#0F4C81" }}
              >
                Free Consultation
              </button>
            </div>
          </div>
        )}


        {/* Blur backdrop overlay when megamenu is open */}
        {megaOpen && (
          <div
            className="fixed inset-0 z-40 animate-in fade-in duration-200"
            style={{
              top: "72px",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
            onClick={() => setMegaOpen(false)}
          />
        )}

        {/* Megamenu dropdown positioned under nav bar */}
        {megaOpen && (
          <div
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
            className="absolute left-6 right-6 top-[72px] bg-white dark:bg-[#0c1a30] rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl p-6 grid grid-cols-12 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ minHeight: "450px" }}
          >
            {/* Left Panel: Categories (col-span-3) */}
            <div className="col-span-3 border-r border-gray-100 pr-4 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider block mb-2 uppercase">Categories</span>
              {SERVICE_CATEGORIES.map((cat) => {
                const isActive = activeCategory.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setActiveCategory(cat)}
                    onClick={() => navigate("services")}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isActive
                        ? "bg-[#EEF4FB] text-[#0F4C81]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{cat.title}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#0F4C81]" />}
                  </button>
                );
              })}
            </div>

            {/* Center Panel: Subcategories Offerings (col-span-6) */}
            <div className="col-span-6 px-2 overflow-y-auto max-h-[500px] pr-4">
              <span className="text-[10px] font-bold text-[#0F4C81] tracking-wider block mb-4 uppercase">
                {activeCategory.title} Offerings
              </span>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {activeCategory.offerings.map((offering) => (
                  <button
                    key={offering.id}
                    onClick={() => {
                      setSelectedServiceId(offering.id);
                      setActivePage("service-detail");
                      setMegaOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-semibold text-xs text-gray-900 group-hover:text-[#0F4C81] transition-colors mb-1">
                      {offering.title}
                    </div>
                    <div className="text-[10px] text-gray-400 leading-normal line-clamp-2">
                      {offering.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel: Overview (col-span-3) */}
            <div className="col-span-3 bg-[#F8FAFC] dark:bg-zinc-900/50 rounded-2xl p-5 flex flex-col border border-gray-50 dark:border-zinc-800 overflow-hidden">
              <div>
                <span className="text-[10px] font-bold text-gray-400 tracking-wider block mb-2 uppercase">Category Overview</span>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white mb-2">{activeCategory.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed mb-3">{activeCategory.desc}</p>
              </div>
              <div className="rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-zinc-700 flex-shrink-0">
                <img
                  src={`/mega-menu/${activeCategory.id}.jpg`}
                  alt={activeCategory.title}
                  className="w-full h-[120px] object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="border-t border-gray-100 dark:border-zinc-700 pt-3 mt-auto">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider block mb-3 uppercase">Category Features</span>
                <ul className="space-y-2">
                  {activeCategory.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] font-medium text-gray-600 dark:text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ setActivePage, setSelectedServiceId }: { setActivePage: (p: Page) => void; setSelectedServiceId: (id: string) => void }) {
  const [email, setEmail] = useState("");
  const navigate = (page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToService = (id: string) => {
    setSelectedServiceId(id);
    setActivePage("service-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ backgroundColor: "#0a1628" }} className="text-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 pb-8">

        {/* Top Row: Company Info + Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">

          {/* Company Info - Left */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/Artboard.png"
                alt="TRIOTAX Logo"
                className="h-[60px] object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              TRIOTAX is a modern financial and business support services platform offering company registration, tax filing, and compliance management solutions.
            </p>

            <h4 className="font-bold text-sm mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Follow us on</h4>
            <div className="flex gap-3 mb-8">
              {[Facebook, Instagram, Twitter, Linkedin, Globe].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-blue-600"
                  style={{ backgroundColor: "#1a2d4a" }}
                >
                  <Icon className="w-4 h-4 text-gray-300" />
                </div>
              ))}
            </div>

            <h4 className="font-bold text-sm mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">support@triotax.in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 9591578333</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 6361556801</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Corp Office: #27, Sriranga Complex, 2nd Floor, 2nd Main Rd, Dr.MC Modi Hospital Rd, West of Chord Rd, 2nd Stage, Bengaluru-560086</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Branch Office: #02, Venkateshwara Sawmill Complex, Court Rd, Vinayakanagara, Doddballapura, Bengaluru Rural-561203</span>
              </div>
            </div>
          </div>

          {/* Services Grid - Right */}
          <div className="lg:col-span-8">
            <h3 className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-6">Our Products & Services</h3>

            {/* Row 1: First 4 categories — Licensing spans 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 mb-8">

              {/* Col 1: Business Startup Setup */}
              <div>
                <h4 className="font-bold text-[11px] text-white mb-3 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>{SERVICE_CATEGORIES[0].title}</h4>
                <ul className="space-y-1.5">
                  {SERVICE_CATEGORIES[0].offerings.map((offering) => (
                    <li key={offering.id}>
                      <button onClick={() => goToService(offering.id)} className="text-gray-400 text-[11px] hover:text-white transition-colors text-left leading-snug">
                        {offering.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2: Licensing & Registration — Column 1 of 2 */}
              <div>
                <h4 className="font-bold text-[11px] text-white mb-3 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Licensing &amp; Registration Services</h4>
                <ul className="space-y-1.5">
                  {SERVICE_CATEGORIES[1].offerings.slice(0, 10).map((offering) => (
                    <li key={offering.id}>
                      <button onClick={() => goToService(offering.id)} className="text-gray-400 text-[11px] hover:text-white transition-colors text-left leading-snug">
                        {offering.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Licensing & Registration — Column 2 of 2 (continuation, no heading) */}
              <div>
                <h4 className="font-bold text-[11px] text-transparent mb-3 leading-tight select-none" style={{ fontFamily: "'Poppins', sans-serif" }}>–</h4>
                <ul className="space-y-1.5">
                  {SERVICE_CATEGORIES[1].offerings.slice(10).map((offering) => (
                    <li key={offering.id}>
                      <button onClick={() => goToService(offering.id)} className="text-gray-400 text-[11px] hover:text-white transition-colors text-left leading-snug">
                        {offering.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4: Digital Essentials & Creative Services */}
              <div>
                <h4 className="font-bold text-[11px] text-white mb-3 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>{SERVICE_CATEGORIES[2].title}</h4>
                <ul className="space-y-1.5">
                  {SERVICE_CATEGORIES[2].offerings.map((offering) => (
                    <li key={offering.id}>
                      <button onClick={() => goToService(offering.id)} className="text-gray-400 text-[11px] hover:text-white transition-colors text-left leading-snug">
                        {offering.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 5: Labour Compliance & Law Advisory */}
              <div>
                <h4 className="font-bold text-[11px] text-white mb-3 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>{SERVICE_CATEGORIES[3].title}</h4>
                <ul className="space-y-1.5">
                  {SERVICE_CATEGORIES[3].offerings.map((offering) => (
                    <li key={offering.id}>
                      <button onClick={() => goToService(offering.id)} className="text-gray-400 text-[11px] hover:text-white transition-colors text-left leading-snug">
                        {offering.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Row 2: Last 3 categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
              {SERVICE_CATEGORIES.slice(4).map((cat) => (
                <div key={cat.id}>
                  <h4 className="font-bold text-[11px] text-white mb-3 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>{cat.title}</h4>
                  <ul className="space-y-1.5">
                    {cat.offerings.map((offering) => (
                      <li key={offering.id}>
                        <button
                          onClick={() => goToService(offering.id)}
                          className="text-gray-400 text-[11px] hover:text-white transition-colors text-left leading-snug"
                        >
                          {offering.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="w-full h-[2px] mb-6" style={{ background: "linear-gradient(90deg, #0F4C81, #2563EB, #0F4C81)" }} />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 TRIOTAX ADVISORS PRIVATE LIMITED. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <button key={link} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function HomePage({ setActivePage, setSelectedServiceId }: { setActivePage: (p: Page) => void; setSelectedServiceId: (id: string) => void }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed
  const currentDate = today.getDate(); // 1-indexed
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthName = monthNames[currentMonth];

  // First day of current month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const [bookingDate, setBookingDate] = useState<number | null>(currentDate);
  const [bookingName, setBookingName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [news, setNews] = useState<any[]>([
    {
      title: "Union Budget 2026: Key Tax Reforms & Financial Outlook",
      pubDate: "2026-07-04 10:00:00",
      description: "Indian government announces new rationalization of personal income tax slabs and incentives for start-ups.",
      link: "https://economictimes.indiatimes.com",
      thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f"
    },
    {
      title: "GST Council Reconciles Tax Rates on Essential Services & Logistics",
      pubDate: "2026-07-03 14:30:00",
      description: "Latest amendments aims to lower compliance overhead for small and medium enterprises (MSMEs).",
      link: "https://economictimes.indiatimes.com",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
    },
    {
      title: "MSME Loans: Public Sector Banks Ease Collateral Guidelines",
      pubDate: "2026-07-02 09:15:00",
      description: "New credit guarantee scheme to boost digital loan originations for manufacturing startups.",
      link: "https://economictimes.indiatimes.com",
      thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e"
    }
  ]);
  const [newsLoading, setNewsLoading] = useState(false);

  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://economictimes.indiatimes.com/news/economy/finance/rssfeeds/1286551815.xml");
      const data = await res.json();
      if (data && data.items) {
        setNews(data.items.slice(0, 3));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const navigate = (page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const suggestions = searchQuery.trim()
    ? SERVICES.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 60%, #1565c0 100%)",
          paddingTop: "56px",
          paddingBottom: "56px",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute rounded-full border border-white/10"
            style={{ width: 600, height: 600, top: "-200px", right: "-200px" }}
          />
          <div
            className="absolute rounded-full border border-white/10"
            style={{ width: 400, height: 400, bottom: "-150px", left: "-100px" }}
          />
          <div
            className="absolute rounded-full"
            style={{ width: 200, height: 200, top: "40%", right: "20%", backgroundColor: "rgba(255,255,255,0.03)" }}
          />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative text-left">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="text-white lg:col-span-7">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
              >
                <Check className="w-3.5 h-3.5 text-green-400" />
                India's Most Trusted Compliance Partner
              </div>
              <h1
                className="text-4xl lg:text-5xl xl:text-[54px] font-bold leading-tight mb-6"
                style={{ fontFamily: "'Poppins', sans-serif", lineHeight: 1.12 }}
              >
                Your Trusted Partner for{" "}
                <span style={{ color: "#FFD700" }}>Business Compliance</span>{" "}
                & Financial Growth
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
                From GST registration to company incorporation — we simplify India's regulatory landscape so you can focus on growing your business.
              </p>

              {/* Search Bar */}
              <div className="relative mb-8 max-w-lg z-20">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search services (e.g. GST Registration, Trademark...)"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 pl-12 text-white placeholder-blue-200 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-blue-400/50 transition-all text-sm backdrop-blur-md"
                  />
                  <Search className="w-5 h-5 absolute left-4 text-blue-200" />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setShowSuggestions(false);
                      }}
                      className="absolute right-4 text-blue-200 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Suggestions List */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0c1a30] border border-gray-100 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-30 max-h-[250px] overflow-y-auto">
                    {suggestions.map((s) => {
                      const SIcon = s.icon;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSelectedServiceId(s.id);
                            setActivePage("service-detail");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="w-full text-left px-5 py-3 hover:bg-blue-50 dark:hover:bg-[#060e1d] flex items-center gap-3 transition-colors group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#EEF4FB] dark:bg-[#060e1d] flex items-center justify-center">
                            <SIcon className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
                          </div>
                          <div>
                            <span className="block font-semibold text-xs text-gray-900 dark:text-white group-hover:text-[#0F4C81] dark:group-hover:text-blue-400 transition-colors">
                              {s.title}
                            </span>
                            <span className="block text-[10px] text-gray-400 dark:text-zinc-400">
                              {s.category}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => {
                    const el = document.getElementById("calendar-booking");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg cursor-pointer bg-white text-[#0F4C81]"
                >
                  <Phone className="w-4 h-4" />
                  Get Free Consultation
                </button>
                <button
                  onClick={() => navigate("services")}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border transition-all hover:bg-white/10 cursor-pointer border-white/40 text-white"
                >
                  Explore Services <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-8">
                {[
                  { val: "5000+", label: "Happy Clients" },
                  { val: "12+", label: "Years Experience" },
                  { val: "98%", label: "Satisfaction Rate" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#FFD700" }} />
                    <div>
                      <div className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {b.val}
                      </div>
                      <div className="text-xs text-blue-200">{b.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block lg:col-span-5">
              <div className="rounded-2xl overflow-hidden" style={{ height: "500px" }}>
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=720&h=500&fit=crop&auto=format"
                  alt="Professional team in a business compliance consultation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(to top, rgba(15,76,129,0.3) 0%, transparent 60%)" }} />
              </div>

              {/* Glass card — completion */}
              <div
                className="absolute -left-8 bottom-16 rounded-2xl p-4 flex items-center gap-3"
                style={{
                  backdropFilter: "blur(16px)",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                }}
              >
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Registration Complete
                  </div>
                  <div className="text-blue-100 text-xs">GST Certificate Issued ✓</div>
                </div>
              </div>

              {/* Glass card — rating */}
              <div
                className="absolute -right-6 top-10 rounded-2xl p-4"
                style={{
                  backdropFilter: "blur(16px)",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                }}
              >
                <div className="flex items-center gap-1 mb-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-white text-sm font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  4.9 / 5 Rating
                </div>
                <div className="text-blue-200 text-xs">From 1,200+ Reviews</div>
              </div>

              {/* Glass card — clients */}
              <div
                className="absolute left-1/2 -bottom-5 -translate-x-1/2 rounded-2xl px-6 py-3 flex items-center gap-4"
                style={{
                  backdropFilter: "blur(16px)",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                }}
              >
                <div className="flex -space-x-2">
                  {["photo-1472099645785-5658abf4ff4e", "photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d"].map((id, i) => (
                    <img
                      key={i}
                      src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&auto=format`}
                      alt="Client"
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <span className="text-white text-sm font-semibold">5,000+ Clients Trust Us</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <SectionBadge>Our Services</SectionBadge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Compliance Solutions
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              From tax registrations to legal compliance, we offer end-to-end services to keep your business fully protected and legally sound.
            </p>
          </div>
        <div className="space-y-8 overflow-hidden py-4">
          {/* Row 1: Left to Right */}
          <div className="relative w-full overflow-hidden flex gap-5 mask-gradient">
            <div className="flex gap-5 shrink-0 animate-marquee-ltr-slow">
              {SERVICES_ROW1.map((service) => (
                <div key={`${service.id}-row1-1`} className="w-[300px] shrink-0">
                  <ServiceCard
                    service={service}
                    onClick={() => { setSelectedServiceId(service.id); navigate("service-detail"); }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-5 shrink-0 animate-marquee-ltr-slow" aria-hidden="true">
              {SERVICES_ROW1.map((service) => (
                <div key={`${service.id}-row1-2`} className="w-[300px] shrink-0">
                  <ServiceCard
                    service={service}
                    onClick={() => { setSelectedServiceId(service.id); navigate("service-detail"); }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left */}
          <div className="relative w-full overflow-hidden flex gap-5 mask-gradient">
            <div className="flex gap-5 shrink-0 animate-marquee-rtl-slow">
              {SERVICES_ROW2.map((service) => (
                <div key={`${service.id}-row2-1`} className="w-[300px] shrink-0">
                  <ServiceCard
                    service={service}
                    onClick={() => { setSelectedServiceId(service.id); navigate("service-detail"); }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-5 shrink-0 animate-marquee-rtl-slow" aria-hidden="true">
              {SERVICES_ROW2.map((service) => (
                <div key={`${service.id}-row2-2`} className="w-[300px] shrink-0">
                  <ServiceCard
                    service={service}
                    onClick={() => { setSelectedServiceId(service.id); navigate("service-detail"); }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
          <div className="text-center mt-10">
            <button
              onClick={() => navigate("services")}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#0F4C81" }}
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionBadge>Why Choose TRIOTAX</SectionBadge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                The TRIOTAX Advantage — Where Expertise Meets Efficiency
              </h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                We combine deep regulatory expertise with technology-driven processes to deliver compliance services that are fast, accurate, and completely hassle-free.
              </p>
              <div className="space-y-4 mb-8">
                {["ISO 9001:2015 Certified Firm"].map((badge) => (
                  <div key={badge} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#0F4C81" }} />
                    <span className="text-sm font-medium text-gray-700">{badge}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("about")}
                className="flex items-center gap-2 font-semibold text-sm"
                style={{ color: "#0F4C81" }}
              >
                Learn About Us <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative overflow-hidden" style={{ height: "400px" }}>
              <div className="flex flex-col gap-3 animate-marquee-up">
                {/* First set of items */}
                {WHY_US.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={`${title}-1`}
                    className="bg-white rounded-lg p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
                    style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "#EEF4FB" }}>
                      <Icon className="w-5 h-5" style={{ color: "#0F4C81" }} />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 mb-2">{title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
                {/* Duplicate set for continuous loop */}
                {WHY_US.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={`${title}-2`}
                    className="bg-white rounded-lg p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
                    style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "#EEF4FB" }}>
                      <Icon className="w-5 h-5" style={{ color: "#0F4C81" }} />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 mb-2">{title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 50%, #1565c0 100%)" }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Numbers That Speak for Themselves</h2>
            <p className="text-blue-200">A decade of trust, delivered one compliance at a time.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {STATS.map(({ value, suffix, label }) => (
              <StatCounter key={label} value={value} suffix={suffix} label={label} light />
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="py-20" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <SectionBadge>How It Works</SectionBadge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Simple 5-Step Process
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From initial consultation to final delivery — we handle everything with precision and full transparency.
            </p>
          </div>
          <div className="relative">
            <div
              className="hidden lg:block absolute h-0.5 z-0 flow-line"
              style={{ top: "40px", left: "10%", right: "10%" }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
              {PROCESS.map(({ step, title, desc }, idx) => (
                <div key={step} className="text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: idx % 2 === 0 ? "#0F4C81" : "#EEF4FB" }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ fontFamily: "'Poppins', sans-serif", color: idx % 2 === 0 ? "#ffffff" : "#0F4C81" }}
                    >
                      {step}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <SectionBadge>Industries We Serve</SectionBadge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Compliance Solutions Across Every Sector
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {INDUSTRIES.slice(0, 5).map(({ name, desc, image }) => (
              <div key={name} className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ height: "220px" }}>
                <img
                  src={`https://images.unsplash.com/${image}?w=300&h=220&fit=crop&auto=format`}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,76,129,0.85) 0%, rgba(15,76,129,0.2) 60%, transparent 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300 group-hover:opacity-0">
                  <h3 className="font-bold text-sm">{name}</h3>
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ backgroundColor: "rgba(15,76,129,0.92)" }}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-white text-sm mb-2">{name}</h3>
                    <p className="text-blue-100 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {INDUSTRIES.slice(5, 9).map(({ name, desc, image }) => (
              <div key={name} className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ height: "180px" }}>
                <img
                  src={`https://images.unsplash.com/${image}?w=300&h=180&fit=crop&auto=format`}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,76,129,0.85) 0%, transparent 60%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300 group-hover:opacity-0">
                  <h3 className="font-bold text-sm">{name}</h3>
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ backgroundColor: "rgba(15,76,129,0.92)" }}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-white text-sm mb-2">{name}</h3>
                    <p className="text-blue-100 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => navigate("industries")}
              className="inline-flex items-center gap-2 font-semibold text-sm"
              style={{ color: "#0F4C81" }}
            >
              Explore All Industries <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>



      {/* BLOG PREVIEW */}
      <section className="py-20 bg-white dark:bg-[#060e1d] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <SectionBadge>Latest Insights</SectionBadge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Compliance & Financial News
              </h2>
            </div>
            <div>
              <button
                onClick={fetchNews}
                disabled={newsLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#0F4C81] dark:text-blue-400 cursor-pointer disabled:opacity-50 transition-colors border border-zinc-200/40 dark:border-zinc-700/40"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", newsLoading && "animate-spin")} />
                {newsLoading ? "Refreshing..." : "Refresh News"}
              </button>
            </div>
          </div>

          <div className="relative w-full overflow-hidden flex gap-5 mask-gradient py-2">
            <div className="flex gap-5 shrink-0 animate-marquee-ltr">
              {news.map((item, idx) => {
                const fallbackImages = [
                  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
                  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
                  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e"
                ];
                const image = item.thumbnail || item.enclosure?.link || fallbackImages[idx % 3];

                return (
                  <a
                    key={`${item.title}-${idx}-marquee-1`}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[320px] shrink-0 bg-white dark:bg-[#0c1a30] rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800/80 hover:shadow-xl transition-all duration-300 group flex flex-col text-left"
                    style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
                  >
                    <div className="relative overflow-hidden" style={{ height: "180px" }}>
                      <img
                        src={`${image.split('?')[0]}?w=320&h=180&fit=crop&auto=format`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
                          style={{ backgroundColor: "#0F4C81" }}
                        >
                          Indiatimes
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(item.pubDate || Date.now()).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                          {item.description ? item.description.replace(/<[^>]*>/g, '') : "Read full financial updates on the official portal."}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C81] dark:text-blue-400 mt-4 group-hover:underline">
                        Read Full Article <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
            <div className="flex gap-5 shrink-0 animate-marquee-ltr" aria-hidden="true">
              {news.map((item, idx) => {
                const fallbackImages = [
                  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
                  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
                  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e"
                ];
                const image = item.thumbnail || item.enclosure?.link || fallbackImages[idx % 3];

                return (
                  <a
                    key={`${item.title}-${idx}-marquee-2`}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[320px] shrink-0 bg-white dark:bg-[#0c1a30] rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800/80 hover:shadow-xl transition-all duration-300 group flex flex-col text-left"
                    style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
                  >
                    <div className="relative overflow-hidden" style={{ height: "180px" }}>
                      <img
                        src={`${image.split('?')[0]}?w=320&h=180&fit=crop&auto=format`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
                          style={{ backgroundColor: "#0F4C81" }}
                        >
                          Indiatimes
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(item.pubDate || Date.now()).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                          {item.description ? item.description.replace(/<[^>]*>/g, '') : "Read full financial updates on the official portal."}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C81] dark:text-blue-400 mt-4 group-hover:underline">
                        Read Full Article <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-2">
              <SectionBadge>FAQs</SectionBadge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Have more questions? Our compliance experts are always ready to help you navigate the complexities of business registration and legal compliance.
              </p>
              <button
                onClick={() => navigate("contact")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "#0F4C81" }}
              >
                <Phone className="w-4 h-4" />
                Talk to an Expert
              </button>
            </div>
            <div className="lg:col-span-3 space-y-3">
              {FAQS_HOME.map(({ q, a }) => (
                <FAQItem key={q} q={q} a={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - CALENDAR BOOKING */}
      <section
        id="calendar-booking"
        className="py-24 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/75 z-0 pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & Details */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-white bg-zinc-900/60 border border-zinc-700/50 uppercase">
                  Get In Touch
                </span>
              </div>

              <h2
                className="text-4xl lg:text-5xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Compliance Made Simple – From Day One
              </h2>

              <p className="text-zinc-300 text-base lg:text-lg leading-relaxed max-w-xl">
                Join 500+ businesses across India that trust TRIOTAX for company registration, GST filing, trademark protection, and end-to-end compliance.
              </p>

              {/* Contact Information Details */}
              <div className="space-y-4 pt-4">
                
                {/* Email block */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Email</span>
                    <span className="text-white text-sm font-medium">support@triotax.in</span>
                  </div>
                </div>

                {/* Phone block */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Phone</span>
                    <span className="text-white text-sm font-medium">+91 9591578333 / +91 6361556801</span>
                  </div>
                </div>

                {/* Address block */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Address</span>
                    <span className="text-white text-sm font-medium">Bengaluru, Karnataka, India</span>
                  </div>
                </div>
              </div>

              {/* Checkbox badges at the bottom */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-zinc-850">
                <div className="flex items-center gap-2 text-white text-sm">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                  Free Consultation
                </div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                  No Hidden Charges
                </div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                  Pan-India Service
                </div>
              </div>
            </div>

            {/* Right Column: Calendar Widget */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <span className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-4">
                Book a Slot
              </span>

              {/* Calendar Card */}
              <div className="w-full max-w-[420px] bg-[#090e1a]/95 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-left">
                
                {/* Header info */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{currentMonthName} {currentYear}</h3>
                    <p className="text-zinc-400 text-xs">30 min consultation</p>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-emerald-400 text-xs font-semibold">Available</span>
                  </div>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 text-center text-zinc-500 text-[10px] font-bold tracking-wider mb-3">
                  <span>SUN</span>
                  <span>MON</span>
                  <span>TUE</span>
                  <span>WED</span>
                  <span>THU</span>
                  <span>FRI</span>
                  <span>SAT</span>
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-y-2 text-center text-sm font-medium mb-6">
                  {/* Empty offsets for the start of the current month */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <span key={`empty-${i}`} />
                  ))}
                  
                  {/* Render days in month */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isSelected = bookingDate === day;
                    return (
                      <button
                        key={day}
                        onClick={() => setBookingDate(day)}
                        className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                            : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Booking form fields */}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />

                  <button
                    onClick={() => {
                      if (!bookingDate) {
                        alert("Please select a date from the calendar first.");
                        return;
                      }
                      if (!bookingName.trim()) {
                        alert("Please enter your name.");
                        return;
                      }
                      const message = encodeURIComponent(`Hello, I am ${bookingName}. I would like to book a consultation on ${bookingDate} ${currentMonthName} ${currentYear}.`);
                      window.open(`https://wa.me/919591578333?text=${message}`, "_blank");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    Book Free Consultation <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

function AboutPage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  const navigate = (page: Page) => { setActivePage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div>
      {/* Hero */}
      <section
        className="py-20 text-white"
        style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 100%)", paddingTop: "80px" }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <SectionBadge>About TRIOTAX Compliance</SectionBadge>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              4 Years of Simplifying Compliance for Indian Businesses
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Founded in 2022, TRIOTAX Compliance Advisory has grown from a boutique taxation firm into India's most trusted end-to-end compliance partner, serving 5,000+ businesses across 20+ sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-2xl overflow-hidden" style={{ height: "440px" }}>
              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=700&h=440&fit=crop&auto=format"
                alt="TRIOTAX Compliance team at work"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <SectionBadge>Our Story</SectionBadge>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Built on Trust, Driven by Excellence
              </h2>
              <p className="text-gray-500 leading-relaxed mb-5">
                TRIOTAX Compliance was founded by Mr. Prem and Mr. Dhananjay K. R., two young entrepreneurs with a shared vision of simplifying business compliance and branding for Indian businesses. Their goal was to create a one-stop solution where entrepreneurs could access reliable, affordable, and hassle-free business registration, compliance, taxation, and branding services under one roof.
              </p>
              <p className="text-gray-500 leading-relaxed mb-5">
                What started as a small consultancy in Bengaluru, primarily offering GST advisory services through client referrals and a strong commitment to quality, has evolved into a trusted business consultancy serving startups, SMEs, and growing enterprises across India.
              </p>
              <p className="text-gray-500 leading-relaxed mb-5">
                Today, TRIOTAX provides comprehensive solutions, including business registrations, statutory licenses, taxation, accounting, regulatory compliance, intellectual property services, and digital branding, enabling entrepreneurs to focus on growing their businesses while we take care of the legal and compliance requirements.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                At TRIOTAX, we believe that every business—whether a startup, small business, or established enterprise—deserves access to expert guidance and professional compliance support. This belief drives our commitment to delivering transparent, timely, and customer-centric services that build long-term relationships based on trust and excellence.
              </p>
              <button
                onClick={() => navigate("contact")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-sm"
                style={{ backgroundColor: "#0F4C81" }}
              >
                Work With Us <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-20" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <SectionBadge>What Drives Us</SectionBadge>
            <h2 className="text-3xl font-bold text-gray-900">Mission, Vision & Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Our Mission", text: "To simplify the regulatory journey for every Indian business — startup or enterprise — with accurate, timely, and affordable compliance solutions." },
              { icon: Lightbulb, title: "Our Vision", text: "To become India's most trusted compliance ecosystem, where every entrepreneur has seamless access to expert legal and financial advisory." },
              { icon: Heart, title: "Our Values", text: "Integrity in every interaction, excellence in every filing, transparency in every conversation, and genuine care for every client's growth." },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 border border-gray-100 text-center"
                style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#EEF4FB" }}>
                  <Icon className="w-7 h-7" style={{ color: "#0F4C81" }} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0F4C81 0%, #1565c0 100%)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {STATS.map(({ value, suffix, label }) => (
              <StatCounter key={label} value={value} suffix={suffix} label={label} light />
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}

// ─── SERVICES PAGE ────────────────────────────────────────────────────────────

function ServicesPage({ setActivePage, setSelectedServiceId }: { setActivePage: (p: Page) => void; setSelectedServiceId: (id: string) => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = [
    "All",
    "Business Startup Setup",
    "Licensing & Registration Services",
    "Digital Essentials & Creative Services",
    "Labour Compliance & Law Advisory",
    "Taxation Services",
    "MCA & Corporate Services",
    "Corporate Legal Services"
  ];
  const filtered = activeCategory === "All" ? SERVICES : SERVICES.filter((s) => s.category === activeCategory);

  return (
    <div>
      <section
        className="py-16 text-white"
        style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 100%)" }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionBadge>All Services</SectionBadge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Complete Service Portfolio
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Over 50+ specialized compliance, legal, corporate, and digital services designed to keep your business fully registered, licensed, and protected at every stage of growth.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                style={{
                  backgroundColor: activeCategory === cat ? "#0F4C81" : "#ffffff",
                  color: activeCategory === cat ? "#ffffff" : "#64748B",
                  border: activeCategory === cat ? "1px solid #0F4C81" : "1px solid #e2e8f0",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setActivePage("service-detail");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div
            className="rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8"
            style={{ background: "linear-gradient(135deg, #0F4C81 0%, #1565c0 100%)" }}
          >
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                Not Sure Which Service You Need?
              </h2>
              <p className="text-blue-100 max-w-lg">
                Our experts will assess your business requirements and recommend the exact compliance path — free of charge.
              </p>
            </div>
            <button
              onClick={() => { setActivePage("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg"
              style={{ backgroundColor: "#ffffff", color: "#0F4C81" }}
            >
              <Phone className="w-4 h-4" />
              Free Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── SERVICE DETAIL PAGE ──────────────────────────────────────────────────────

function ServiceDetailPage({
  setActivePage,
  selectedServiceId,
  setSelectedServiceId,
}: {
  setActivePage: (p: Page) => void;
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
}) {
  const service = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const Icon = service.icon;

  const isGst = service.id === "gst-registration" || service.title.toLowerCase().includes("gst");
  const isWebDev = service.id === "web-dev";
  const isLogoDesign = service.id === "logo-design";
  const isBilling = service.id === "billing-software";
  const isMarketing = service.id === "marketing-posters";
  const isCompany = service.title.toLowerCase().includes("company") || service.title.toLowerCase().includes("registration") || service.title.toLowerCase().includes("setup") || service.title.toLowerCase().includes("incorporation");
  const isShopAct = service.id === "shop-establishment";
  const isTradeLicense = service.id === "trade-license";
  const isClra = service.id === "clra-license";
  const isBocw = service.id === "bocw";
  const isFssai = service.id === "fssai-food";
  const isDsc = service.id === "dsc-sig";
  const isIec = service.id === "iec-code";
  const isDrug = service.id === "drug-license";
  const isIcegate = service.id === "icegate";
  const isIso = service.id === "iso-cert";
  const isPf = service.id === "pf-reg" || service.id === "pf-filings";
  const isPsara = service.id === "psara";
  const isEsic = service.id === "esic-reg" || service.id === "esi-filings";
  const isPt = service.id === "pt-registration";
  const isLwf = service.id === "lwf-filings";
  const isPosh = service.id === "posh";
  const isRegisters = service.id === "statutory-registers";
  const isAdvisor = service.id === "labour-advisor";
  const isItr = service.id === "itr-filing";
  const isAssessment = service.id === "tax-assessment";
  const isNotice = service.id === "tax-notice";
  const isTds = service.id === "tds-tcs";
  const isRevisedItr = service.id === "revised-itr";
  const isGstNew = service.id === "gst-new";
  const isGstFiling = service.id === "gst-filing";
  const isGstAnnual = service.id === "gst-annual";
  const isGstCancel = service.id === "gst-cancel";
  const isGstNotice = service.id === "gst-notice";
  const isMcaCompliance = service.id === "mca-compliance";
  const isMcaName = service.id === "mca-change-name";
  const isMcaAddress = service.id === "mca-change-address";
  const isMcaShares = service.id === "mca-transfer-shares";
  const isMcaMoa = service.id === "mca-alteration-moa";
  const isMcaDirectors = service.id === "mca-appointment-directors";
  const isMcaWinding = service.id === "mca-winding-up";
  const isMcaRevival = service.id === "mca-revival";
  const isMcaRegisters = service.id === "mca-maintenance-registers";
  const isContractDrafting = service.id === "legal-contract-drafting";
  const isLegalNotices = service.id === "legal-notices";
  const isBondDrafting = service.id === "legal-bond-drafting";
  const isEmploymentContract = service.id === "legal-employment-contract";
  const isNda = service.id === "legal-nda";
  const isMou = service.id === "legal-mou";
  const isFranchise = service.id === "legal-franchise";
  const isShareholder = service.id === "legal-shareholder";
  const isDocumentReview = service.id === "legal-document-review";
  const isCopyright = service.id === "copyright";
  const isStartup = service.id === "startup-india";
  const isTrademark = service.id === "trademark-reg";
  const isUdyam = service.id === "udyam-msme";
  const isDarpan = service.id === "darpan-reg";
  const isProprietorship = service.id === "proprietorship";
  const isPartnership = service.id === "partnership";
  const isPvtLtd = service.id === "pvt-ltd";
  const isLLP = service.id === "llp";
  const isPublicLtd = service.id === "public-ltd";
  const isOPC = service.id === "opc";
  const isSubsidiary = service.id === "subsidiary";
  const isSection8 = service.id === "section-8";
  const isTrust = service.id === "trust-reg";

  const whatIsTitle = isGst 
    ? "What is GST Registration?" 
    : isWebDev
    ? "Website Design & Development"
    : isLogoDesign
    ? "Logo & Brand Design"
    : isBilling
    ? "Billing & Enterprise Software"
    : isMarketing
    ? "Marketing Posters & Videos"
    : `What is ${service.title}?`;

  const whatIsDesc = isProprietorship
    ? "Dreaming of launching your own business with absolute control, minimal compliance, and low startup costs? A Sole Proprietorship Registration is the perfect launchpad for freelancers, local retailers, consultants, and small business owners looking to establish their market identity quickly. Under this framework, there is no legal distinction between the owner (proprietor) and the business entity. The business operates under the personal legal identity of the owner, meaning all profits belong entirely to you — and similarly, all financial liabilities are yours to fulfill. In India, it is not governed by a singular dedicated act; rather, its legal recognition is established through various tax and government registrations like GST, Udyam (MSME), and state-specific licenses."
    : isWebDev
    ? "In the modern digital marketplace, your website serves as your company's virtual corporate headquarters, the anchor of your brand identity, and your primary customer acquisition engine. Our professional Website Design & Development service moves beyond basic web templates to build high-performance, responsive, and secure digital platforms.\n\nWe blend clean user experience (UX) architecture with scalable engineering to maximize conversions, ensure lightning-fast page speeds, and turn casual web traffic into long-term enterprise value."
    : isLogoDesign
    ? "Your logo is the visual signature of your corporation, the face of your enterprise, and the foundation of your entire market identity. A professionally crafted Logo & Brand Design moves beyond standard graphic illustrations to establish an immediate, memorable psychological connection with your target audience.\n\nWe combine strategic color psychology, timeless typography, and clean minimalist layouts to communicate your core values instantly, set you apart from competitors, and build deep brand authority."
    : isBilling
    ? "In modern business, running your operations on un-synchronized spreadsheets or manual paper invoice systems can lead to processing delays, missing balances, tracking errors, and serious tax compliance gaps. Implementing a custom Billing & Enterprise Software Solution is your ultimate path to digital efficiency.\n\nIt automates your daily workflows, tracks your revenue streams in real time, and handles your data safely, giving you complete visibility over your cash flow and operations."
    : isMarketing
    ? "In today's fast-moving digital world, your target audience scrolls past thousands of pieces of content every single day. Grabbing their attention and keeping them engaged requires a powerful mix of eye-catching design and dynamic storytelling.\n\nOur professional Marketing Posters & Videos creation service builds high-converting visual assets and short-form video content designed to cut through the digital noise, maximize your click-through rates, and drive sales."
    : isPartnership
    ? "Planning to co-found a business venture with a trusted partner while keeping regulatory compliance simple and dynamic? A Partnership Firm Registration is the ideal framework for co-founders, joint consultants, agency owners, and family-run businesses looking to formally pool their skills, capital, and resources under a shared brand identity. Governed by the Indian Partnership Act, 1932, a partnership combines the financial strength and expertise of multiple owners. While the firm is legally recognized as an association of individuals rather than a separate corporate legal entity, registering it with the state's Registrar of Firms (RoF) grants it legal enforceability — ensuring that the business can execute contracts, resolve internal disputes smoothly, and establish credibility with banks and vendors."
    : isPvtLtd
    ? "Ready to transform your vision into a globally recognized, highly credible corporate structure? A Private Limited Company (Pvt Ltd) Registration is the gold standard for ambitious entrepreneurs, tech startups, and growing enterprises. It is the preferred choice for founders who want to raise external venture capital, limit personal financial risks, and build a lasting brand legacy. A Private Limited Company is a separate legal entity incorporated under the Companies Act, 2013 (and managed by the Ministry of Corporate Affairs – MCA). Unlike a proprietorship or partnership, a Pvt Ltd company exists independently of its shareholders and directors. It features 'Perpetual Succession', meaning the company continues to legally exist even if shareholders change, pass away, or exit. The most powerful attribute of this structure is Limited Liability – the personal assets of the directors and shareholders are completely safe and insulated if the business faces financial losses or debts."
    : isLLP
    ? "Looking for a business structure that offers the operational flexibility of a traditional partnership but shields your personal assets like a Private Limited company? A Limited Liability Partnership (LLP) Registration is the ultimate hybrid model. It is highly favored by professional consultants, service providers, and bootstrapped startups who want low compliance costs without compromising on legal security. A Limited Liability Partnership (LLP) is a distinct corporate business structure introduced in India under the Limited Liability Partnership Act, 2008. It is recognized as a separate legal entity from its partners, meaning the LLP can own property, take loans, and enter contracts in its own name. The defining benefit of an LLP is that the liability of each partner is strictly limited to their agreed capital contribution. Unlike a standard partnership, no partner can be held liable for the independent acts, negligence, or misconduct of another partner."
    : isPublicLtd
    ? "Are you preparing to execute a massive business expansion, invite large-scale public investments, or chart a clear path toward an Initial Public Offering (IPO)? A Public Limited Company (PLC) Registration is the ultimate corporate structure for high-growth enterprises. It offers unmatched capital-raising power, institutional credibility, and seamless share transferability to position your brand alongside India's industry leaders. A Public Limited Company is a premium corporate entity registered and regulated strictly under the Companies Act, 2013, via the Ministry of Corporate Affairs (MCA). Unlike private limited structures, a Public Limited Company is legally permitted to offer its shares to the general public, allowing it to pool immense capital from institutional and retail investors alike. It operates as a separate legal entity with independent financial standing. It maintains Perpetual Succession and provides Limited Liability, securing the personal assets of its shareholders against corporate losses."
    : isOPC
    ? "Are you a solo entrepreneur looking to build a powerful corporate brand without the need for co-founders or partners? A One Person Company (OPC) Registration is the perfect legal structure for individual founders, consultants, and e-commerce sellers. It allows you to enjoy all the premium privileges of a Private Limited company while maintaining 100% ownership and absolute decision-making power. Introduced under the Companies Act, 2013, a One Person Company (OPC) is a revolutionary business structure that allows a single individual to form a corporate entity. Unlike a traditional sole proprietorship — where the owner and business are legally treated as the same — an OPC is a separate legal entity. This means the company can own assets, sign contracts, and sue or be sued in its own name. Most importantly, it introduces Limited Liability to solo business owners, ensuring that your personal savings, home, and assets are completely protected against business losses and debts."
    : isSubsidiary
    ? "Is your international enterprise ready to tap into one of the world's fastest-growing economies and access a massive pool of world-class talent? Establishing an Indian Subsidiary is the ultimate gateway for foreign companies looking to operate dynamically in India. By launching a Wholly Owned Subsidiary (WOS) or a Joint Venture (JV), your parent company gains a fully operational, independent legal entity to drive revenue, execute local contracts, and scale without boundaries. An Indian Subsidiary is a corporate entity incorporated in India under the Companies Act, 2013, where a foreign parent company controls more than 50% of the share capital or dominates the composition of its Board of Directors. When the foreign parent company holds 100% of the shares, it is recognized as a Wholly Owned Subsidiary (WOS). Operatively, the Indian subsidiary is treated as a separate legal entity and an independent domestic corporate body. This structure strictly insulates the parent organization by providing Limited Liability, meaning the global parent company's assets are completely protected from any operational or financial liabilities incurred by the Indian entity."
    : isSection8
    ? "Are you looking to launch a non-profit organization, charitable foundation, or social venture with the highest level of corporate governance and institutional trust? A Section 8 Company Registration is the most trusted and globally recognized framework for NGOs in India. It is the premier choice for social entrepreneurs, philanthropists, and corporate CSR wings who want to drive meaningful change while enjoying limited liability protection and access to corporate funding. A Section 8 Company is a specialized corporate entity registered under Section 8 of the Companies Act, 2013, via the Ministry of Corporate Affairs (MCA). It is incorporated strictly for promoting non-profit objectives such as commerce, art, science, sports, education, research, social welfare, religion, charity, or environmental protection. Unlike a regular commercial firm, all profits, donations, and incomes generated by a Section 8 company must be used exclusively to further its core social mission. No dividends or profits can be paid or distributed to its members or directors."
    : isTrust
    ? "Whether you are planning to channel your personal wealth toward a specific charitable cause or looking to protect and manage family assets for future generations, a Trust Registration provides a timeless and deeply respected legal framework. It is the preferred choice for family estates, community schools, religious institutions, and traditional philanthropists who want a dedicated structure to fulfill a lasting, defined purpose. A Trust is a legal arrangement where an individual (known as the Settlor or Author) transfers the ownership of a specific property or asset to a trusted individual or group (known as the Trustee) for the absolute benefit of another individual or group (known as the Beneficiary). Governed broadly by the Indian Trusts Act, 1882 for private trusts, and specific state public trust acts or common law for public trusts, a Trust ensures that assets are strictly managed according to the rules set out in a legal contract called the Trust Deed."
    : isShopAct 
    ? "Are you preparing to open a retail storefront, launch a commercial corporate office, set up a local warehouse, or open a restaurant? Securing a Shops & Establishment Registration (often called a Shop Act License or Gumasta) is your mandatory first step. It officially registers your physical place of business with the state labor department, shielding you from heavy legal compliance penalties and establishing your business as a recognized legal entity."
    : isTradeLicense
    ? "Are you preparing to launch a retail outlet, a food business, a manufacturing plant, or a commercial establishment that interacts directly with the public or environment? Securing a Trade License Registration is an absolute legal prerequisite. Issued by your local municipal corporation, this vital document grants you the formal authorization to carry out your specific trade safely and legally within municipal limits, ensuring full compliance with health, safety, and environmental standards."
    : isClra
    ? "Are you a principal employer looking to hire contract workers, or a contractor deploying manpower to corporate clients? Obtaining a CLRA (Contract Labour Regulation and Abolition) License is a strict statutory requirement under Indian labor laws. It ensures structural compliance, transparent working environments, and fair treatment for contract laborers."
    : isBocw
    ? "Are you executing an urban infrastructure project, constructing a commercial real estate property, or undertaking massive structural civil engineering works? Securing a BOCW (Building and Other Construction Workers) Registration is a mandatory operational requirement. It ensures proper health, security, and financial welfare frameworks for construction workers."
    : isFssai
    ? "Are you setting up a cloud kitchen, launching a packaged food brand, opening a fine-dining restaurant, or operating a wholesale food storage warehouse? Obtaining an FSSAI (Food Safety and Standards Authority of India) License is a strict statutory mandate under the Food Safety Act, 2006. It is your business's ultimate badge of hygiene and institutional credibility."
    : isDsc
    ? "Are you planning to incorporate a company, submit digital tenders, sign official corporate contracts, or file statutory GST and Income Tax returns? Securing a Class 3 Digital Signature Certificate (DSC) is an absolute baseline asset. Operating as a highly secure, encrypted electronic key under the IT Act, 2000, it validates your legal identity."
    : isIec
    ? "Are you expanding your commercial operations internationally, shipping local products to global buyers, or importing specialized raw materials from international vendors? Securing an Import Export Code (IEC) is your absolute legal gateway. Issued directly by the Directorate General of Foreign Trade (DGFT), this permanent 10-digit registration number is mandatory."
    : isDrug
    ? "Are you launching a retail pharmacy storefront, distributing bulk pharmaceutical medicines to hospitals, establishing a healthcare diagnostics business, or manufacturing cosmetic products? Securing a Drug License is a non-negotiable legal prerequisite under the Drugs and Cosmetics Act, 1940. It monitors the distribution, storage, and handling of medicines."
    : isIcegate
    ? "Are you an international logistics provider, a customs broker, or an active importer/exporter aiming to speed up your international maritime or air cargo shipments? Completing an ICEGATE Registration is a vital operational mandate. Functioning as the e-commerce portal of the Central Board of Indirect Taxes and Customs (CBIC), this specialized integration hooks your business directly into customs systems."
    : isIso
    ? "Are you looking to scale your business operations, participate in high-value government tenders, or build trust with global international corporate clients? Obtaining an ISO Certification (such as ISO 9001, 14001, or 27001) is your ultimate operational milestone. Serving as a globally recognized symbol of corporate excellence, this certification verifies your standards."
    : isPf
    ? "Are you expanding your corporate team, onboarding permanent employees, or aiming to establish benchmark human resource standards within your business? Securing an EPFO (Employees' Provident Fund Organisation) Registration and Filing ecosystem is a critical statutory milestone. It provides a long-term social security and retirement savings framework for your team, keeping your company fully compliant with Indian labor codes and enhancing workforce retention."
    : isPsara
    ? "Are you planning to launch a private security agency, provide manned guarding services to corporate parks, or deploy cash logistics bouncers to banking networks? Securing a PSARA (Private Security Agencies Regulation Act) License is your mandatory legal requirement. It serves as a strict regulatory shield."
    : isEsic
    ? "Are you building an operational workforce, managing manufacturing plants, or running an office with multiple entry-level employees? Securing an ESIC (Employees' State Insurance Corporation) Registration and Filing framework is a mandatory statutory obligation under Indian social security laws. It provides a robust, state-backed health insurance and medical benefit framework for your team, protecting your business from immense workplace accident liabilities."
    : isCopyright
    ? "Are you a software developer writing proprietary source code, an author publishing a book, a musician composing original tracks, or an artist designing unique branding graphics? Securing a Copyright Registration is your ultimate legal shield. Governed under the Copyright Act, 1957, this intellectual property right grants you ownership."
    : isStartup
    ? "Are you launching a tech startup, scaling an innovative business model, or developing an original proprietary solution? Getting your business recognized under the Startup India Scheme (DPIIT Recognition) is a major milestone. It unlocks access to tax holidays, patent fast-tracks, and public funds."
    : isTrademark
    ? "Are you launching a brand name, creating a distinct logo, or designing a unique corporate slogan? Securing a Trademark Registration (™) is your most vital step to protect your brand identity. It grants you exclusive legal ownership over your brand elements across India, shielding your business from copycats."
    : isUdyam
    ? "Are you operating a small business, managing a local retail shop, running a consulting agency, or setting up a manufacturing unit? Getting an Udyam Aadhaar (MSME) Registration is a highly valuable step for your business. This free, state-backed registration formally recognizes your business under the MSME Development Act, 2006."
    : isPt
    ? "Are you expanding your business operations across multiple Indian states, opening regional branches, or employing professionals earning a salary? Securing a Professional Tax (PT) Registration and Filing infrastructure is an absolute statutory prerequisite. Regulated at the state government level under Article 276 of the Constitution of India, this tax is levied on professions, trades, callings, and employments."
    : isLwf
    ? "Are you managing an enterprise with a growing employee base, running retail chains, or operating a manufacturing unit across implemented states? Maintaining active Labour Welfare Fund (LWF) Filings is an essential statutory labor law compliance metric. Operating under state-specific boards, this fund provides financial aid, health amenities, and welfare schemes to workers."
    : isPosh
    ? "Are you looking to build a secure, progressive, and highly respected workspace for your corporate team while satisfying strict statutory mandates? Setting up full POSH Compliance (Prevention of Sexual Harassment of Women at Workplace Act, 2013) is a non-negotiable legal requirement for every modern business entity in India."
    : isRegisters
    ? "Are you running a registered company, managing factories, or operating corporate offices that face regular labor department audits? Systematically organizing the Maintenance of Statutory Registers is an absolute operational necessity under Indian labor laws."
    : isAdvisor
    ? "Are you managing a rapidly growing corporate enterprise, executing complex restructuring, or handling tricky employee relations? Appointing a dedicated Labour Law Advisor is your ultimate strategic asset to prevent major legal issues."
    : isItr
    ? "Every individual, Hindu Undivided Family (HUF), corporate firm, and legal entity earning an income in India is required to report their earnings annually to the Income Tax Department. Income Tax Filing involves submitting the correct form—ranging from ITR-1 to ITR-7—based on the nature of your income, financial volume, and legal structure, ensuring absolute compliance with the Income Tax Act, 1961."
    : isAssessment
    ? "An Income Tax Assessment is the formal process by which the Income Tax Department reviews and verifies the validity of the return filed by a taxpayer. Governed under various sections of the Income Tax Act, 1961, an assessment checks for completeness, catches under-reported income or excessive deduction claims, and determines the final tax liability or refund due."
    : isNotice
    ? "Receiving an official communication from the Income Tax Department can feel stressful, but most Income Tax Notices are simply standard requests for clarification driven by automated data matching. Handling the notification properly and within state-mandated timelines is critical to preventing severe financial penalties, asset freezes, or prosecution."
    : isTds
    ? "To ensure steady, continuous tax collection throughout the financial year, the government leverages two regulatory mechanisms: Tax Deducted at Source (TDS) and Tax Collected at Source (TCS). Entities making specific payments must deduct a percentage of tax at the source and remit it to the government. Similarly, sellers of specified high-value goods must collect tax from buyers."
    : isRevisedItr
    ? "What happens if you accidentally leave out an active source of income, claim an incorrect deduction, or discover an error after your Income Tax Return has already been filed and processed? The Income Tax Act provides two distinct pathways to correct your tax records: filing a Revised Return (Section 139(5)) for recent errors, or filing an Updated Return (ITR-U under Section 139(8A)) to correct errors in returns up to two years old."
    : isGstNew
    ? "Are you looking to expand your business horizons, sell your products across state lines, onboard onto e-commerce platforms, or have your business turnover cross national limits? Securing a GST (Goods and Services Tax) Registration is your mandatory structural step. This single, unified 15-digit registration number integrates your business into India's national value chain."
    : isGstFiling
    ? "Securing your GSTIN is just the first step; maintaining regular, timely GST Filings is an ongoing operational requirement for every registered business in India. Under the dual GST framework, businesses must regularly declare their outward sales distributions, record inbound purchases eligible for tax credits, and remit collected indirect taxes."
    : isGstAnnual
    ? "At the close of every financial year, the GST department requires registered taxpayers to file a comprehensive summary statement known as the GST Annual Return (GSTR-9), often accompanied by a self-certified reconciliation statement (GSTR-9C). This process acts as a final year-end consolidation."
    : isGstCancel
    ? "If your registered business has shut down its operations, underwent a legal restructure, or no longer meets legal turnover thresholds, keeping an un-used GSTIN active can create unnecessary compliance costs. Executing a formal GST Cancellation is the clean legal mechanism used to close out your tax profile safely."
    : isGstNotice
    ? "As the GST department increasingly leverages automated machine learning algorithms to audit tax compliance, businesses face a growing number of automated GST Notices. Handling these communications quickly and accurately is essential to protecting your business from heavy fines, asset freezes, and disruptions."
    : isMcaCompliance
    ? "Running a registered corporate entity in India requires strict adherence to annual statutory timelines managed by the Ministry of Corporate Affairs (MCA). Annual Compliance Management is a comprehensive service designed to ensure your Private Limited Company, Limited Liability Partnership (LLP), or One Person Company (OPC) remains active, highly credible, and completely free from heavy late-filing penalties or threat of striking-off by the Registrar of Companies (RoC)."
    : isMcaName
    ? "As your business grows, alters its core market offerings, executes a corporate rebrand, or shifts into an entirely new sector, your original legal identity may no longer represent your brand. Executing a formal Change of Company Name is a structured statutory mechanism governed under Section 13 of the Companies Act, 2013, enabling your business to adopt a fresh corporate identity safely and legally."
    : isMcaAddress
    ? "Every registered company in India must maintain a functional, physical place of business known as its Registered Office Address to receive official communications from government departments, court systems, and shareholders. If your business is expanding to larger office facilities, consolidating operations, or relocating across city or state boundaries, you must legally update your official corporate address with the Ministry of Corporate Affairs (MCA)."
    : isMcaShares
    ? "Are you inviting fresh equity investors into your company, onboarding strategic co-founders, or executing an exit strategy for an existing shareholder? A formal Transfer of Shares is the legal process used to reallocate stock ownership in a Private Limited Company from an existing shareholder (Transferor) to an onboarding buyer (Transferee), strictly following the rules outlined in the Companies Act, 2013, and your company's internal Articles of Association (AOA)."
    : isMcaMoa
    ? "The Memorandum of Association (MOA) and Articles of Association (AOA) serve as the twin pillars of your company's legal constitution. The MOA defines the boundary lines of your corporate powers, capital limits, and business scope, while the AOA dictates internal governance, voting dynamics, and management structures. If you are scaling operations into new industries, expanding your equity base, or reshaping your board's powers, an Alteration of MOA & AOA is a mandatory statutory requirement."
    : isMcaDirectors
    ? "The Board of Directors forms the core leadership team responsible for steering your company's strategy, managing executive operations, and ensuring strict statutory compliance. If you are bringing on fresh industry experts to guide your scaling strategy, onboarding institutional investor representatives, or managing a director's resignation or removal, completing a formal Appointment or Removal of Directors via the Ministry of Corporate Affairs (MCA) portal is an absolute legal mandate."
    : isMcaWinding
    ? "If your registered company has accomplished its original commercial goals, faced irreversible business losses, has zero active operations, or the promoters prefer to close down the business structure, keeping it alive can create unnecessary annual compliance tracking costs and legal liabilities. Executing a formal Winding Up of a Company (specifically via the Fast Track Exit - STK-2 mechanism managed by the MCA) is the clean legal pathway."
    : isMcaRevival
    ? "Has the Registrar of Companies (RoC) struck off your company's name from the official register due to a failure to file annual statutory returns (AOC-4 and MGT-7) for two consecutive financial years? Having your company struck off can freeze your business bank accounts, disqualify your active directors from serving on other boards, and put a halt to your day-to-day operations. Undertaking a formal Revival of a Company by filing an appeal with the National Company Law Tribunal (NCLT) is the only legal avenue."
    : isMcaRegisters
    ? "Are you running an active registered company looking to maintain strong corporate governance standards and stay fully prepared for sudden statutory inspections? Organizing the Maintenance of Secretarial Registers is a strict statutory requirement under Section 88 of the Companies Act, 2013. These registers serve as your company's official master records, providing clear evidence of your internal management."
    : isContractDrafting
    ? "In modern commercial operations, a clear, legally binding contract is the single most important tool used to protect your business interests, secure high-value transactions, define partner roles, and prevent costly commercial litigation. Our Contract Drafting Service designs customized, robust contracts tailored to your exact operational goals."
    : isLegalNotices
    ? "When a commercial partner breaches a signed contract, a client defaults on payment milestones, or an intellectual property infringement occurs, taking immediate and formal action is essential. Issuing a professionally drafted Legal Notice or Demand Letter is your primary legal tool used to formally notify the defaulting party."
    : isBondDrafting
    ? "Whether you are protecting your company's investments in specialized employee training, securing financial commitments during commercial leases, or setting up performance guarantees for long-term vendor relationships, a formal Indemnity or Performance Bond is an essential tool used to manage corporate risk."
    : isEmploymentContract
    ? "Your workforce is the engine that drives your business growth, but an un-structured onboarding workflow can leave your company exposed to major intellectual property leaks, data theft, and expensive labor court disputes. Securing a professionally written Employment Contract is an essential step to protect your business."
    : isNda
    ? "Data has become a highly valuable corporate asset, and protecting your proprietary source codes, financial secrets, and product roadmaps is essential to maintaining your market edge. Securing a customized, legally binding Non-Disclosure Agreement (NDA) is your absolute primary defense line."
    : isMou
    ? "Before corporate entities commit to long-term commercial contracts or invest heavy capital into asset acquisitions, they often need to lay out primary business terms and mutual expectations. Drafting a formal Memorandum of Understanding (MOU) is the professional way to establish this initial blueprint."
    : isFranchise
    ? "Expanding your successful business model across new territories via franchising or monetizing your proprietary software and trademarks through licensing is an excellent scaling strategy. However, an unstructured expansion can expose your brand to severe quality dilutions and identity theft."
    : isShareholder
    ? "Inviting external angel investors into your company, closing institutional venture capital rounds, or partnering with another corporation to execute a joint venture are major business milestones. However, entering these without a professionally written agreement can leave founders exposed to deadlock and hostile takeovers."
    : isDocumentReview
    ? "Entering into agreements using a client’s custom contract, reviewing an international vendor’s standard service agreement, or reusing an old corporate template can expose your business to significant hidden risks. Our professional Legal Document Review and Modification service acts as your ultimate safety filter."
    : isDarpan
    ? "Are you operating a non-profit organization, managing a registered public charitable trust, running a welfare society, or executing a Section 8 social impact company? Securing a DARPAN Registration (often called an NGO Darpan ID) is your absolute mandatory requirement. Managed directly by the NITI Aayog, this links you to ministries."
    : `${service.title} is the official registration and licensing required to operate legally. ${service.desc}`;

  const whoNeeds = isProprietorship ? [
    "Nationality: The applicant must be a citizen and legal resident of India.",
    "Age Limit: The applicant must be at least 18 years old.",
    "Lawful Objective: The intended business activities must be legal and compliant with Indian local and central government regulations."
  ] : isPartnership ? [
    "Minimum & Maximum Partners: There must be at least two (2) partners to form the business. The maximum limit is capped at fifty (50) partners.",
    "Age Limit: All participating partners must be at least 18 years old. Minors cannot become core partners but may be admitted strictly to the benefits of an already existing partnership.",
    "Competence: Every partner must be of sound mind and legally capable of entering into a binding commercial contract.",
    "Lawful Objective: The shared business activities must be entirely legal and compliant with both Indian central and state-specific regulations."
  ] : isPvtLtd ? [
    "Minimum & Maximum Members: The company must have at least two (2) shareholders and a maximum of two hundred (200) members.",
    "Director Requirements: A minimum of two (2) directors is required (the shareholders can also be the directors). At least one director must be an Indian resident.",
    "No Minimum Capital: There is no minimum paid-up capital requirement to start. You can launch your company with as little as ₹1,000.",
    "Lawful Objective: The business activities must be legally permissible and structured within the predefined framework of the Memorandum of Association (MOA)."
  ] : isLLP ? [
    "Minimum Partners: A minimum of two (2) partners is required. There is no upper limit on the maximum number of partners.",
    "Designated Partners: At least two (2) individuals must act as 'Designated Partners' (similar to company directors) to handle statutory filings. At least one of them must be a resident of India.",
    "Age Limit: All partners must be at least 18 years old at the time of incorporation.",
    "Lawful Objective: The partners must have a shared intent to carry out a lawful business with a profit-making motive."
  ] : isPublicLtd ? [
    "Minimum Shareholders: There must be a minimum of seven (7) shareholders or subscribers to initiate the company. There is no upper limit.",
    "Minimum Directors: The board must consist of at least three (3) directors (maximum of 15, which can be extended via a special resolution).",
    "Resident Director: At least one (1) director must be an Indian resident (stayed in India for 182+ days in the previous calendar year).",
    "No Capital Barriers: The statutory minimum paid-up capital requirement has been removed by the MCA, enabling dynamic structuring of authorized capital."
  ] : isOPC ? [
    "Single Promoter Only: Only one (1) natural person can act as the sole shareholder/member.",
    "Indian Residency: The founder and the chosen nominee must be citizens of India and legal residents.",
    "Nominee Requirement: The sole owner must nominate a secondary individual during incorporation who will take charge of the company in the event of the owner's death or incapacity.",
    "One OPC Per Person: An individual is legally restricted to incorporating or being a nominee for only one (1) OPC at any given time."
  ] : isSubsidiary ? [
    "Minimum Shareholders: There must be at least two (2) shareholders or corporate subscribers. For a WOS, the parent company holds 99.9% of the shares, while a nominee holds the remaining nominal fraction.",
    "Minimum Directors: The company must have at least two (2) directors.",
    "Mandatory Resident Director: At least one (1) director must be an Indian resident (having stayed in India for 182 days or more in the previous calendar year) to manage local statutory accountability.",
    "Physical Registered Address: The subsidiary must maintain a physical, legitimate commercial office address located within India.",
    "FEMA & RBI Compliance: The inflows of foreign capital must completely comply with the pricing and reporting parameters set by the Foreign Exchange Management Act (FEMA)."
  ] : isSection8 ? [
    "Minimum Members & Directors: There must be at least two (2) shareholders/members and a minimum of two (2) directors (the same individuals can fulfill both roles).",
    "Non-Profit Mandate: The primary objective of the entity must be entirely non-profit, aimed solely at social development or charitable initiatives.",
    "No Profit Diversion: The internal charter must explicitly state that no profit, dividend, or financial benefit will be transferred directly or indirectly to its members.",
    "Competent Founders: All promoters must be at least 18 years old, mentally sound, and legally qualified to enter into commercial agreements."
  ] : isTrust ? [
    "The Settlor: Must be a competent individual who is at least 18 years old, mentally sound, and owns the property being dedicated to the trust.",
    "The Trustees: A minimum of two (2) trustees is required. There is no upper limit. They must agree to actively manage the trust property according to the deed.",
    "The Beneficiary: There must be a clearly defined beneficiary or target group (e.g., 'underprivileged students' for a public trust, or 'named family members' for a private trust).",
    "Trust Property: There must be an identifiable asset or property (even a small nominal cash amount like ₹1,000) dedicated as the initial 'Trust Fund'.",
    "Lawful Objective: The core purpose of the trust must be entirely legal and cannot oppose public policy."
  ] : isShopAct ? [
    "Commercial Premises: The business must operate out of a real, physical commercial property, shop, or designated office space located within state boundaries.",
    "Timeline Constraint: The application must ideally be filed with the state labor department within 30 days of starting your commercial activities.",
    "Nature of Business: The premises must be classified as a commercial establishment, retail shop, theater, restaurant, or service-oriented office."
  ] : isClra ? [
    "Principal Employer Registration: Before a contractor can apply for a license, the principal employer must possess a valid CLRA Registration Certificate.",
    "Worker Count Threshold: Applicable to any establishment or contractor engaging twenty (20) or more contract workers on any given day.",
    "Valid Work Contract: Contractors must have an authentic work order or agreement issued by the principal employer specifying the nature and duration of the contract assignment."
  ] : isTradeLicense ? [
    "Age Limit: The applicant or business owner must be at least 18 years old.",
    "Clean Legal Standing: The applicant must have a clean legal record with no history of serious criminal activities or severe environmental violations.",
    "Commercial Zone: The physical premises where the business operates must be located within a commercially approved zone or an area permitted by the local urban planning authority.",
    "Lawful and Safe Activity: The specific trade or business category must be entirely legal and safe for the surrounding public community."
  ] : isBocw ? [
    "Workforce Threshold: Every construction establishment that employs ten (10) or more workers on any single day over the preceding 12-month window must register.",
    "Site Operations: The business must be actively executing structural building or other construction activities within regional state boundaries.",
    "Exclusion Clause: Individual owners constructing their own private residential homes are exempt, provided the total capital layout remains within state-exempt thresholds."
  ] : isFssai ? [
    "Basic Registration: For small-scale food business operators (FBOs), petty retailers, and home kitchens with an annual turnover below ₹12 Lakhs.",
    "State License: For medium-scale food processors, manufacturers, large restaurants, and distributors with an annual turnover between ₹12 Lakhs and ₹20 Crore.",
    "Central License: For multi-state food chains, large-scale manufacturers, importers, exporters, and units operating inside central government zones with an annual turnover exceeding ₹20 Crore."
  ] : isDsc ? [
    "Individual Scope: Any natural individual citizen of India looking to execute personal filings or act as a corporate director.",
    "Organization Scope: Any authorized corporate representative, partner, or CEO signing forms on behalf of an established company, LLP, or trust.",
    "Hardware Mandate: The certificate must be configured and hosted exclusively inside a secure, physical FIPS-compliant cryptographic USB token."
  ] : isIec ? [
    "Legal Entity Base: Available to any style of registered business structure, including Sole Proprietorships, Partnerships, Private Limited Companies, LLPs, NGOs, and Trusts.",
    "Dedicated Bank Account: The business must maintain an active current bank account configured to accept and transmit foreign currencies.",
    "Valid PAN Mapping: The business or the individual promoter must possess a clean, active Permanent Account Number (PAN)."
  ] : isDrug ? [
    "Retail Drug License: Granted strictly to local pharmacies, chemists, and medical stores interacting directly with everyday retail consumers.",
    "Wholesale Drug License: Issued to large-scale distributors, stockists, and traders who sell pharmaceutical formulations to other businesses or hospitals.",
    "Manufacturing Drug License: A comprehensive license for units producing allopathic, homeopathic, ayurvedic medicines, or complex medical equipment."
  ] : isIcegate ? [
    "Active IEC Mapping: The applicant business must already possess a valid and active Import Export Code (IEC) issued by the DGFT.",
    "Organization Blueprint: Available to all registered corporate trading entities, customs brokers, shipping lines, and logistics companies.",
    "Class 3 DSC Integration: The authorized signatory must possess a valid, personal Class 3 Digital Signature Certificate (DSC) configured for customs portal verification."
  ] : isIso ? [
    "ISO 9001:2015 (QMS): The global benchmark for Quality Management Systems. Ideal for all service, manufacturing, and technology companies.",
    "ISO 14001:2015 (EMS): Focuses on Environmental Management Systems for businesses looking to optimize sustainability and minimize waste.",
    "ISO 27001:2022 (ISMS): Governs Information Security Management Systems. A mandatory asset for IT firms, cloud platforms, and tech startups."
  ] : isPf ? [
    "Mandatory Workforce Limit: Every factory or business establishment that employs twenty (20) or more individuals on any single day must register within 15 days of reaching this headcount.",
    "Voluntary Option: Small businesses with less than 20 employees can opt for a voluntary PF registration to provide retirement benefits to their team and elevate corporate prestige.",
    "Salary Ceiling: While registration applies to the whole entity, PF deductions are structurally mandatory for employees earning a basic salary of up to ₹15,000 per month."
  ] : isPsara ? [
    "Indian Citizenship Base: The principal promoter, CEO, or managing director must be a citizen of India and maintain a clean criminal history.",
    "Financial Credibility: The business must possess clean financial records, and the promoters must have a solid credit history without any bankruptcy marks.",
    "Mandatory Training Tie-Up: The applicant agency must execute a formal Memorandum of Understanding (MoU) with a state-recognized security training institute to train guards."
  ] : isEsic ? [
    "Mandatory Employee Baseline: Applicable to any commercial establishment, factory, or office that employs ten (10) or more individuals on any single day (this threshold is twenty in certain states).",
    "Salary Threshold: Employees whose gross monthly salary is ₹21,000 or below are legally covered under this scheme.",
    "Physical Coverage: The business premises must be located within an ESIC-implemented geographic zone or municipal territory."
  ] : isCopyright ? [
    "Literary Works: Book manuscripts, research articles, website text contents, and proprietary computer software source codes.",
    "Artistic Works: Brand logos, commercial graphic designs, architectural blue drawings, and unique paintings.",
    "Cinematographic & Sound: Short films, podcast audio files, music compositions, and commercial jingles."
  ] : isStartup ? [
    "Business Structure Type: The startup must be incorporated as a Private Limited Company, a Limited Liability Partnership (LLP), or a registered Partnership Firm.",
    "Age of the Entity: The total period of existence from the formal date of incorporation must be under ten (10) years.",
    "Turnover Constraints: The total annual financial turnover must not have exceeded ₹100 Crore in any preceding financial year.",
    "Innovation Core: The business model must focus on innovation, development, or optimization of products, processes, or services."
  ] : isTrademark ? [
    "Brand Name: Your unique corporate name, company name, or product line name.",
    "Logo Design: Distinct visual marks, symbols, or artistic emblems representing your business identity.",
    "Slogan / Tagline: Catchy textual phrases used in your marketing campaigns to define your brand."
  ] : isUdyam ? [
    "Micro Enterprise: Investment in plant and machinery under ₹1 Crore, and annual turnover under ₹5 Crore.",
    "Small Enterprise: Investment in plant and machinery under ₹10 Crore, and annual turnover under ₹50 Crore.",
    "Medium Enterprise: Investment in plant and machinery under ₹50 Crore, and annual turnover under ₹250 Crore."
  ] : isPt ? [
    "Employer Purview (PTRC): Every business entity that employs one or more individuals earning a salary above the minimum state-exempt slab must register for PTRC.",
    "Corporate Entity Purview (PTEC): Every corporate entity, including Private Limited companies, LLPs, registered Partnerships, and Sole Proprietorships, must register for PTEC to clear their corporate tax liabilities.",
    "Director/Partner Mandate: Individual directors, designated partners, and independent practicing consultants are individually liable to maintain active PT compliance."
  ] : isLwf ? [
    "State Implementation: The business premises or branch offices must be physically located within an Indian state that has enacted the Labour Welfare Fund Act.",
    "Workforce Count Threshold: This compliance typically kicks in for establishments employing five (5) or more, or ten (10) or more individuals depending strictly on regional state rules.",
    "Employee Exclusion Scope: Applies broadly to manual, clerical, and technical workers; however, managerial and highly paid supervisory personnel are often excluded based on state salary caps."
  ] : isPosh ? [
    "Internal Committee (IC) Mandate: Every corporate office or branch with ten or more employees must form an Internal Committee to handle harassment complaints.",
    "External Member Integration: The IC must be headed by a senior woman employee and must include an independent external member (such as an experienced NGO representative or legal expert specialized in POSH).",
    "Annual Filing Obligation: The entity must compile and submit an annual progress report detailing the number of cases received, actions taken, and awareness workshops conducted to the District Officer."
  ] : isRegisters ? [
    "Register of Wages / Muster Roll: Combines daily employee attendance logs with comprehensive wage calculations, deductions, and net payouts.",
    "Register of Fines & Deductions: Records any operational deductions made from employee salaries, ensuring they stay within legal limits.",
    "Register of Overtime & Leave Accounts: Tracks overtime hours worked, applicable premium wages, and accurate employee leave allocations (earned, casual, and sick leaves)."
  ] : isAdvisor ? [
    "New Labor Codes Transition: Guiding your business through transitions into the new unified Labor Codes (Wages, Social Security, Industrial Relations, and Occupational Safety).",
    "Compliance Health Audits: Conducting deep-dive corporate audits to identify compliance gaps in your payroll, contractor management, and onboarding workflows.",
    "Dispute Resolution & Legal Representation: Crafting formal legal responses to show-cause notices from labor departments and representing your business interests during conciliation proceedings."
  ] : isItr ? [
    "ITR-1 (Sahaj): For resident individuals having income from salaries, one house property, or other sources with a total income up to ₹50 Lakhs.",
    "ITR-2: For individuals and HUFs not having income from profits and gains of business or profession (capital gains, foreign assets, etc.).",
    "ITR-3: For individuals and HUFs earning income from a proprietary business or carrying out a profession (consultants, freelancers, traders).",
    "ITR-4 (Sugam): For individuals, HUFs, and firms opting for the Presumptive Taxation Scheme under Sec 44AD/44ADA/44AE with business turnover up to ₹2 Crores.",
    "ITR-5: For partnership firms, Limited Liability Partnerships (LLPs), Association of Persons (AOPs), and Body of Individuals (BOIs).",
    "ITR-6: For companies incorporated under the Companies Act (other than companies claiming exemption under Section 11).",
    "ITR-7: For persons, trusts, political parties, and institutions required to file returns under Sections 139(4A) to 139(4D) (NGOs and charitable trusts)."
  ] : isAssessment ? [
    "Summary Assessment (Section 143(1)): An automated, electronic processing of the filed ITR. The portal checks for arithmetical errors and incorrect tax claims, sending an automated 'Intimation' sheet.",
    "Scrutiny Assessment (Section 143(3)): A detailed, face-to-face or faceless review where the case is selected for a thorough audit. The taxpayer is required to provide complete books of accounts.",
    "Best Judgment Assessment (Section 144): Initiated if the taxpayer fails to file their return, respond to notices, or produce books. The Assessing Officer computes the tax liability based on available data.",
    "Income Escaping Assessment (Section 147): Initiated if the Assessing Officer has reason to believe that any taxable income has escaped assessment in previous financial years, re-opening historical cases."
  ] : isNotice ? [
    "Section 139(9) (Defective Return Notice): Issued if the return is filed with structural omissions, such as mismatched tax audit details, missing schedules, or unpaid self-assessment taxes.",
    "Section 142(1) (Inquiry Notice): A formal directive asking the taxpayer to produce specific documents, accounts, or file their return if they have missed the deadline.",
    "Section 143(1)(a) (Prima Facie Adjustments): An automated notice identifying clear variations or mismatches between the income reported in your ITR and data appearing in Form 26AS or AIS.",
    "Section 148 (Income Escaping Assessment Notice): A serious legal notice issued when the department has solid evidence that taxable income was left un-reported in previous years."
  ] : isTds ? [
    "Form 24Q: Quarterly return for tax deducted at source from Salary payments made to employees.",
    "Form 26Q: Quarterly return for tax deducted at source on Non-Salary domestic payments (professional fees, rent, etc.).",
    "Form 27Q: Quarterly return for tax deducted at source on payments made to Non-Resident Indians (NRIs) or foreign corporations.",
    "Form 27EQ: Quarterly return detailing Tax Collected at Source (TCS) on specified items like scrap sales, liquor sales, or car purchases above ₹10 Lakhs."
  ] : isRevisedItr ? [
    "Revised Return (Section 139(5)): Can be filed at any time before December 31st of the assessment year, allowing you to correct any type of error with zero additional penalty.",
    "Updated Return (ITR-U): Can be filed within twenty-four (24) months from the end of the relevant assessment year, requiring the payment of an additional tax penalty (25% or 50% additional tax fee).",
    "Exclusion Constraints: ITR-U cannot be filed if it results in a net loss return, increases your tax refund amount, or reduces overall tax liability. It is also unavailable during active tax audits/searches."
  ] : isGstNew ? [
    "Service Providers: Mandatory registration kicks in if your annual aggregate turnover crosses ₹20 Lakhs (or ₹10 Lakhs for North-Eastern states).",
    "Goods Suppliers: Mandatory registration applies if your annual aggregate turnover crosses ₹40 Lakhs (or ₹20 Lakhs for specialized state categories).",
    "Compulsory Registration Cases: Turnover limits are entirely waived if your business engages in inter-state sales, operates an e-commerce portal, acts as an ISD, or falls under the Reverse Charge Mechanism (RCM)."
  ] : isGstFiling ? [
    "GSTR-1 (Outward Supplies Return): A monthly or quarterly return detailing all your outbound business-to-business (B2B) and business-to-consumer (B2C) sales invoices, debit notes, and credit notes.",
    "GSTR-3B (Summary Self-Assessment Return): A mandatory monthly summary return used to declare total sales value, claim available Input Tax Credit (ITC) from GSTR-2B logs, and pay net GST dues online.",
    "Form CMP-08: A simple quarterly statement used by small traders registered under the Composition Scheme to declare total turnover and pay a flat percentage of tax."
  ] : isGstAnnual ? [
    "Form GSTR-9: The standard annual return form that must be filed by all regular taxpayers. Mandatory for entities with an annual aggregate turnover above ₹2 Crores in a financial year.",
    "Form GSTR-9C: A specialized reconciliation statement matching figures in your audited annual balance sheet against values reported in your GSTR-9 return. Mandatory above ₹5 Crores turnover."
  ] : isGstCancel ? [
    "Cancellation by Taxpayer (Voluntary): Initiated via Form GST REG-16 when a business is closing down, changing its structure, or selling operations, requiring a final settlement of tax on remaining inventory.",
    "Suo-Motu Cancellation (By Tax Officer): Triggered if a regular taxpayer fails to file returns for a continuous period of six months, resulting in an immediate block on business operations.",
    "Revocation Window: A formal application to reverse a department cancellation must be filed within ninety (90) days from the date the cancellation order was served."
  ] : isGstNotice ? [
    "Form GST ASMT-10 (Scrutiny Notice): Issued by a tax officer to highlight variations or mismatches between your GSTR-1 sales data, GSTR-3B filings, and portal-generated GSTR-2B credit logs.",
    "Form GST DRC-01 / SCN (Show Cause Notice): A formal legal notice outlining a proposed tax demand, interest calculations, and penalty charges, requiring a robust written legal response.",
    "Form GST REG-03 (Registration Clarification Notice): Issued during the initial application phase if a tax officer finds defects, missing descriptions, or unverified property documents in your registration file."
  ] : isMcaCompliance ? [
    "Active Corporate Status: The company, LLP, or OPC must hold an \"Active\" status on the MCA portal (not currently struck off or in liquidation).",
    "Director/Partner Verifications: All active directors must complete their annual DIR-3 KYC verification, and designated partners must maintain verified credentials.",
    "Financial Reporting Base: The entity must compile its books of accounts, balance sheets, and profit & loss statements at the close of every financial year (ending March 31st)."
  ] : isMcaName ? [
    "Compliance Clean Record: The company must have up-to-date MCA annual filings (AOC-4 and MGT-7) and have cleared all due corporate taxes or structural returns.",
    "No Default Profiles: The entity must not have defaulted on paying matured deposits, debentures, or interest payments to creditors.",
    "Distinct Name Suitability: The new name must follow strict MCA naming guidelines—possessing a unique prefix, an appropriate objects-defining middle word, and ending with suffixes like \"Private Limited\" or \"OPC Private Limited\"."
  ] : isMcaAddress ? [
    "Board Approval Base: Every level of address modification must be backed by a formal resolution passed during a meeting of the Board of Directors.",
    "Clean Real Estate Title: The new commercial space, rented office, or virtual space must possess legitimate property ownership proofs and utility link authorizations.",
    "Compliance Continuity: The entity must maintain up-to-date structural corporate filings on the MCA platform before seeking location transfers."
  ] : isMcaShares ? [
    "AOA Alignment Check: The proposed share reallocation must align with all pre-emption rights, restriction clauses, and transfer conditions outlined inside the company's Articles of Association.",
    "Consent Framework: Both the existing shareholder and the incoming buyer must execute clear, mutual financial and legal consent via a signed transfer instrument.",
    "No Lien Status: The equity shares targeted for transfer must be fully paid up and free of any liens, pledges, or structural corporate constraints."
  ] : isMcaMoa ? [
    "Object Clause Alteration: Modifying or adding new primary business lines when diversifying your corporate product or service offerings.",
    "Capital Clause Alteration: Increasing your company's Authorized Share Capital limit to issue fresh equity to angel investors or venture capital funds.",
    "Management Realignment (AOA): Amending internal clauses to introduce specialized voting rights, change share transfer rules, or adjust director powers."
  ] : isMcaDirectors ? [
    "Age & Sound Mind Base: The proposed director must be an individual who is at least 18 years old, mentally sound, and free from any court-ordered bankruptcy or insolvency marks.",
    "No Disqualification Profile: The individual must not stand disqualified under Section 164 of the Companies Act, 2013 (e.g., must not be linked to other non-compliant entities).",
    "DIN Possession: The onboarding director must possess a valid, active Director Identification Number (DIN) allocated by the MCA."
  ] : isMcaWinding ? [
    "Operational Inactivity: The company must have completely ceased all commercial business operations for a continuous period of at least one (1) or two (2) years before filing.",
    "Zero Asset & Liability Profile: The company's balance sheet must reflect absolute zero assets and zero outstanding financial liabilities or dues toward third parties.",
    "No Pending Litigation: The company must not have any active, unresolved lawsuits or pending investigations from tax or labor departments."
  ] : isMcaRevival ? [
    "Proved Active Status: You must present clear evidence proving the company was actively conducting business operations or owning real estate assets at the time it was struck off.",
    "Locus Standi Base: The petition for revival must be filed by an eligible person, such as an active shareholder, a director, or a creditor of the struck-off entity.",
    "Commitment to Compliance: The promoters must give a clear commitment to compile, sign, and file all historically overdue financial statements and returns immediately upon activation."
  ] : isMcaRegisters ? [
    "Register of Members (Form MGT-1): Tracks the complete list of shareholders, their exact equity allocations, dates of share acquisition, and distinct folio details.",
    "Register of Directors & KMP: Records personal identification metrics, DIN numbers, joining dates, and exit timelines for all directors and key managers.",
    "Register of Charges (Form CHG-7): Logs comprehensive details regarding any bank loans, corporate mortgages, or assets hypothecated against financial credit lines.",
    "Register of MBP-1 Disclosures: Compiles annual conflict-of-interest declarations filed by directors regarding their shareholdings and positions in other external business entities."
  ] : isContractDrafting ? [
    "Scope of Deliverables: Clear definitions outlining the exact operational performance targets, service standards, and product metrics required from both parties.",
    "Financial & Payment Milestones: Structured breakdowns detailing pricing models, invoicing frequencies, late payment interest terms, and tax allocation splits (such as GST responsibilities).",
    "Limitation of Liability & Indemnity: Protective caps that limit your business's financial liability if a breach occurs, paired with strong indemnity clauses to shield your firm.",
    "Dispute Resolution & Jurisdiction: Setting up multi-stage dispute resolution systems, prioritizing fast-track mediation/arbitration and defining clear geographic court jurisdictions."
  ] : isLegalNotices ? [
    "Payment Default & Debt Recovery: Formally demanding immediate settlement of unpaid invoices, past-due contractual milestones, or outstanding commercial balances.",
    "Breach of Contract Performance: Notifying a service provider, vendor, or contractor of a failure to meet their agreed operational targets or service standards.",
    "Trademark & Copyright Infringement: Issuing an immediate Cease and Desist Notice to block copycats from misusing your brand assets, logo layouts, or copyrighted materials.",
    "Employer-Employee Disputes: Issued to address violations of active employment agreements, non-compete clauses, or a failure to return corporate property upon exit."
  ] : isBondDrafting ? [
    "Employee Training Bonds: Used to recover specialized training costs, travel expenses, and certifications if an employee exits before completing a specified minimum service period.",
    "Performance Bonds: Guarantees issued by contractors or vendors ensuring they will execute a project according to your agreed design standards and timelines.",
    "Indemnity Bonds: Unilateral legal commitments ensuring a party will compensate your business for any financial losses, tax pass-through liabilities, or legal damages arising from a specific transaction."
  ] : isEmploymentContract ? [
    "IP Assignment / Work-for-Hire: A critical protective clause ensuring that all source codes, product designs, customer databases, and innovations created belong 100% to your company.",
    "Confidentiality & Data Protection: Strong non-disclosure restrictions that block employees from leaking or misusing your trade secrets, pricing models, or client lists.",
    "Non-Compete & Non-Solicitation: Restrictive covenants that prevent exiting employees from joining direct competitors or poaching your active clients within reasonable geographic limits.",
    "Termination & Notice Layout: Clear parameters outlining mandatory notice periods, garden leave choices, severance terms, and summary dismissal triggers for gross misconduct."
  ] : isNda ? [
    "Unilateral NDA (One-Way): Used when only one party is disclosing highly sensitive proprietary data (such as a company sharing source code with an external software developer).",
    "Mutual NDA (Two-Way): Used during joint venture discussions, merger evaluations, or deep strategic partnerships where both organizations share confidential data.",
    "Multilateral NDA: A specialized agreement used when three or more independent organizations are coordinating on a complex commercial project, keeping all shared data secure."
  ] : isMou ? [
    "Statement of Common Purpose: A clear summary detailing the primary goals, target milestones, and commercial scope of the partnership.",
    "Roles & Contribution Splits: Clear definitions detailing the exact capital, technology, infrastructure, or human resources each party must bring to the table.",
    "Exclusivity & Non-Disclosure: Legally binding clauses that prevent your partner from negotiating with direct competitors during the discussion window, keeping shared data secure.",
    "Termination & Transition Layout: Clear rules mapping out how a party can safely exit the discussions if the arrangement faces terminal bottlenecks, including rules for sharing early project costs."
  ] : isFranchise ? [
    "IP Grant & Territory Limits: Explicitly defining the exact trademarks, proprietary technologies, or software systems being shared, paired with strict geographic boundary lines.",
    "Quality Control & Operations Audit: Legally binding clauses granting your company the absolute power to perform unannounced site audits and monitor operational standards.",
    "Royalty & Financial Fee Architecture: Clear breakdowns detailing initial upfront franchise fees, ongoing monthly royalty percentages, marketing fund contributions, and late penalties.",
    "De-Branding & Termination Protocols: Strict rules mapping out how to immediately revoke brand permissions if a material breach occurs, forcing the partner to completely remove your signage within 48 hours."
  ] : isShareholder ? [
    "Board Composition & Veto Rights: Defining the exact process used to assign board seats, paired with clear lists of critical corporate actions that require absolute founder or majority consent.",
    "Pre-Emption Rights & Anti-Dilution: Protective clauses giving existing shareholders the primary option to purchase fresh stock issuances, protecting your team from being unfairly diluted.",
    "Tag-Along & Drag-Along Clauses: Tag-Along rights protect minority shareholders by allowing them to join in a majority stock sale, while Drag-Along clauses empower majority owners to compel minority partners to join in a total sale.",
    "Deadlock Resolution Mechanisms: Clear, multi-stage resolution paths designed to break management logjams instantly and prevent operational shutdowns."
  ] : isDocumentReview ? [
    "Identifying Hidden Liabilities: We catch and remove vague indemnity clauses, uncapped liability traps, or unfair warranty waivers that expose your business to un-backed third-party damages.",
    "Balancing Termination Terms: We eliminate one-sided termination triggers, ensuring your company enjoys fair exit options, reasonable notice periods, and full payment for services delivered.",
    "Verifying Compliance Alignment: We ensure your contracts match all current Indian statutory codes, including the Information Technology Act, GST rules, labor regulations, and specific sector guidelines.",
    "Optimizing Dispute Formulations: We rewrite weak dispute clauses into strong, multi-stage systems that prioritize cost-effective mediation and fast-track arbitration, while securing clear local jurisdictions."
  ] : isDarpan ? [
    "Non-Profit Legal Structure: The applicant body must be legally registered as a Public Charitable Trust, a registered Welfare Society, or a Section 8 Non-Profit Company.",
    "Detailed Board Blueprint: The entity must maintain an active, fully functional executive committee or board consisting of a minimum of three distinct non-profit members.",
    "Updated Compliance History: The applicant organization must have up-to-date records, transparent financial loggers, and a clean history free of structural non-profit compliance blocks."
  ] : isGst ? [
    "Businesses with annual turnover > ₹20 lakhs (₹10 lakhs in NE states)",
    "E-commerce sellers and aggregators (regardless of turnover)",
    "Inter-state suppliers of goods or services",
    "Casual taxable persons and non-resident taxable persons",
    "Businesses required to pay tax under reverse charge mechanism",
    "Input service distributors (ISD)",
  ] : [
    `Any business or entrepreneur operating in the ${service.category} domain`,
    `Firms looking to establish legal status and build customer trust`,
    `Entities aiming to avoid penalties and legal actions`,
    `Startups and established brands operating in India`
  ];

  const docs = isProprietorship ? [
    "Proposed Company Name",
    "Aadhaar, PAN, Passport-size Photograph, Mobile Number, and Email ID",
    "If Owned: Sale Deed & Latest Utility Bill (Electricity/Water)",
    "If Rented: Notarized Rent Agreement & Latest Utility Bill (Electricity/Water)"
  ] : isPartnership ? [
    "Proposed Company/Firm Name (Must be unique and not violate existing trademarks)",
    "Core Business Activities / Nature of Trade",
    "Self-attested PAN Card (Mandatory for all partners)",
    "Aadhaar Card, Recent Passport-size Photograph for all partners",
    "Active Mobile Number & Email ID for all partners",
    "Voter ID, Driving License, or Valid Passport (address proof for all partners)",
    "If Owned: Sale Deed / Property Tax Receipt & Latest Utility Bill (Electricity/Water)",
    "If Rented: Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a No Objection Certificate (NOC) from the property owner"
  ] : isPvtLtd ? [
    "Proposed Company Names (Provide 1 or 2 unique names in order of preference)",
    "Main business objectives / Industry category",
    "Self-attested PAN Card (Mandatory for Indian Nationals, all directors/shareholders)",
    "Aadhaar Card, Recent Passport-size Photograph (all directors/shareholders)",
    "Active Mobile Number & Email ID (all directors/shareholders)",
    "Any one (Not older than 2 months): Bank Statement, Electricity Bill, Mobile Bill, or Gas Bill (Name must match exactly with the PAN card)",
    "If Owned: Sale Deed & Latest Utility Bill (Electricity/Water)",
    "If Rented: Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a No Objection Certificate (NOC) from the property owner"
  ] : isLLP ? [
    "Proposed LLP Names (1 or 2 unique names for verification)",
    "Detailed description of the business activities/services",
    "Self-attested PAN Card (Mandatory for Indian Citizens)",
    "Aadhaar Card and Recent Passport-size Photograph for all partners",
    "Active Mobile Number & Email ID for all partners",
    "Any one (Not older than 2 months): Bank Statement, Electricity Bill, Telephone Bill, or Gas Bill (Name must match PAN perfectly)",
    "If Owned: Sale Deed & Latest Utility bill (Electricity/Water)",
    "If Rented: Notarized Rent Agreement, Latest Utility Bill, and a No Objection Certificate (NOC) from the property owner"
  ] : isPublicLtd ? [
    "Proposed Corporate Names (Must be unique, distinct, and must end with the suffix 'Limited')",
    "Exhaustive description of core business domains",
    "Self-attested PAN Card (Mandatory for Indian Citizens)",
    "Aadhaar Card, Recent Passport-size Photograph for all directors/shareholders",
    "Active Mobile Number & Verified Email ID for all directors/shareholders",
    "Any one (Not older than 2 months): Bank Account Statement, Electricity Bill, Telephone Bill, or Gas Bill (Name must precisely match PAN)",
    "If Owned: Registered Sale Deed / Property Tax Receipt & Latest Utility Bill",
    "If Rented/Leased: Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a signed No Objection Certificate (NOC) from the property owner"
  ] : isOPC ? [
    "Proposed OPC Names (1 or 2 unique name preferences ending with the suffix 'OPC Private Limited')",
    "Main business objectives / Industry category",
    "Self-attested PAN Card (Mandatory) for owner and nominee",
    "Aadhaar Card, Recent Passport-size Photograph for owner and nominee",
    "Active Mobile Number & Email ID for owner and nominee",
    "Any one (Not older than 2 months): Bank Statement, Electricity Bill, Mobile Bill, or Gas Bill (Name must match PAN card exactly)",
    "If Owned: Sale Deed / Property Tax Receipt & Latest Utility Bill",
    "If Rented: Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a signed No Objection Certificate (NOC) from the landlord"
  ] : isSubsidiary ? [
    "Certificate of Incorporation / Business Charter of foreign parent company",
    "Memorandum & Articles of Association (MOA/AOA) of foreign parent company",
    "Certified Board Resolution authorizing the India expansion and nominating an authorized representative",
    "Valid, high-resolution color copy of Passport (Identity Proof) for foreign directors/signatories",
    "Overseas Address Proof (Utility Bill or Bank Statement not older than 2 months) for foreign directors/signatories",
    "Passport-size photographs, Email ID, and active contact numbers for foreign directors/signatories",
    "Self-attested PAN Card (Mandatory) for Indian resident director",
    "Aadhaar Card for Indian resident director",
    "Bank Statement or Utility Bill reflecting the current residential address for Indian resident director",
    "If Rented/Leased: Notarized Lease/Rent Agreement, Latest Utility Bill (Electricity/Water), and a signed No Objection Certificate (NOC) from the property owner (Indian registered office proof)"
  ] : isSection8 ? [
    "Proposed NGO Names (Must include words like Foundation, Forum, Association, Council, or Federation)",
    "A detailed 3-year projection of future social activities and estimated income/expenditure",
    "Self-attested PAN Card (Mandatory for Indian Nationals) for all directors/members",
    "Aadhaar Card, Recent Passport-size Photograph for all directors/members",
    "Active Mobile Number & Verified Email ID for all directors/members",
    "Any one (Not older than 2 months): Bank Statement, Electricity Bill, Mobile Bill, or Gas Bill (Name must match PAN card exactly)",
    "If Owned: Sale Deed / Property Tax Receipt & Latest Utility Bill",
    "If Rented: Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a signed No Objection Certificate (NOC) from the landlord"
  ] : isTrust ? [
    "Proposed Trust Name (Must be unique and not conflict with existing well-known institutions)",
    "Clearly defined objectives of the trust",
    "Self-attested PAN Card (Mandatory) for settlor and all trustees",
    "Aadhaar Card, Recent Passport-size Photograph for settlor and all trustees",
    "Active Mobile Number & Email ID for settlor and all trustees",
    "Voter ID, Valid Passport, or Driving License (address proof for settlor and all trustees)",
    "If Owned: Sale Deed / Property Tax Receipt & Latest Utility Bill (trust office address proof)",
    "If Rented: Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a signed No Objection Certificate (NOC) from the landlord (trust office address proof)",
    "Identity proofs of two (2) independent witnesses who will sign the deed during registration"
  ] : isShopAct ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isClra ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isTradeLicense ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isBocw ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isFssai ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isDsc ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isIec ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isDrug ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isIcegate ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isIso ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isPf ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isPsara ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isEsic ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isCopyright ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isStartup ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isTrademark ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isUdyam ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isDarpan ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ] : isGst ? [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the authorized signatory",
    "Proof of business address (electricity bill / rent agreement)",
    "Bank account statement or cancelled cheque",
    "Digital Signature Certificate (for companies)",
    "Memorandum of Association / Partnership Deed (if applicable)",
  ] : [
    "PAN Card of the applicant / business entity",
    "Aadhaar Card of the owners / authorized signatories",
    "Proof of business address (electricity bill / lease agreement)",
    "Bank statement or cancelled cheque of the active account",
    "Digital Signature Certificate (where applicable)",
    "Incorporation details or Partnership Deed (if applicable)"
  ];

  const process = isWebDev ? [
    { step: "01", title: "Strategic Blueprinting & UI/UX Wireframing", desc: "We map out your target user flows, design initial information architectures, and build high-fidelity visual prototypes for your review." },
    { step: "02", title: "Full-Stack Engineering & Mobile Optimization", desc: "Our developers write clean, modular code to transform your visual blueprints into a fast, fully responsive website that looks and runs beautifully across all devices." },
    { step: "03", title: "Database Setup & Secure API Integrations", desc: "We connect and configure your database structures, implement robust security protocols, and set up your core analytical tools and CRM pathways." },
    { step: "04", title: "Rigorous Quality Check & Live Launch", desc: "We execute multi-browser performance checks, optimize your loading speeds, clear your staging protocols, and manage your live server deployment." }
  ] : isLogoDesign ? [
    { step: "01", title: "Brand Strategy & Visual Direction Consultation", desc: "We sit down with your leadership team to define your market positioning, research competitor landscapes, and map out a clear artistic direction." },
    { step: "02", title: "Concept Ideation & Geometric Sketching", desc: "Our design team develops multiple distinct visual directions, experimenting with unique typography weights, balances, and symbolic iconography." },
    { step: "03", title: "Refinement & Interactive Color Iteration", desc: "We present our top design directions to your team, redline structural details based on your feedback, and finalize your core corporate color palette." },
    { step: "04", title: "Master Asset Formatting & Delivery", desc: "We construct your complete corporate brand identity package, render your final scalable files across all necessary formats, and deliver your ready-to-use brand asset kit." }
  ] : isBilling ? [
    { step: "01", title: "Workflow Audit & Systems Specification", desc: "We perform a thorough review of your operational workflows, pinpoint data bottlenecks, and layout the exact architectural blueprints for your software system." },
    { step: "02", title: "Database Architecture & Code Engineering", desc: "Our development team designs a secure database structure and engineers your custom software tool, focusing on processing speed, UI clarity, and data encryption." },
    { step: "03", title: "API Synchronization & Multi-Platform Testing", desc: "We connect your billing platform with your active banks, existing CRMs, and tax portals, running extensive stress-testing cycles to guarantee system reliability." },
    { step: "04", title: "Data Migration, Staff Training & Go-Live", desc: "We import your legacy ledger data into the new platform, lead comprehensive training workshops for your team, and activate your custom enterprise system safely." }
  ] : isMarketing ? [
    { step: "01", title: "Campaign Briefing & Script Writing", desc: "We analyze your target campaign goals, establish your core promotional messaging, and write high-impact scripts and initial storyboard layouts." },
    { step: "02", title: "Visual Content Creation & Live Filming", desc: "Our production crew handles asset design, handles motion graphics rendering, or sets up high-definition studio filming to capture your product elements beautifully." },
    { step: "03", title: "Premium Post-Production & Color Grading", desc: "We edit your video footage, sync background audio tracks, implement motion typography, and run color grading to give your content a pristine, cinematic look." },
    { step: "04", title: "Platform Optimization & Asset Delivery", desc: "We render your visual media into all necessary sizes, optimize file compression settings to guarantee instant loading speeds, and deliver your campaign-ready asset folder." }
  ] : isProprietorship ? [
    { step: "01", title: "Strategic Consultation & Name Selection", desc: "Choosing a unique name and outlining core business objectives." },
    { step: "02", title: "Acquiring Core Government Registrations", desc: "Applying for Udyam (MSME) and GST registration to give the business legal standing." },
    { step: "03", title: "Tax & Local Compliance Filing", desc: "Obtaining state-specific licenses such as the Shops & Establishment Act registration." },
    { step: "04", title: "Current Bank Account Opening", desc: "Setting up a dedicated commercial current account using government certificates." }
  ] : isPartnership ? [
    { step: "01", title: "Consultation & Brand Protection", desc: "Choosing a unique name and outlining core business objectives." },
    { step: "02", title: "Drafting the Partnership Deed", desc: "Preparing the legal partnership agreement." },
    { step: "03", title: "Filing with the Registrar of Firms (RoF)", desc: "Submitting the deed and documents for registration." },
    { step: "04", title: "Post-Registration Tax & Bank Setup", desc: "Applying for PAN, TAN, and current account once incorporated." }
  ] : isPvtLtd ? [
    { step: "01", title: "Name Approval (RUN – Reserve Unique Name)", desc: "Submission of preferred names to the Ministry of Corporate Affairs (MCA) to ensure uniqueness and eliminate trademark conflicts." },
    { step: "02", title: "Digital Signature Certificate (DSC) & DIN Allocation", desc: "Procuring Class 3 Digital Signature Certificates (DSC) for paperless electronic execution alongside Director Identification Number (DIN) allocation." },
    { step: "03", title: "Drafting MOA & AOA and Filing SPICe+ Forms", desc: "Meticulously drafting the Memorandum of Association (MOA) and Articles of Association (AOA), and submitting the bundled SPICe+ form for government review." },
    { step: "04", title: "Certificate of Incorporation, PAN, and TAN Issuance", desc: "Upon approval, the MCA issues the official Certificate of Incorporation (COI) along with corporate PAN and TAN to facilitate immediate current account setup." }
  ] : isLLP ? [
    { step: "01", title: "Digital Signature (DSC) & Name Approval (FiLLiP)", desc: "Securing Class 3 Digital Signatures and applying for the unique name on the centralized web system." },
    { step: "02", title: "Filing the Incorporation Application (FiLLiP Form)", desc: "Preparing and submitting the integrated FiLLiP Form to process partner details, assign DPINs, and register the primary office address to receive the Certificate of Incorporation." },
    { step: "03", title: "PAN & TAN Application", desc: "Government allocation of permanent PAN and TAN cards simultaneously with the incorporation approval." },
    { step: "04", title: "Drafting & Filing the LLP Agreement (Form 3)", desc: "Customizing and filing the critical LLP Agreement defining mutual rights, duties, profit ratios, and capital guidelines with the MCA within 30 days of incorporation." }
  ] : isPublicLtd ? [
    { step: "01", title: "Strategic Name Reservation (RUN Portal)", desc: "Filing name applications through the RUN portal backed by intensive trademark mapping." },
    { step: "02", title: "Digital Identity Allotment (DSC & DIN)", desc: "Procuring Class 3 Digital Signature Certificates (DSC) and handling Director Identification Number (DIN) allotment." },
    { step: "03", title: "Framing the Corporate Constitution (SPICe+)", desc: "Drafting the foundational MOA and AOA to layout business objectives and strict internal governance systems via SPICe+ setup." },
    { step: "04", title: "Incorporation and Statutory Activations", desc: "Receiving the official Certificate of Incorporation (COI) along with simultaneous issuance of corporate PAN, TAN, and EPFO/ESIC registrations." }
  ] : isOPC ? [
    { step: "01", title: "Digital Signature Certificate (DSC) Procurement", desc: "Securing Class 3 Digital Signature Certificate (DSC) for secure electronic form signing." },
    { step: "02", title: "Name Reservation & Nominee Consent", desc: "Filing the selected business name for institutional approval and drafting Form INC-3 to record the legal consent of the Nominee." },
    { step: "03", title: "Drafting MOA & AOA and Filing SPICe+", desc: "Structuring the custom constitutional parameters of the business through MOA & AOA filings inside SPICe+." },
    { step: "04", title: "Issuance of Incorporation Certificate, PAN, and TAN", desc: "Issuance of the official Certificate of Incorporation (COI) complete with unique CIN, corporate PAN, and TAN." }
  ] : isSubsidiary ? [
    { step: "01", title: "Global Documentation & Legalization", desc: "Apostilling/legalization of foreign parent documents in the home country." },
    { step: "02", title: "Digital Identity Allotment & Name Reservation", desc: "Procuring DSCs for directors and submitting preferred corporate names through the MCA portal (SPICe+ Part A)." },
    { step: "03", title: "Integrated Corporate Filing", desc: "Filing the intensive integration forms covering core business objectives, MOA, AOA, and local identity verifications (SPICe+ Part B)." },
    { step: "04", title: "Certificate of Incorporation & RBI FEMA Reporting", desc: "Receipt of the formal Certificate of Incorporation alongside mandated compliance declarations and filings to the Reserve Bank of India (RBI) under FEMA rules." }
  ] : isSection8 ? [
    { step: "01", title: "Digital Security Setup & Name Approval", desc: "Setting up digital certificates (DSC) and reserving the organizational name via the MCA registry." },
    { step: "02", title: "Applying for the Section 8 Central License", desc: "Filing an explicit petition to the central government outlining social goals to obtain a specialized Section 8 License." },
    { step: "03", title: "Framing the Constitutional Charters (MOA & AOA)", desc: "Drafting the strict non-profit guidelines and asset lock-in rules within the MOA and AOA charters." },
    { step: "04", title: "Final SPICe+ Incorporation & Tax Registration", desc: "Submitting the final integrated SPICe+ form for corporate incorporation, tax registrations, and PAN/TAN cards." }
  ] : isTrust ? [
    { step: "01", title: "Consultation & Drafting the Trust Deed", desc: "Formulating trust guidelines, rules for trustees, and beneficiary privileges inside a custom Trust Deed." },
    { step: "02", title: "Stamp Duty & Non-Judicial Stamp Paper Setup", desc: "Paying the applicable state-specific stamp duty and printing the deed on non-judicial stamp papers." },
    { step: "03", title: "Formal Filing at the Sub-Registrar Office", desc: "The Settlor, Trustees, and Witnesses present themselves at the local Sub-Registrar Office for formal deed execution." },
    { step: "04", title: "Certificate Issuance & Post-Registration Tax Setup", desc: "Issuance of the registered Trust Deed followed by applying for a dedicated permanent PAN and TAN for the trust." }
  ] : isShopAct ? [
    { step: "01", title: "State-Specific Application Preparation", desc: "We analyze your business location and map it to your state's specific labor department portal. We compile your employee data, business hours, and location proof to draft your localized application form carefully." },
    { step: "02", title: "Documentation Upload & Fee Settlement", desc: "We upload your identity proofs, rent agreements, and mandatory storefront photographs onto the state government portal. We then calculate and process the required statutory government fees." },
    { step: "03", title: "Government Review & Certificate Issuance", desc: "The local labor inspector reviews your application online. Once approved, the state labor department issues your official, digital Shops & Establishment Registration Certificate." }
  ] : isTradeLicense ? [
    { step: "01", title: "Strategic Categorization & Application Drafting", desc: "We review your business location and map your specific trade to the correct municipal ward and category. We then draft your application on the designated portal with accurate operational data." },
    { step: "02", title: "Document Verification & Fee Processing", desc: "We compile and upload your property deeds, identity proofs, and any required fire or health clearances onto the municipal portal. We calculate and pay the required government trade fees." },
    { step: "03", title: "Inspection Coordination & License Issuance", desc: "If required by your local municipal corporation, an inspector will conduct a routine check of your commercial site to verify safety compliance. Once approved, the municipal corporation issues your Trade License." }
  ] : isClra ? [
    { step: "01", title: "Procurement of Form III", desc: "We assist you in coordinating with the principal employer to secure a legally valid Form III, which acts as the foundation for your contract labor application." },
    { step: "02", title: "Profile Creation on Shram Suvidha Portal", desc: "We configure your establishment profile on the centralized Shram Suvidha or state-specific labor department portal, mapping the appropriate codes." },
    { step: "03", title: "Application Compilation & Security Deposit", desc: "We prepare and submit Form IV online, upload all self-attested documents, and process the dynamic application fees alongside the statutory Security Deposit." },
    { step: "04", title: "Scrutiny & License Grant", desc: "The licensing officer validates the workflow and documentation. Once cleared, the department issues your official digital CLRA License." }
  ] : isBocw ? [
    { step: "01", title: "Account Mapping & Jurisdictional Drafting", desc: "We register your construction business profile on the state labor department portal, verifying the precise geographic jurisdiction and municipal ward." },
    { step: "02", title: "Form I Drafting & Document Upload", desc: "Our experts carefully prepare Form I (Application for Registration of Establishment), filling in detailed allocations of worker headcounts and safety compliance declarations." },
    { step: "03", title: "Statutory Fee Settlement", desc: "We handle the digital calculation and processing of the application fees. Simultaneously, we assist in setting up proper accounts for the evaluation and future remittance of the construction welfare cess." },
    { step: "04", title: "Site Inspection & Certificate Issuance", desc: "Upon submission, a regional labor inspector may conduct an official audit to verify structural safety protocols on-site. Once approved, the department issues your formal digital BOCW Registration Certificate." }
  ] : isFssai ? [
    { step: "01", title: "Tier Identification & Portal Mapping", desc: "We analyze your proposed annual turnover and processing metrics to map your business to the exact correct tier on the centralized FoSTaC / FoSCoS portal." },
    { step: "02", title: "Application Compilation", desc: "We draft the comprehensive food safety layout application, assigning the precise food product codes and testing protocols to prevent future application modifications." },
    { step: "03", title: "Document Upload & Fee Processing", desc: "All self-attested identity sheets, safety declarations, and premise proofs are securely uploaded, and the statutory government processing fees are settled." },
    { step: "04", title: "Vetting, Inspection, & License Allocation", desc: "For State and Central tiers, a regional Food Safety Officer (FSO) may execute a physical hygiene audit of the premises. Once cleared, your formal 14-digit FSSAI License Certificate is generated." }
  ] : isDsc ? [
    { step: "01", title: "CA Selection & Portal Entry", desc: "We initiate your registration profile directly on the portal of a licensed government Certifying Authority (such as eMudhra, Capricorn, or Sify)." },
    { step: "02", title: "Data Integration & Aadhaar e-KYC", desc: "We leverage Aadhaar-linked OTP profiles to trigger instant electronic verification, completely bypassing long manual document verification processes." },
    { step: "03", title: "Video Identity Verification", desc: "The applicant records a simple 20-second automated video verification clip reading a dynamically generated security code aloud to confirm active physical presence." },
    { step: "04", title: "Token Encryption & Delivery", desc: "Upon successful verification, the electronic credentials are authenticated. We map the signature onto a cryptographic physical USB token and deliver it straight to your desk." }
  ] : isIec ? [
    { step: "01", title: "DGFT Portal Synchronization", desc: "We access the centralized DGFT portal, setting up a secure digital login mapped to the business PAN card via interactive OTP profiles." },
    { step: "02", title: "ANF-2A Electronic Compilation", desc: "Our foreign trade experts carefully draft electronic Form ANF-2A, entering specific details regarding bank parameters, business domains, and promoter shares." },
    { step: "03", title: "Token/DSC Upload & Payment", desc: "All supporting documents are attached to the form. The application is securely signed using a Class 3 Digital Signature Certificate (DSC) or Aadhaar OTP, and the flat government processing fee is settled." },
    { step: "04", title: "Instant Lifetime Generation", desc: "The DGFT system processes the validated application automatically. Once matched, your formal digital IEC Registration Certificate is instantly generated." }
  ] : isDrug ? [
    { step: "01", title: "Structural Mapping & Portal Profile", desc: "We analyze your facility dimensions to ensure they meet the minimum statutory space thresholds and create your application profile on the state Drug Controller's portal." },
    { step: "02", title: "Form Drafting & Technical Mapping", desc: "We draft Form 19 (for retail/wholesale distribution) and attach the registered pharmacist profiles, machine calibrations, and cooling charts." },
    { step: "03", title: "Fee Processing & Documentation Upload", desc: "We upload all academic records, blueprints, and property agreements, and process the state-specific statutory license generation fees online." },
    { step: "04", title: "Physical Site Inspection & License Grant", desc: "A regional Drug Inspector (DI) schedules a rigorous physical audit of your premises to verify cold-chain storage and safety layout parameters. Once cleared, your official Drug License Number is formally issued." }
  ] : isIcegate ? [
    { step: "01", title: "Portal Account Structure", desc: "We access the official ICEGATE centralized system, initiating a secure custom user registration sequence linked directly to your active IEC profile." },
    { step: "02", title: "Data Fields Mapping", desc: "Our customs compliance team accurately inputs your primary business location codes, sea/air port registration data, and banking data to ensure flawless document processing." },
    { step: "03", title: "DSC Verification & Document Upload", desc: "We execute a secure digital handshake by linking your Class 3 Digital Signature Certificate (DSC) to the ICEGATE identity database and uploading all verified authorization files." },
    { step: "04", title: "Customs Cell Approval", desc: "The central processing team of the customs department reviews the data linkages. Once verified, your ICEGATE User ID and Portal Clearance are activated." }
  ] : isIso ? [
    { step: "01", title: "Gap Analysis & Standard Selection", desc: "We analyze your current workflow against your chosen ISO standard to identify operational gaps and help you build efficient Standard Operating Procedures (SOPs)." },
    { step: "02", title: "System Implementation & Document Framing", desc: "We guide your management team in implementing necessary quality logs, safety tracking systems, and operational controls to align with international standards." },
    { step: "03", title: "Internal Quality Audit", desc: "We coordinate an initial internal audit review to verify that your workflows match the chosen ISO framework and correct any operational anomalies." },
    { step: "04", title: "External Audit & ISO Issuance", desc: "An accredited external Certification Body (CB) executes a formal audit of your systems. Once satisfied, they formally issue your international ISO Certification." }
  ] : isPf ? [
    { step: "01", title: "Shram Suvidha Registration", desc: "We access the centralized Shram Suvidha unified labor portal, setting up your corporate account using an authorized signatory's Class 3 DSC or Aadhaar profile." },
    { step: "02", title: "Profile Setup & Code Allocation", desc: "Our corporate HR compliance team drafts the application, entering specific setup details, primary industrial classifications (NIC codes), and your active current bank details to obtain your unique 15-digit PF Establishment Code." },
    { step: "03", title: "Monthly ECR Generation & Filing", desc: "Every month, our team processes your payroll data, drafts the Electronic Challan-cum-Return (ECR), calculates the mandatory employer-employee contributions, and generates the online payment challan." },
    { step: "04", title: "Annual & Event-Based Compliances", desc: "We manage structural event-based updates, including generating Universal Account Numbers (UAN) for new hires, processing employee KYC verifications, handling online transfers, and executing exit regularizations." }
  ] : isPsara ? [
    { step: "01", title: "Antecedent Verification Filing", desc: "We assist you in filing an intense background check application with the local police department to verify the clean legal records of all promoters." },
    { step: "02", title: "Training MoU Execution", desc: "We coordinate with a state-certified security academy to secure your mandatory guard training partnership agreement, ensuring compliance with state regulations." },
    { step: "03", title: "Application Compilation", desc: "We assemble and submit your comprehensive license application to the state's PSARA Controlling Authority, accompanied by uniform blueprints and tax compliance certificates." },
    { step: "04", title: "Department Inspection & License Grant", desc: "A Controlling Officer or senior police inspector performs a physical audit of your office space and training logs. Once cleared, your official PSARA License is generated." }
  ] : isEsic ? [
    { step: "01", title: "Labor Portal Account Integration", desc: "We set up your corporate account on the unified Shram Suvidha / ESIC portal using your digital security keys or Aadhaar profiles." },
    { step: "02", title: "Employer Code Generation", desc: "We carefully draft the employer enrollment application, filling in precise operational details, business category classifications, and your current bank details to secure your permanent ESIC registration code." },
    { step: "03", title: "Monthly Workforce Filing & Challans", desc: "Every month, we upload your employee attendance and wage sheets to the portal, compute the dynamic monthly contributions, and generate the mandatory online payment challans before the monthly deadlines." },
    { step: "04", title: "Employee Onboarding & Temporary Cards", desc: "Our team manages the online registration of new employees, updates nomadic family health records, and generates their Temporary Identification Cards (TIC) so your team can access medical care instantly." }
  ] : isCopyright ? [
    { step: "01", title: "Classification & Application Filing", desc: "We review your creative work and file Form XIV on the centralized Indian Copyright Office portal, meticulously cataloging the author and owner details." },
    { step: "02", title: "Filing Fee & Diary Number Generation", desc: "We process the official government copyright vetting fees. Once submitted, the system generates a unique Diary Number to track your application." },
    { step: "03", title: "Mandatory 30-Day Waiting Window", desc: "The law enforces a strict 30-day waiting period to allow any external parties to file objections against your copyright claim." },
    { step: "04", title: "Vetting & Registration Issuance", desc: "If no objections arise, a copyright examiner reviews your work for uniqueness. Once cleared, the department issues your formal Registration Certificate (ROC)." }
  ] : isStartup ? [
    { step: "01", title: "Profile Setup on the Startup India Hub", desc: "We build your corporate profile on the unified Startup India digital portal, detailing your industry sector and stage of development." },
    { step: "02", title: "DPIIT Recognition Application", desc: "Our startup consultants carefully draft your recognition application, focusing on your business's innovation aspects, scalability metrics, and market impact." },
    { step: "03", title: "Document Upload & Self-Certification", desc: "We upload your incorporation proofs and pitch deck, and complete the mandatory self-certification forms regarding your startup's eligibility." },
    { step: "04", title: "Review & DPIIT Certificate Issuance", desc: "The Department for Promotion of Industry and Internal Trade (DPIIT) reviews your application. Once approved, they issue your formal Startup India Recognition Certificate." }
  ] : isTrademark ? [
    { step: "01", title: "Comprehensive Trademark Search", desc: "We perform an intensive, multi-layered search across the official IP India database to check for any conflicting or similar existing marks before filing." },
    { step: "02", title: "Class Selection & Form TM-A Filing", desc: "We identify your correct trade classes and file Form TM-A on the official Intellectual Property portal, securely signing it with digital verification keys." },
    { step: "03", title: "Instant '™' Application Status", desc: "As soon as the application is successfully submitted, you receive your official filing receipt, allowing you to use the ™ symbol next to your brand name immediately." },
    { step: "04", title: "Vetting, Examination, & Publication", desc: "A government trademark examiner reviews your application. Once cleared, it is published in the official Trademark Journal. If no objections arise, your certificate is generated." }
  ] : isUdyam ? [
    { step: "01", title: "Aadhaar Validation Sequence", desc: "We access the official, centralized Udyam Registration government portal, validating the applicant's Aadhaar number via secure OTP profiles." },
    { step: "02", title: "Corporate Profile Structuring", desc: "We enter your precise business layout parameters, primary industrial classifications (NIC codes), and matching employee headcounts." },
    { step: "03", title: "Tax & Turnover Integration", desc: "The Udyam system securely synchronizes your tax metrics and financial turnover data directly from the Income Tax and GST systems automatically." },
    { step: "04", title: "Instant Certificate Generation", desc: "All data points are validated by the online system. Once processed, your official lifetime-valid Udyam Registration Certificate is instantly generated." }
  ] : isPt ? [
    { step: "01", title: "State-Specific Portal Configuration", desc: "We register your business on the respective state's commercial tax department portal based on your operational address." },
    { step: "02", title: "PTEC & PTRC Code Procurement", desc: "Our tax compliance experts draft and submit the localized application forms along with required property proofs to secure your PTEC and PTRC identification numbers." },
    { step: "03", title: "Salary Deduction & Monthly Retainer Filing", desc: "We audit your monthly payroll to execute accurate slab deductions and handle your monthly or annual PTRC returns." },
    { step: "04", title: "Annual PTEC Payment Settlement", desc: "We calculate your business's structural corporate PT liabilities and ensure the timely online payment of your annual PTEC fees to protect you from heavy late-filing interest penalties." }
  ] : isLwf ? [
    { step: "01", title: "State LWF Board Mapping", desc: "We analyze your regional office locations and map your business to the correct state-specific Labour Welfare Fund Board portal." },
    { step: "02", title: "Slab Evaluation & Deduction Management", desc: "Our labor compliance experts review your payroll data during the respective state's contribution periods to extract the precise employee deductions and match them with the required employer share." },
    { step: "03", title: "Online Return Filing & Challans", desc: "We compile the required statutory data sheets, file the localized LWF returns online, and generate the electronic payment receipts before the state-mandated due dates." },
    { step: "04", title: "Statutory Audit Maintenance", desc: "We ensure that all historical LWF payment vouchers and employee deduction logs are systematically formatted, keeping your business ready for routine labor department inspection reviews." }
  ] : isPosh ? [
    { step: "01", title: "POSH Policy Drafting & IC Setup", desc: "Our corporate lawyers draft a comprehensive, compliant POSH policy for your company and assist you in selecting and appointing the required members for your Internal Committee." },
    { step: "02", title: "External Member Tie-Up", desc: "We connect your business with certified, experienced external POSH experts to fulfill your statutory IC composition mandates." },
    { step: "03", title: "Employee Sensitization & Training Workshops", desc: "We organize mandatory, interactive awareness and sensitization training modules for your employees and leadership team to ensure widespread workplace alignment." },
    { step: "04", title: "Annual Reporting & External Filing", desc: "Every calendar year, we audit your IC's activities, draft the mandatory Annual POSH Report, and assist in filing it with the local District Officer to keep your entity fully compliant." }
  ] : isRegisters ? [
    { step: "01", title: "Labor Law Mapping & Framework Setup", desc: "We review your business category, headcount, and state location to map the exact set of statutory registers your entity is legally required to maintain." },
    { step: "02", title: "Digital Register Configuration", desc: "Our compliance team designs and configures your digital statutory registers, linking them with your active HRMS or payroll tools to ensure seamless tracking." },
    { step: "03", title: "Periodic Maintenance & Verification", desc: "We execute continuous monthly reviews of your muster rolls, wage registers, leave trackers, and overtime records to eliminate compliance mismatches." },
    { step: "04", title: "Audit Readiness & Inspector Facing", desc: "We ensure your entire historical register stack is up to date, accurately signed, and formatted to easily pass unexpected labor department audits and inspections." }
  ] : isAdvisor ? [
    { step: "01", title: "Initial Compliance Health Check", desc: "We execute a comprehensive compliance audit across all your operational branches, identifying areas of high regulatory or financial risk." },
    { step: "02", title: "Policy Realignment & Standard Drafting", desc: "Our labor lawyers update your internal employment policies, contractor agreements, and salary structures to ensure complete legal alignment." },
    { step: "03", title: "Daily Consultation & Notice Management", desc: "We provide your management team with immediate access to expert legal counsel for daily operational questions, employee issues, and handling official government communications." },
    { step: "04", title: "Strategic Audit Reports & Continuous Updates", desc: "We conduct periodic compliance reviews and provide your executive board with detailed risk reports and strategies to protect your business as labor laws evolve." }
  ] : isItr ? [
    { step: "01", title: "Data Gathering & Tax Profile Mapping", desc: "We compile your financial data from bank statements, investment receipts, and asset purchase files. We then cross-verify this data against your official AIS, TIS, and Form 26AS profiles." },
    { step: "02", title: "Tax Liability Computation", desc: "Our tax consultants compute your total gross income, apply available deductions under the appropriate tax regime, and calculate your exact net tax liability or tax refund." },
    { step: "03", title: "Form Selection & Schema Preparation", desc: "We select the correct ITR form matching your entity type and draft the digital return schema, ensuring complete disclosure of domestic and foreign assets." },
    { step: "04", title: "Filing & e-Verification", desc: "The prepared return is uploaded directly onto the centralized Income Tax e-filing portal. We complete the mandatory electronic verification via Aadhaar OTP or Digital Signature Certificate (DSC)." }
  ] : isAssessment ? [
    { step: "01", title: "Notice Analysis & Scope Mapping", desc: "We review the formal assessment notice to identify the exact transactional variations or risk parameters flagged by the department's algorithms." },
    { step: "02", title: "Reconciliation & Evidence Compilation", desc: "Our tax defense experts reconcile your internal ledgers, banking lines, and invoicing registers, preparing a robust file of supporting evidence." },
    { step: "03", title: "Drafting Submissions & Legal Backing", desc: "We draft professional, comprehensive written responses to the Assessing Officer, backing our explanations with relevant case laws and past CBDT circulars." },
    { step: "04", title: "Portal Upload & Order Tracking", desc: "We submit the entire evidence file through the government's online portal. We track your case through subsequent queries until the final Assessment Order is issued." }
  ] : isNotice ? [
    { step: "01", title: "DIN Authentication & Classification", desc: "We verify the authenticity of the notice via the e-filing portal using its unique Document Identification Number (DIN) and assess the level of legal risk involved." },
    { step: "02", title: "Data Gaps Auditing", desc: "Our tax experts analyze the variations between your filed return and the data flagged by the department's systems." },
    { step: "03", title: "Drafting Legal Explanations", desc: "We write a formal, structured response providing a clear explanation for each flagged transaction, backing our response with relevant banking logs and property records." },
    { step: "04", title: "Portal Submission & Resolution Tracking", desc: "We upload the legal response and supporting files onto the income tax portal within the mandated response window. We monitor your case status until the department accepts the explanation." }
  ] : isTds ? [
    { step: "01", title: "Challan Mapping & Verification", desc: "We extract and verify all your monthly ITNS 281 challans from the databases, ensuring the tax deposited matches your internal accounts perfectly." },
    { step: "02", title: "PAN Validation & Slab Extraction", desc: "Our data engines run automated validations against the deductees' PAN cards to confirm active status and check that correct deduction rates were applied." },
    { step: "03", title: "Drafting the Return via FVU Engine", desc: "We compile your transaction data into the standard electronic format, run it through the government's File Validation Utility (FVU) tool, and resolve any structural errors." },
    { step: "04", title: "Filing Submission & Certificate Generation", desc: "We submit your validated TDS/TCS file to the central registry. Once processed, we generate your official Form 16 / 16A / 27D Certificates to distribute to your team." }
  ] : isRevisedItr ? [
    { step: "01", title: "Error Analysis & Eligibility Review", desc: "We review your original ITR filing against your financial statements to identify omissions and ensure your case meets the legal conditions for a Revised Return or an Updated ITR-U return." },
    { step: "02", title: "Recalculating Tax Liabilities", desc: "We update your financial model, calculate your new gross total income, incorporate the missing revenue elements, and determine your final tax balance along with interest." },
    { step: "03", title: "Processing Additional Tax Payments", desc: "We help you generate the correct payment challans to clear any additional tax dues and statutory penalties via the online portal." },
    { step: "04", title: "Filing the Updated Return Scheme", desc: "We draft the corrected return file, choose the appropriate revision/update section codes, and upload the return onto the Income Tax portal, validating with a Class 3 DSC." }
  ] : isGstNew ? [
    { step: "01", title: "TRN Generation & Profile Setup", desc: "We access the centralized GST portal to complete Part-A of the registration, validating your business PAN, email address, and mobile numbers to secure a Temporary Reference Number (TRN)." },
    { step: "02", title: "Compiling Part-B Application", desc: "We log in using the TRN to draft the comprehensive Part-B application, mapping your precise HSN codes or SAC codes and uploading all property deeds." },
    { step: "03", title: "Aadhaar Authentication Linkage", desc: "We initiate the mandatory online Aadhaar Authentication link for the primary promoters, allowing for fast-track verification and bypassing initial physical site inspections." },
    { step: "04", title: "Clarification Resolution & GSTIN Issuance", desc: "We track your application. If the tax officer raises an inquiry (Form GST REG-03), we draft and file a prompt response (REG-04) to secure your official GST Registration Certificate." }
  ] : isGstFiling ? [
    { step: "01", title: "Invoice Formatting & Data Check", desc: "Every month or quarter, our compliance team reviews your sales registers, formats the data into standard schemas, and cross-checks details to eliminate layout errors." },
    { step: "02", title: "ITC Reconciliations", desc: "We perform a thorough digital reconciliation, matching your inbound purchase ledgers against your official GSTR-2B statement to identify missing vendor uploads and maximize your valid ITC claims." },
    { step: "03", title: "Form GSTR-1 Drafting & Portal Upload", desc: "We upload your outward sales data to the GST portal, map the invoices to the correct client GSTINs, and file your GSTR-1 return using secure e-verification tools." },
    { step: "04", title: "Tax Calculation & GSTR-3B Submission", desc: "We calculate your final net GST liability by offsetting your collected sales tax against your verified input tax credits, handle payments, and file your summary GSTR-3B return." }
  ] : isGstAnnual ? [
    { step: "01", title: "Multi-Layered Data Reconciliation", desc: "Our indirect tax experts execute a complete, three-way data reconciliation matching your Audited Books vs. GSTR-1 vs. GSTR-3B to catch any variations." },
    { step: "02", title: "Input Tax Credit Vetting", desc: "We perform a thorough audit of your annual input tax credits, matching purchase ledgers against portal records to identify unclaimed credits or catch ineligible ITC that needs reversal." },
    { step: "03", title: "Drafting Form GSTR-9 & 9C", desc: "We compile your consolidated data into the annual return forms, accounting for any delayed tax payments made via Form DRC-03 during the year." },
    { step: "04", title: "Portal Verification & Final Submission", desc: "The completed annual forms are reviewed with your financial leadership team, signed using a Class 3 DSC, and uploaded onto the GST common portal." }
  ] : isGstCancel ? [
    { step: "01", title: "Voluntary Cancellation Filing (REG-16)", desc: "We audit your remaining business stock, calculate input tax credit reversals on inventory, prepare final filings, and submit Form GST REG-16." },
    { step: "02", title: "Filing Final Return Form GSTR-10", desc: "Within three months of a voluntary cancellation order, we draft and file your mandatory Final Return (GSTR-10) to formally conclude your indirect tax profile." },
    { step: "03", title: "Suo-Motu Defense & Revocation Application", desc: "For department-cancelled profiles, we identify filing gaps, calculate outstanding late fees, and file Form GST REG-21 to request formal restoration." },
    { step: "04", title: "Officer Clarification Resolution", desc: "We coordinate directly with the regional tax office, responding promptly to any notices (REG-23) to secure an order restoring your profile to an 'Active' status." }
  ] : isGstNotice ? [
    { step: "01", title: "Notice Analysis & Scope Mapping", desc: "We perform a thorough review of the notice to pinpoint the exact transaction discrepancies or input tax credit variations flagged by the systems." },
    { step: "02", title: "Reconciling Data Discrepancies", desc: "Our indirect tax experts cross-match your internal sales registers, purchase ledgers, and portal logs to identify the root cause of the discrepancy." },
    { step: "03", title: "Drafting Legal Explanations", desc: "We write a formal, structured response providing a clear explanation for each flagged transaction, backing arguments with relevant statutory guidelines and circulars." },
    { step: "04", title: "Filing Form Replies & Case Closure", desc: "We file your formal response online (using forms like ASMT-11) and track your case status through subsequent hearings until the tax officer officially closes the file." }
  ] : isMcaCompliance ? [
    { step: "01", title: "Financial Vetting & Auditor Coordination", desc: "We assist your accounting teams in organizing raw ledger accounts, balancing sheets, and coordinating with statutory auditors to secure your formal Auditor's Report." },
    { step: "02", title: "Secretarial Drafting & Approvals", desc: "Our corporate secretarial experts draft the mandatory Director's Report, notice of Annual General Meeting (AGM), and official board resolutions to validate your annual corporate proceedings." },
    { step: "03", title: "Form Packaging & DSC Authentication", desc: "We compile your audited numbers into specialized MCA forms (AOC-4, MGT-7, Form 8, or Form 11), perform pre-scrutiny checks, and authenticate them using the directors' Class 3 DSC keys." },
    { step: "04", title: "RoC Filing & Corporate Maintenance", desc: "We upload the completed form stack directly to the MCA portal, clear the required government filing fees, track processing milestones, and deliver the formal corporate approval receipts." }
  ] : isMcaName ? [
    { step: "01", title: "Trademark Search & Name Mapping", desc: "We run a rigorous search across the trademark registry and MCA directories to ensure your preferred corporate names are completely clear of conflict." },
    { step: "02", title: "Name Reservation via RUN Portal", desc: "We submit your preferred business names to the MCA through the centralized web system for official name approval and reservation." },
    { step: "03", title: "Drafting Resolutions & MOA/AOA Alteration", desc: "Once the name is approved, we assist in organizing an Extraordinary General Meeting (EGM) to pass the mandatory Special Resolution and draft the newly updated clauses inside your MOA and AOA." },
    { step: "04", title: "Filing Form MGT-14 & INC-24", desc: "We file Form MGT-14 to register the special resolution, followed by Form INC-24 to secure formal central government approval. Upon validation, the RoC issues your fresh Certificate of Incorporation." }
  ] : isMcaAddress ? [
    { step: "01", title: "Board Meeting Execution", desc: "We assist you in organizing a Board Meeting to pass the resolution approving the office relocation and specifying the exact effective date of the change." },
    { step: "02", title: "Filing Form INC-22", desc: "For standard office relocations within the same city or RoC jurisdiction, we compile the new property deeds and landlord NOCs to file Form INC-22 online within 30 days of the board resolution." },
    { step: "03", title: "Regional Director Petitions", desc: "If you are moving between different RoC jurisdictions or crossing state lines, we handle the publication of mandatory notices in newspapers, draft formal petitions to the Regional Director, and handle the filing of Form MGT-14 and Form INC-23." },
    { step: "04", title: "RoC Update Tracking", desc: "The MCA verifies the physical property records. Once approved, the new corporate office location is officially updated on the public master data system." }
  ] : isMcaShares ? [
    { step: "01", title: "AOA Review & Notice of Intention", desc: "We perform an audit of your Articles of Association to confirm your company's precise share transfer rules and help the exiting shareholder file their formal Notice of Intention to transfer equity." },
    { step: "02", title: "Executing Form SH-4 & Stamp Duty Settlement", desc: "We draft your formal Form SH-4 transfer instrument, calculate the required state-specific stamp duty (typically 0.015% of the total market value), and ensure the physical stamp certificates are securely attached to the form." },
    { step: "03", title: "Board Review & Resolution Passage", desc: "The completed SH-4 forms along with physical share certificates are submitted to the company board. We compile the board minutes and draft the official resolution approving the transfer." },
    { step: "04", title: "Register Updating & Certificate Endorsement", desc: "Once approved, we update your internal Register of Transfers and Register of Members (Form MGT-1). We then endorse the reverse side of the physical share certificates to formally complete the equity allocation." }
  ] : isMcaMoa ? [
    { step: "01", title: "Board Authorization & EGM Notice", desc: "We assist you in organizing a Board Meeting to pass a resolution approving the proposed amendments and authorize a notice to be sent to shareholders for an EGM." },
    { step: "02", title: "Special Resolution Passage", desc: "We draft the formal minutes and resolutions for the Extraordinary General Meeting (EGM), ensuring the mandatory 75% shareholder approval is met." },
    { step: "03", title: "Form Packaging & Filing", desc: "For standard text amendments, we file Form MGT-14 with the RoC within 30 days of the resolution. If you are increasing your authorized capital, we also prepare and file Form SH-7." },
    { step: "04", title: "RoC Verification & Certification", desc: "The Registrar of Companies reviews the amended clauses against the Companies Act framework. Once approved, the altered copies of your MOA and AOA are officially registered." }
  ] : isMcaDirectors ? [
    { step: "01", title: "Securing DIN & Verifying Consent", desc: "For new directors without an existing identity number, we apply for a fresh DIN via the MCA portal. We then assist in compiling the mandatory consent documents (DIR-2) and financial disclosures (MBP-1)." },
    { step: "02", title: "Passing the Corporate Resolution", desc: "We organize the required Board Meeting or Extraordinary General Meeting (EGM) to pass the formal resolution approving the appointment or tracking the removal/resignation." },
    { step: "03", title: "Filing Form DIR-12 with the RoC", desc: "Our team compiles the resolution documents, consent letters, and identity papers to file Form DIR-12 on the MCA portal within 30 days of the effective change date." },
    { step: "04", title: "Updating Internal Statutory Registers", desc: "Once the MCA issues its electronic approval receipt, we update your internal Register of Directors and Key Managerial Personnel to ensure complete compliance." }
  ] : isMcaWinding ? [
    { step: "01", title: "Closing Bank Accounts & Settling Dues", desc: "We assist you in clearing out any remaining business assets, settling all pending creditor claims, and securing your formal Bank Account Closure Certificate." },
    { step: "02", title: "Compiling Financial Statements & Affidavits", desc: "Our compliance experts work with practicing CAs to draft your final Statement of Accounts. Simultaneously, we prepare the required STK-3 Affidavits and STK-4 Indemnity Bonds on appropriate stamp papers." },
    { step: "03", title: "Filing Form STK-2 with the MCA", desc: "We bundle the financial statements, director indemnities, closure approvals, and board resolutions to file Form STK-2 on the MCA portal along with the flat government closure fees." },
    { step: "04", title: "Public Notice & Final Dissolution", desc: "The RoC reviews your application and publishes a public notice for 30 days to invite any potential objections from the public or tax departments. If no objections are raised, the RoC officially strikes off your company name." }
  ] : isMcaRevival ? [
    { step: "01", title: "Drafting and Serving the NCLT Petition", desc: "We draft a comprehensive legal petition (Form NCLT-1) outlining the business's active operations. Copies of the petition are formally served to the regional Registrar of Companies (RoC) and the Income Tax department for their review." },
    { step: "02", title: "NCLT Hearings & Representation", desc: "Our experienced corporate advocates represent your business interests during the formal NCLT bench hearings, answering questions from the tribunal and presenting evidence of active operations." },
    { step: "03", title: "Securing the NCLT Restoration Order", desc: "Upon review of the evidence, the NCLT bench issues a formal order directing the RoC to restore the company's status from \"Struck Off\" to \"Active,\" subject to processing fees and outstanding penalties." },
    { step: "04", title: "Filing Form INC-28 & Overdue Returns", desc: "We file the physical NCLT Restoration Order with the RoC using Form INC-28 within 30 days to officially reactivate your company code. Once active, we upload all your pending annual financial returns to ensure full compliance." }
  ] : isMcaRegisters ? [
    { step: "01", title: "Corporate Structure Audit", desc: "We execute a detailed audit of your historical incorporation papers, filing receipts, and meeting minutes to ensure your current registers accurately match the official records on the MCA portal." },
    { step: "02", title: "Digital Register Configuration", desc: "Our corporate secretarial team designs and configures your digital secretarial registers, organizing them into the mandated statutory formats (MGT-1, MGT-2, CHG-7, etc.)." },
    { step: "03", title: "Real-Time Event Maintenance", desc: "Whenever your business undergoes a change—such as a director shift, equity issuance, or securing a bank loan—we update the corresponding registers within the state-mandated timelines (typically within 7 days)." },
    { step: "04", title: "Annual Certification & Audit Support", desc: "At the close of the financial year, we audit your complete register stack, extract clean verification files, and prepare your compliance folders to easily pass your annual statutory audits." }
  ] : isContractDrafting ? [
    { step: "01", title: "Initial Strategic Consultation", desc: "We meet with your leadership team to understand your business goals, identify industry-specific operational risks, and lay out the core architecture of the agreement." },
    { step: "02", title: "First Draft Formulation", desc: "Our corporate lawyers draft the contract from scratch, carefully structuring all commercial definitions, operational milestones, and protective indemnity clauses." },
    { step: "03", title: "Collaborative Review & Revision", desc: "We present the initial draft to your team, walk you through the protective clauses, and execute necessary revisions to match your feedback." },
    { step: "04", title: "Final Delivery & Execution Support", desc: "We deliver the finalized, print-ready contract complete with clear signing templates and signature guidelines. We also advise on appropriate stamp duties." }
  ] : isLegalNotices ? [
    { step: "01", title: "Case Review & Strategy Mapping", desc: "We review your signed agreements, invoice logs, and communication histories to evaluate the strength of your claim and map out a notification strategy." },
    { step: "02", title: "Drafting the Legal Notice", desc: "Our experienced dispute resolution lawyers draft a precise, highly impactful legal notice, detailing the facts of the breach and referencing contractual terms." },
    { step: "03", title: "Formal Dispatch", desc: "We print the notice on our formal legal letterhead and dispatch it via Registered Post with Acknowledgement Due (AD) and secure electronic email channels." },
    { step: "04", title: "Tracking & Negotiation Support", desc: "We monitor the delivery status and manage the mandatory response window. If the defaulting party reaches out to settle, we guide you through the negotiations." }
  ] : isBondDrafting ? [
    { step: "01", title: "Risk Assessment & Slab Structuring", desc: "We meet with your HR or project operations teams to assess your investments, identify potential breach risks, and determine a reasonable, legally enforceable penalty value." },
    { step: "02", title: "Drafting the Legal Framework", desc: "Our corporate lawyers draft the bond document from scratch, incorporating strong, absolute indemnity structures and clear definitions of what constitutes a default." },
    { step: "03", title: "Guarantor Integration Setup", desc: "If your risk strategy requires an external guarantor, we incorporate strong joint-and-several liability clauses that allow direct recovery from the guarantor." },
    { step: "04", title: "Execution & Stamp Duty Advice", desc: "We deliver the print-ready bond file accompanied by explicit guidelines regarding appropriate state-specific non-judicial stamp papers and notarization requirements." }
  ] : isEmploymentContract ? [
    { step: "01", title: "Onboarding Risk Consultation", desc: "We review your company's HR workflows and operational structure to identify your key data protection priorities and compliance needs." },
    { step: "02", title: "Formulating the Employment Framework", desc: "Our labor lawyers draft the agreement from scratch, balancing clear operational instructions with strong data protection and IP ownership clauses." },
    { step: "03", title: "Tiered Template Customization", desc: "We revise the drafts to align with different levels of management, delivering distinct, optimized agreements for entry-level staff, core developers, and C-suite executives." },
    { step: "04", title: "Delivery & Onboarding Integration", desc: "We deliver your finalized, print-ready employment templates accompanied by clear signing guidelines, helping you integrate these legal protections seamlessly." }
  ] : isNda ? [
    { step: "01", title: "Data Risk Assessment", desc: "We analyze your data sharing workflows to identify your most vulnerable proprietary assets and understand the exact context of your business discussions." },
    { step: "02", title: "Drafting the NDA Framework", desc: "Our corporate lawyers build the agreement from scratch, incorporating broad yet precise definitions of what constitutes confidential information and setting out handling protocols." },
    { step: "03", title: "Incorporating Enforcement Clauses", desc: "We embed strong, absolute injunctive relief clauses, data return requirements, and clear financial penalty frameworks to ensure immediate damages if a leak occurs." },
    { step: "04", title: "Final Delivery", desc: "We deliver the finalized, print-ready NDA file complete with clear signing templates and signature guidelines. We also advise on appropriate state stamp duties." }
  ] : isMou ? [
    { step: "01", title: "Deal Structuring Consultation", desc: "We meet with your business development team to review the commercial deal, identify potential operational bottlenecks, and outline core goals." },
    { step: "02", title: "Formulating the MOU Draft", desc: "Our corporate lawyers draft the agreement from scratch, carefully separating non-binding statements of intent from legally binding exclusivity and non-disclosure clauses." },
    { step: "03", title: "Collaborative Review & Revision", desc: "We present the initial draft to your team, walk you through the protective clauses, and execute necessary revisions to match your feedback and negotiation strategy." },
    { step: "04", title: "Final Delivery", desc: "We deliver the finalized, print-ready MOU file complete with clear signing templates and signature guidelines, helping you move forward with complete confidence." }
  ] : isFranchise ? [
    { step: "01", title: "Expansion Model Consultation", desc: "We analyze your business model, operational risks, and expansion goals to determine the safest legal structure for your franchise or licensing network." },
    { step: "02", title: "Formulating the Agreement Framework", desc: "Our corporate lawyers draft the agreement from scratch, balancing clear operational guidelines with strong intellectual property and brand protection clauses." },
    { step: "03", title: "Customizing Commercial Clauses", desc: "We adjust the agreement to match your unique financial model, incorporating custom territory limits, marketing contribution rules, and dispute resolution systems." },
    { step: "04", title: "Delivery & Network Onboarding Integration", desc: "We deliver your finalized, print-ready agreement templates complete with clear signature guidelines, helping you scale your business network safely." }
  ] : isShareholder ? [
    { step: "01", title: "Term Sheet Audit & Risk Review", desc: "We perform a thorough audit of your term sheet or commercial joint venture brief to identify potential operational risks and layout a clear structural strategy." },
    { step: "02", title: "Formulating the Contract Blueprint", desc: "Our corporate lawyers draft the agreement from scratch, translating complex financial terms into clear, enforceable clauses covering board control and voting weights." },
    { step: "03", title: "Collaborative Review & Revision", desc: "We present the initial draft to your leadership team, walk you through the protective clauses, and execute necessary revisions to match your feedback." },
    { step: "04", title: "Final Delivery & Execution Support", desc: "We deliver the finalized, print-ready agreement complete with clear signature templates. We also handle subsequent updates to your company's internal Articles of Association (AOA)." }
  ] : isDocumentReview ? [
    { step: "01", title: "Initial Risk Briefing", desc: "We meet with your business operations team to review the background of the transaction and identify your key commercial goals and non-negotiable terms." },
    { step: "02", title: "Comprehensive Redline Audit", desc: "Our corporate lawyers perform a thorough line-by-line review of the document, inserting detailed comments to explain hidden risks and highlighting clauses requiring modification." },
    { step: "03", title: "Active Clause Modification", desc: "We directly rewrite problematic text, inserting strong liability caps, clean payment terms, and balanced termination rules to shift the contract into a fair, secure legal balance." },
    { step: "04", title: "Final Delivery & Consultation", desc: "We deliver a fully redlined version showing all tracked changes alongside a clean, execution-ready copy. We review updates with your team to ensure you are fully prepared." }
  ] : isDarpan ? [
    { step: "01", title: "NITI Aayog Portal Configuration", desc: "We access the centralized NGO Darpan portal, building a fresh organizational identity profile directly linked to your business PAN card." },
    { step: "02", title: "Executive Mapping Sequence", desc: "Our compliance experts accurately input the individual identity profiles, Aadhaar numbers, and dynamic contact credentials of all active board members to ensure complete transparency." },
    { step: "03", title: "Sectoral Activities Specification", desc: "We map your specific non-profit activities to the correct government sectors, detailing your primary geographic footprint and active project locations." },
    { step: "04", title: "Validation & Unique ID Issuance", desc: "The NITI Aayog system reviews your attached deeds and board data. Once cleared, your formal NGO DARPAN Unique ID Number is generated." }
  ] : isProprietorship ? [
    { step: "01", title: "Strategic Consultation & Name Selection", desc: "Choosing a unique name and outlining core business objectives to give the business legal standing." },
    { step: "02", title: "Acquiring Core Government Registrations", desc: "Applying for Udyam (MSME) and GST registration to give the business legal standing." },
    { step: "03", title: "Tax & Local Compliance Filing", desc: "Obtaining state-specific licenses such as the Shop & Establishment Act registration." },
    { step: "04", title: "Current Bank Account Opening", desc: "Setting up a dedicated commercial current account using government certificates." }
  ] : isPartnership ? [
    { step: "01", title: "Consultation & Brand Protection", desc: "We consult with all partners to finalize the firm name, profit-sharing ratios, and business objectives. We conduct a trademark search to ensure your firm name is unique and legally protectable." },
    { step: "02", title: "Drafting the Partnership Deed", desc: "Our legal experts draft a comprehensive Partnership Deed covering capital contributions, profit/loss ratios, partner duties, exit clauses, and dispute resolution mechanisms." },
    { step: "03", title: "Filing with the Registrar of Firms (RoF)", desc: "We submit the partnership deed along with all supporting documents to the state's Registrar of Firms portal and pay the applicable government stamp duty and registration fees." },
    { step: "04", title: "Post-Registration Tax & Bank Setup", desc: "Once legally incorporated, we apply for the firm's dedicated PAN and TAN, set up GST and Udyam MSME registrations, and provide the complete legal kit required for opening a current account." }
  ] : isPvtLtd ? [
    { step: "01", title: "Name Approval (RUN – Reserve Unique Name)", desc: "Submission of preferred names to the Ministry of Corporate Affairs (MCA) to ensure uniqueness and eliminate trademark conflicts." },
    { step: "02", title: "Digital Signature Certificate (DSC) & DIN Allocation", desc: "Procuring Class 3 Digital Signature Certificates (DSC) for paperless electronic execution alongside Director Identification Number (DIN) allocation." },
    { step: "03", title: "Drafting MOA & AOA and Filing SPICe+ Forms", desc: "Meticulously drafting the Memorandum of Association (MOA) and Articles of Association (AOA), and submitting the bundled SPICe+ form for government review." },
    { step: "04", title: "Certificate of Incorporation, PAN, and TAN Issuance", desc: "Upon approval, the MCA issues the official Certificate of Incorporation (COI) along with corporate PAN and TAN to facilitate immediate current account setup." }
  ] : isGst ? [
    { step: "01", title: "Document Collection", desc: "Submit your documents via our secure portal or WhatsApp." },
    { step: "02", title: "Application Preparation", desc: "Our team prepares and verifies your GST application accurately." },
    { step: "03", title: "Government Filing", desc: "We file the application on the GSTN portal and generate your ARN." },
    { step: "04", title: "Certificate Delivery", desc: "Your GSTIN and GST certificate are delivered within 3–7 working days." },
  ] : [
    { step: "01", title: "Document Upload", desc: "Upload the required documents securely via our online portal or WhatsApp." },
    { step: "02", title: "Verification", desc: "Our team of CAs and legal advisors verifies your details to ensure accuracy." },
    { step: "03", title: "Portal Filing", desc: "We complete the official filing process on the government website." },
    { step: "04", title: "Delivery", desc: "Receive your approved certificate and registration number in 3-7 days." }
  ];

  const faqs = isWebDev ? [
    { q: "How long does it take to build a website?", a: "The timeline depends on the complexity of the project. A standard corporate website takes 2-4 weeks, while custom web apps or e-commerce platforms can take 6-12 weeks." },
    { q: "Will my website be mobile-friendly?", a: "Yes, all our websites are built with a mobile-first approach, ensuring they look and function perfectly across all devices and screen sizes." },
    { q: "Do you provide website maintenance and support?", a: "Yes, we offer ongoing maintenance and support packages to ensure your website remains secure, updated, and performs optimally." },
    { q: "Can I update the website content myself?", a: "Absolutely! We build websites on user-friendly Content Management Systems (CMS) like WordPress, Shopify, or custom dashboards, empowering you to manage your content effortlessly." }
  ] : isLogoDesign ? [
    { q: "How long does the logo design process take?", a: "Typically, our initial concept presentation takes 5-7 working days. The complete process, including refinements and final file delivery, usually takes 2-3 weeks depending on the feedback cycle." },
    { q: "What file formats will I receive?", a: "We provide a comprehensive package including vector formats (AI, EPS, SVG) for scalability and print, along with high-resolution raster formats (PNG, JPEG, WebP) for digital use." },
    { q: "Do I own the copyright to the final design?", a: "Yes, upon final payment and project completion, the full copyright and ownership of the finalized logo design are transferred to you." },
    { q: "Can we request revisions on the concepts?", a: "Absolutely. We encourage collaborative feedback and offer revision rounds as part of our process to ensure the final design perfectly aligns with your vision." }
  ] : isBilling ? [
    { q: "Is the billing software GST compliant?", a: "Yes, our billing solutions are fully compliant with current GST regulations and include automated e-invoicing features directly linked to the national tax portal." },
    { q: "Can the software integrate with our existing CRM?", a: "Absolutely! We build with API-first architectures that allow seamless integration with your existing CRM, inventory management, and other operational tools." },
    { q: "Is my financial data secure?", a: "We implement bank-grade encryption protocols, secure cloud hosting, and strict access controls to ensure your financial and customer data remains completely secure." },
    { q: "Will you train our staff on the new system?", a: "Yes, comprehensive staff training and onboarding sessions are included as part of our deployment process to ensure a smooth transition." }
  ] : isMarketing ? [
    { q: "Do you write the scripts for the videos?", a: "Yes, our team handles end-to-end production, including campaign ideation, professional scriptwriting, and storyboarding based on your brand messaging." },
    { q: "What platforms are the videos optimized for?", a: "We optimize and render deliverables for all major platforms, including 9:16 vertical formats for Reels/TikTok, 1:1 for social feeds, and 16:9 for YouTube or corporate presentations." },
    { q: "Can I request edits during post-production?", a: "Absolutely. We build review milestones into our process, allowing you to request adjustments to graphics, pacing, or color grading before the final render." },
    { q: "Do you provide source files for the posters?", a: "Depending on the package selected, we can provide editable source files (like PSD or AI) along with the finalized, ready-to-post flattened image assets." }
  ] : isGst ? [
    { q: "Who must register for GST?", a: "Any business with annual turnover exceeding ₹20 lakhs (₹10 lakhs for special category states) is mandatorily required to register for GST." },
    { q: "Is GST registration free?", a: "Yes, GST registration with the government portal is free of charge. Our professional fee covers documentation, filing, and follow-up support." },
    { q: "Can I start a business before GST registration?", a: "You can start operations, but you cannot collect GST from customers or claim input tax credit until your registration is active." },
    { q: "What is a GSTIN?", a: "GSTIN (Goods and Services Tax Identification Number) is a 15-digit unique identifier assigned to every registered GST taxpayer in India." },
  ] : [
    { q: `Why is ${service.title} mandatory?`, a: `It is legally mandated by government regulations to register and report activities within this sector.` },
    { q: `How long does the registration take?`, a: `Standard processing takes between 3 to 7 working days once all correct documents are uploaded.` },
    { q: `What are the renewal requirements?`, a: `Some registrations are lifetime valid, while others (like licenses) require annual or periodic renewals.` },
    { q: `Are there any hidden charges?`, a: `No, our pricing is fully transparent and covers all government and professional fees.` }
  ];

  let price = "₹1,499";
  if (isCompany) price = "₹2,999";
  if (service.title.toLowerCase().includes("pvt-ltd") || service.title.toLowerCase().includes("subsidiary")) price = "₹5,999";

  return (
    <div>
      {/* Header */}
      <section
        className="py-16"
        style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 100%)" }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-left">
          <button
            onClick={() => { setActivePage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-2 text-blue-200 text-sm mb-6 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Services
          </button>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 text-white bg-white/15">
                {service.category}
              </span>
              <h1 className="text-4xl font-bold text-white mb-3">{service.title}</h1>
              <p className="text-blue-100 text-lg max-w-2xl">{service.desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F5F8FC] dark:bg-[#060e1d]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-left">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* What is Service */}
              <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{whatIsTitle}</h2>
                <p className="text-gray-500 dark:text-zinc-300 leading-relaxed mb-4 whitespace-pre-wrap">
                  {isGst 
                    ? "GST (Goods and Services Tax) Registration is the process by which a business obtains a unique GSTIN (GST Identification Number) from the government. It enables businesses to collect GST from customers, claim input tax credits, and comply with India's unified indirect tax system."
                    : whatIsDesc
                  }
                </p>
                {!(isWebDev || isLogoDesign || isBilling || isMarketing) && (
                  <p className="text-gray-500 dark:text-zinc-300 leading-relaxed">
                    {isProprietorship
                     ? "Under this framework, there is no legal distinction between the owner (proprietor) and the business entity. The business operates under the personal legal identity of the owner, meaning all profits belong entirely to you—and similarly, all financial liabilities are yours to fulfil. In India, it is not governed by a singular dedicated act; rather, its legal recognition is established through various tax and government registrations like GST, Udyam (MSME), and state-specific licenses."
                     : isPartnership
                     ? "Governed by the Indian Partnership Act, 1932, a partnership combines the financial strength and expertise of multiple owners. While the firm is legally recognized as an association of individuals rather than a separate corporate legal entity, registering it with the state's Registrar of Firms (RoF) grants it legal enforceability—ensuring that the business can execute contracts, resolve internal disputes smoothly, and establish credibility with banks and vendors."
                     : isPvtLtd
                     ? "A Private Limited Company is a separate legal entity incorporated under the Companies Act, 2013 (and managed by the Ministry of Corporate Affairs – MCA). Unlike a proprietorship or partnership, a Pvt Ltd company exists independently of its shareholders and directors. It features 'Perpetual Succession,' meaning the company continues to legally exist even if shareholders change, pass away, or exit. The most powerful attribute of this structure is Limited Liability—the personal assets of the directors and shareholders are completely safe and insulated if the business faces financial losses or debts."
                     : isShopAct
                    ? "Every commercial business entity that operates out of a physical commercial premises—including shops, restaurants, hotels, theaters, corporate offices, warehouses, and service centers—must register under this Act within 30 days of commencing operations. The license regulates working conditions, such as mandatory employee working hours, rest intervals, weekly holidays, overtime wages, safety guidelines, and leave policies, ensuring your business adheres to regional labor laws."
                    : isTradeLicense
                    ? "A Trade License is a mandatory certificate or document issued by a local municipal authority that permits an applicant to carry out a specific business or trade at a particular commercial premises. Unlike the Shops & Establishment registration—which primarily focuses on employee working conditions and labor rights—a Trade License ensures that your business activities do not cause a public nuisance, health hazard, or environmental threat to the surrounding residential or commercial locality."
                    : isClra
                    ? "The CLRA framework governs the employment of contract labor to bring their working standards on par with direct employees. Every establishment or contractor that engages a baseline number of contract workers on any single day must secure this authorization. It monitors compliance linked to legal minimum wages, welfare facilities, and mandatory record maintenance."
                    : isBocw
                    ? "The BOCW framework applies strictly to establishments engaging in construction activities like building projects, roadways, structural alterations, demolitions, or plumbing installations. It mandates that employers register their project sites within sixty days of commencement and contribute a statutory construction welfare cess."
                    : isDsc
                    ? "In modern Indian business operations, physical signatures are entirely replaced by digital signatures for all interactions with the Ministry of Corporate Affairs (MCA), Income Tax Department, and e-tendering portals. The DSC is securely embedded within a physical, cryptographic USB token."
                    : isIec
                    ? "An IEC is directly mapped against your business's PAN card, meaning it requires zero annual compliance updates and features a lifetime validity profile. Without a verified IEC code, custom authorities will block your shipments at ports, and banks will restrict foreign exchange inward and outward transfers."
                    : isDrug
                    ? "The State Drugs Standard Control Organization regulates the issuance of drug licenses based on your operational model. If your business operates across multiple states, you must secure a dedicated license from each individual state drug control authority."
                    : isIcegate
                    ? "ICEGATE allows traders to digitally file bills of entry, shipping bills, payment summaries, and track cargo statuses online. It eliminates traditional physical customs handling delays and speeds up the release of overseas goods from international ports."
                    : isIso
                    ? "An ISO certificate proves your organization's dedication to continuous workflow optimization, operational efficiency, and customer satisfaction. It significantly enhances your brand's competitive advantage in domestic and international markets."
                    : isPf
                    ? "The EPF framework mandates that once an establishment is registered, the employer must deduct a statutory percentage (typically 12% of basic wages) from eligible employees' salaries and contribute an equal matching amount into their dedicated provident fund account monthly. These collections must be filed online month-on-month through an Electronic Challan-cum-Return (ECR); failure to register or timely deposit monthly PF contributions can lead to severe financial penalties and legal action against company management."
                    : isPsara
                    ? "The PSARA framework is regulated strictly by individual state-appointed Controlling Authorities. Operating an uncertified private guarding business without a valid PSARA license is a serious, non-bailable criminal offense."
                    : isEsic
                    ? "The ESIC ecosystem ensures that eligible employees and their dependents receive comprehensive medical care, maternity benefits, sick leave pay, and disability compensation. Employers must contribute a statutory percentage (3.25% of gross wages) of the monthly payroll, while employees contribute a fractional amount (0.75%) from their basic wages. All data, employee additions, and monthly financial contributions must be filed digitally via the ESIC portal before the 15th of every subsequent month."
                    : isCopyright
                    ? "A copyright protects the unique expression of an idea rather than the idea itself. It grants creators the exclusive legal authority to reproduce, translate, perform, and distribute their work globally. It serves as an essential protection tool against digital piracy."
                    : isStartup
                    ? "This central government scheme aims to fuel economic growth and generate large-scale employment by supporting innovative, early-stage businesses. It transforms regular startups into highly credible, investment-ready organizations recognized nationally."
                    : isTrademark
                    ? "A trademark protects your brand's unique assets—such as your name, logo, or slogan—from being copied or misused by competitors. It ensures customers can easily identify your authentic products or services in the market."
                    : isUdyam
                    ? "The Udyam framework automatically classifies your business as Micro, Small, or Medium based strictly on your investment in plant and machinery alongside your annual financial turnover metrics. It maps your enterprise directly into the national economic database."
                    : isPt
                    ? "Professional Tax compliance requires a dual-structured registration based on your business dynamic: Professional Tax Enrollment Certificate (PTEC), which authorizes the business entity itself to pay its annual tax, and Professional Tax Registration Certificate (PTRC), which mandates the employer to deduct tax from employees' monthly salaries and file returns."
                    : isLwf
                    ? "The LWF compliance architecture requires a joint financial contribution from both the employer and the employee, with the specific contribution ratios and filing frequencies (monthly, half-yearly, or annual) varying widely across state jurisdictions. Failure to compute or remit these funds can lead to severe audits by labor inspectors, blocking your corporate clean compliance certificates."
                    : isPosh
                    ? "POSH compliance requires businesses to establish a formal framework to address workplace harassment. This includes drafting an explicit internal gender-neutral policy, setting up a mandatory Internal Committee (IC) to handle grievances, organizing regular employee sensitization workshops, and filing an annual compliance report with district officers."
                    : isRegisters
                    ? "Governed under various central acts—such as the Minimum Wages Act, Payment of Wages Act, Contract Labour Act, and state-specific Shop Act guidelines—these registers act as the primary evidence of compliance during a labor inspector's visit. Our firm transitions your compliance ecosystem into a perfectly formatted digital structure."
                    : isAdvisor
                    ? "Indian labor regulations are complex, and with the rolling out of the new consolidated Labour Codes, having a specialized legal advisor is essential to protect your business from major non-compliance fines, labor court disputes, and operational disruptions. Our service operates as an extension of your leadership and internal HR teams."
                    : isItr
                    ? "Filing your Income Tax Return (ITR) before the statutory deadlines is not just a legal obligation; it is a prerequisite for maintaining financial credibility. A clean track record of ITR filings is mandatory when applying for corporate bank loans, seeking premium credit lines, routing foreign remittances, or processing international visa applications."
                    : isAssessment
                    ? "Assessments can range from automated electronic processing to deep-dive manual reviews. Navigating an assessment requires an expert understanding of changing tax laws, proper accounting practices, and clear evidence mapping to satisfy the questions raised by the Assessing Officer (AO)."
                    : isNotice
                    ? "The department matches your ITR disclosures against third-party data reporting channels (like banks, credit card firms, and sub-registrar offices). Any variation can trigger an automated system alert. Our specialized notice resolution service steps in to draft clear, legally sound responses that resolve these disputes smoothly."
                    : isTds
                    ? "Every deductor and collector must file quarterly TDS/TCS returns using specialized forms (Form 24Q, 26Q, 27Q, or 27EQ) to pass tax credits to the respective beneficiaries. Failure to file on time or deducting tax at incorrect rates can lead to severe late-filing fees (₹200 per day under Section 234E), high interest penalties, and expense disallowance."
                    : isRevisedItr
                    ? "Filing an updated return (ITR-U) allows taxpayers to voluntarily correct their tax filings and avoid severe penalties. ITR-U can be used to report additional income, correct tax slab selections, or reduce a previously claimed refund, provided the update results in a payment of additional tax."
                    : isGstNew
                    ? "Operating an eligible business without an active GSTIN number can lead to severe financial penalties and operational shutdowns. Our expert onboarding service handles the entire application process on the centralized GST common portal, helping you secure your registration smoothly and avoid rejections or delays."
                    : isGstFiling
                    ? "Missing GST filing deadlines can lead to daily late fees, cumulative interest penalties, and the blocking of your E-Way Bill generation portal. More importantly, delayed filings can cause your clients to lose out on their Input Tax Credits (ITC), which can quickly damage your corporate reputation."
                    : isGstAnnual
                    ? "Filing the GST Annual Return requires careful accounting reconciliation, as it pulls data from your audited balance sheets, GSTR-1 filings, GSTR-3B submissions, and Input Tax Credit books. Failing to complete this year-end filing on time can trigger significant automatic late fees and audit risks."
                    : isGstCancel
                    ? "Conversely, if the GST department has unilaterally suspended or cancelled your registration due to a failure to file returns for consecutive tax periods, we initiate a fast-track Revocation of Cancellation process. This service involves filing Form GST REG-21 within the mandated timelines to restore your registration."
                    : isGstNotice
                    ? "Failing to respond to a GST notice within the mandated timelines can lead to a unilateral tax demand order, unexpected asset attachments, and the suspension of your GSTIN. Our dedicated notice resolution service steps in to perform a deep-dive analysis of your data and draft clear legal responses."
                    : isMcaCompliance
                    ? "For companies, this includes executing mandatory annual board meetings, drafting financial statements, and filing forms like AOC-4 (Financial Statements) and MGT-7 (Annual Return) every financial year. For LLPs, it involves the submission of Form 8 (Statement of Account & Solvency) and Form 11 (Annual Return). Maintaining up-to-date annual filings is an absolute prerequisite to attracting venture capital investment, securing bank credit lines, and protecting the limited liability status of your business promoters."
                    : isMcaName
                    ? "Altering your company's name requires complete clearance from the Ministry of Corporate Affairs (MCA) to ensure the proposed name is completely unique and does not violate any pre-existing corporate names or active trademarks. It involves passing a special resolution by shareholders, altering your Memorandum of Association (MOA) and Articles of Association (AOA), and securing a fresh Certificate of Incorporation from the Registrar of Companies (RoC)."
                    : isMcaAddress
                    ? "The statutory compliance process for changing your address varies based on the geographic distance of the move: shifting within the same city/municipality, moving outside local limits but under the same Registrar of Companies (RoC), relocating between different RoC jurisdictions within the same state, or executing an inter-state transfer. Moving across RoC boundaries or shifting states requires extensive public notice, newspaper advertisements, and formal approval from the Regional Director (RD)."
                    : isMcaShares
                    ? "Unlike public enterprises, a Private Limited Company has structural restrictions on the free transferability of its equity to protect the closely-held nature of the organization. A share transfer requires executing a formal Form SH-4 (Securities Transfer Form), paying the required state-specific stamp duties, securing explicit board approval, updating internal share registers, and issuing newly endorsed share certificates to the incoming shareholder."
                    : isMcaMoa
                    ? "An alteration requires a formal meeting of your board of directors, passing a special resolution by a three-fourths majority of shareholders at an Extraordinary General Meeting (EGM), and securing official electronic validation from the Ministry of Corporate Affairs (MCA). Any business activities conducted outside the scope defined in your MOA are legally considered ultra vires (beyond corporate power) and are completely invalid."
                    : isMcaDirectors
                    ? "An appointment requires checking eligibility criteria, securing a unique Director Identification Number (DIN), and ensuring your onboarding director completes their annual DIR-3 KYC verifications. Conversely, removing a director requires strict adherence to corporate governance rules under Section 169 of the Companies Act, 2013, including providing a reasonable opportunity for the director to be heard before shareholders pass an ordinary resolution."
                    : isMcaWinding
                    ? "The STK-2 Fast Track Exit process is ideal for defunct private limited companies looking for a low-cost, hassle-free closure mechanism. It requires closing all active business bank accounts, completely settling all outstanding corporate liabilities, securing clear affidavits from directors, and compiling a clean Statement of Accounts reflecting zero assets and zero liabilities."
                    : isMcaRevival
                    ? "Under Section 252 of the Companies Act, 2013, an appeal for revival can be filed before the NCLT within a statutory limit of 20 years from the publication date of the striking-off notice. The revival process requires drafting detailed legal petitions, presenting your case at formal NCLT hearings, paying structural government costs or penalties, and filing all your historically pending annual financial returns with the RoC."
                    : isMcaRegisters
                    ? "Maintaining accurate secretarial records is no longer an afterthought or a manual task handled on loose sheets of paper. Our corporate secretarial team establishes and maintains a secure, centralized digital register system for your company, ensuring every share transfer, director appointment, board meeting, and financial interest disclosure is tracked in precise compliance with Indian corporate law."
                    : isContractDrafting
                    ? "Moving away from generic templates that leave your business exposed to legal gaps, our corporate lawyers structure every contract from scratch. We ensure complete clarity regarding asset allocations, payment milestones, intellectual property rights, indemnification limits, termination triggers, and modern dispute resolution pathways."
                    : isLegalNotices
                    ? "A legal notice serves as an official warning printed on a registered advocate's letterhead. It establishes a formal legal record of the dispute, prevents the other party from claiming ignorance in future court proceedings, and encourage fast out-of-court settlements to avoid heavy reputational damage."
                    : isBondDrafting
                    ? "A bond operates as an unconditional commitment where one party (the Obligor) promises to pay a specified financial penalty to your business if they fail to fulfill an agreed operational milestone. Our corporate lawyers carefully structure these documents to ensure they meet all conditions for enforceability."
                    : isEmploymentContract
                    ? "Our employment drafting service designs customized onboarding agreements for every level of your organization—ranging from standard executive offer letters to complex C-suite employment agreements. We ensure complete protection for your business by incorporating clear, robust clauses."
                    : isNda
                    ? "Generic, internet-sourced templates often fail to provide real protection because they lack precise definitions of what information is confidential. Our corporate lawyers draft customized NDAs from scratch, ensuring your business is fully protected with clear definitions of data boundaries."
                    : isMou
                    ? "While an MOU can be structured as a flexible, non-binding expression of mutual intent, specific sections—such as confidentiality protections, exclusivity terms, cost-sharing allocations, and court jurisdictions—must be explicitly written as legally binding clauses to shield your business from early-stage risks."
                    : isFranchise
                    ? "Our legal secretarial team designs customized agreements that protect your intellectual property assets while setting out clear, enforceable operational rules for your franchisees or licensees. We ensure complete protection for your brand by incorporating strict, legally binding guardrails."
                    : isShareholder
                    ? "Our corporate legal team drafts customized, robust agreements from scratch to protect your business interests. We ensure complete clarity and security for founders and corporations by incorporating clear clauses covering board seats, specialized voting controls, and structured exit pathways."
                    : isDocumentReview
                    ? "Our corporate lawyers systematically review your documents to identify legal traps, eliminate vague language, and rewrite clauses to align with your business goals. We ensure your agreements are legally sound, match current statutory codes, and provide a fair balance of rights and protections for your business."
                    : isDarpan
                    ? "The DARPAN platform enhances the transparency, credibility, and institutional accountability of NGOs across India. Possessing a valid Darpan ID is an essential prerequisite for any non-profit aiming to participate in high-value central government funding projects."
                    : isGst
                    ? "Once registered, the business is legally recognized as a supplier of goods or services under the GST regime. Registration is mandatory for businesses meeting the turnover threshold and for certain categories regardless of turnover, such as e-commerce operators and inter-state suppliers."
                    : `Obtaining this registration ensures compliance with local laws and regulations. It helps build credibility with partners, customers, and financial institutions, smoothing your business operations.`
                  }
                  </p>
                )}
              </div>

              {isWebDev && (
                <>
                  {/* Trending Digital Tech & Aesthetics */}
                  <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Trending Digital Tech & Aesthetics</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">AI-Driven Customer Workflows:</strong> Embedding intelligent automated assistants and customer routing engines to capture high-intent leads and resolve operations queries 24/7.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Headless & JAMstack Architecture:</strong> Utilizing modern decoupled development practices to achieve extreme structural security, lower server costs, and global content delivery.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Conversion Rate Optimization (CRO):</strong> Designing clear, data-backed landing page layouts, strategic call-to-action (CTA) arrays, and ultra-smooth payment paths.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Next-Gen SEO Frameworks:</strong> Engineering schema markup, structured site architectures, and Core Web Vitals optimization to rank higher on search engines from day one.</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Track & Deliverables Portfolio */}
                  <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Service Track & Deliverables Portfolio</h2>
                    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                          <tr>
                            <th className="px-6 py-4 border border-zinc-700/10 w-1/3">Category / Framework</th>
                            <th className="px-6 py-4 border border-zinc-700/10">Scope of Deliverables & Requirements</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                          <tr className="bg-white dark:bg-[#0c1a30]">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Corporate Websites</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Multi-page corporate platforms, service showcase portals, and dynamic content architectures.</li>
                                <li>Tech Options: WordPress, Webflow, React, or custom HTML5/CSS3.</li>
                              </ul>
                            </td>
                          </tr>
                          <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">E-Commerce Engines</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Secure online storefronts, inventory management dashboards, and localized multi-currency checkouts.</li>
                                <li>Tech Options: Shopify, WooCommerce, Next.js, or Magento.</li>
                              </ul>
                            </td>
                          </tr>
                          <tr className="bg-white dark:bg-[#0c1a30]">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Custom Web Apps</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Client dashboards, proprietary service portals, and custom SaaS tools.</li>
                                <li>Tech Options: Full-stack development using Node.js, Python (Django), React, or Vue.js.</li>
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {isLogoDesign && (
                <>
                  {/* Trending Digital Tech & Aesthetics */}
                  <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Trending Digital Tech & Aesthetics</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Adaptive Variable Logo Systems:</strong> Designing flexible, responsive logo frameworks that fluidly scale and auto-adjust for pristine clarity across everything from tiny app favicons to massive outdoor billboards.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Strategic Minimalism:</strong> Eliminating visual clutter to focus entirely on clean vector geometry and deliberate negative space, making your brand highly impactful.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Intentional Color Archetypes:</strong> Utilizing psychological color mapping to evoke the exact right emotional responses from your target market segment (e.g., trust, innovation, premium luxury).</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Complete Brand Identity Toolkits:</strong> Delivering holistic design assets—including comprehensive brand guidelines, corporate typography hierarchies, and custom asset layouts.</p>
                      </div>
                    </div>
                  </div>

                  {/* Core Systems & Asset Structure */}
                  <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Core Systems & Asset Structure</h2>
                    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                          <tr>
                            <th className="px-6 py-4 border border-zinc-700/10 w-1/3">Category / Framework</th>
                            <th className="px-6 py-4 border border-zinc-700/10">Scope of Deliverables & Requirements</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                          <tr className="bg-white dark:bg-[#0c1a30]">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Primary Brand Marks</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Master Brand Logo, Secondary Emblem Layouts, Wordmarks, and Favicon assets.</li>
                              </ul>
                            </td>
                          </tr>
                          <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Vector Production Files</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Scalable, print-ready file formats for unlimited reproduction without quality loss.</li>
                                <li>Formats: AI, EPS, SVG, and high-resolution PDF assets.</li>
                              </ul>
                            </td>
                          </tr>
                          <tr className="bg-white dark:bg-[#0c1a30]">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Digital Asset Package</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Transparent web-optimized file types curated for smooth online, application, and social media display.</li>
                                <li>Formats: High-res PNG, JPEG, and WebP.</li>
                              </ul>
                            </td>
                          </tr>
                          <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Corporate Branding Guide</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Core Identity Manual defining exact brand color codes (HEX/CMYK/Pantone), typefaces, and clear guidelines on logo usage rules.</li>
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {isBilling && (
                <>
                  {/* Trending System Capabilities */}
                  <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Trending System Capabilities</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Automated E-Invoicing Systems:</strong> Generating fully compliant electronic invoices that link directly to national tax systems (such as GST e-Invoicing) automatically.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Unified Omni-Channel Payments:</strong> Integrating secure, global payment processors to accept automated recurring subscriptions, credit cards, UPI transactions, and corporate bank deposits.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Real-Time Financial Analytics:</strong> Dynamic dashboards that track your accounts receivable, map outstanding payments, monitor aging ledgers, and export clear financial reports.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">End-to-End ERP Integrations:</strong> Syncing your invoicing tools directly with your central inventory trackers, customer relationship management (CRM) systems, and financial ledgers.</p>
                      </div>
                    </div>
                  </div>

                  {/* Core Systems & Asset Structure */}
                  <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Core Systems & Asset Structure</h2>
                    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                          <tr>
                            <th className="px-6 py-4 border border-zinc-700/10 w-1/3">Category / Framework</th>
                            <th className="px-6 py-4 border border-zinc-700/10">Scope of Deliverables & Requirements</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                          <tr className="bg-white dark:bg-[#0c1a30]">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Billing & Invoicing Engine</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Automated recurring retainers, customizable invoice design layouts, pro-forma tools, and smart payment reminders.</li>
                              </ul>
                            </td>
                          </tr>
                          <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Inventory & Asset Controls</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Real-time stock level monitoring, low-inventory notifications, multi-warehouse tracking, and automated supplier purchase orders.</li>
                              </ul>
                            </td>
                          </tr>
                          <tr className="bg-white dark:bg-[#0c1a30]">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Financial Ledger Toolkits</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Automated cash ledger balancing, tax allocation models (GST/TDS), expense tracking, and auditing tools.</li>
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {isMarketing && (
                <>
                  {/* Trending System Capabilities */}
                  <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Trending System Capabilities</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">High-Conversion Short-Form Video:</strong> Scripting and producing optimized vertical videos (such as Instagram Reels, YouTube Shorts, and TikTok style ads) built to engage audiences in the first 3 seconds.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Interactive Dynamic Ad Assets:</strong> Creating clean carousel ad structures, thumb-stopping product posters, and engaging layouts built for target social media ad campaigns.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Data-Driven Performance Graphics:</strong> Transforming complex case studies, business statistics, and product comparisons into highly shareable, clean infographic assets.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-zinc-300"><strong className="text-gray-900 dark:text-white">Holistic Omnichannel Campaigns:</strong> Designing a unified set of visual assets cross-optimized to ensure consistent branding across your social feeds, newsletters, and landing pages.</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Track & Deliverables Portfolio */}
                  <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Service Track & Deliverables Portfolio</h2>
                    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                          <tr>
                            <th className="px-6 py-4 border border-zinc-700/10 w-1/3">Category / Framework</th>
                            <th className="px-6 py-4 border border-zinc-700/10">Scope of Deliverables & Requirements</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                          <tr className="bg-white dark:bg-[#0c1a30]">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Social Media Ad Suite</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Optimized static posters, carousel ad layouts, and limited-edition product banners.</li>
                                <li>Sizes: 1:1 Square (Feed), 9:16 Vertical (Stories/Reels), 16:9 Landscape.</li>
                              </ul>
                            </td>
                          </tr>
                          <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Video Production Suite</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>High-resolution motion graphics, explainer product videos, customer testimonial reels, and corporate brand films.</li>
                                <li>Render Specs: 4K UHD resolution, professionally edited audio tracks, and custom font overlays.</li>
                              </ul>
                            </td>
                          </tr>
                          <tr className="bg-white dark:bg-[#0c1a30]">
                            <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top border border-gray-100 dark:border-zinc-800">Print Marketing Package</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Commercial print-ready display layouts, brochures, corporate trade show backdrops, and promotional flyers.</li>
                                <li>Format Slabs: High-res vector PDF files embedded with CMYK color profiles.</li>
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {!(isWebDev || isLogoDesign || isBilling || isMarketing) && (
                <>
                  {/* Who needs it / Eligibility Criteria */}
                  <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h2 className="text-xl font-bold text-gray-905 dark:text-white mb-4">
                  {(isItr || isTds || isGstFiling) ? "Form Classifications" : (isAssessment || isRevisedItr || isGstNew || isGstAnnual || isGstCancel) ? "Assessment Framework" : (isNotice || isGstNotice) ? "Key Classifications" : (isContractDrafting || isEmploymentContract || isFranchise || isShareholder) ? "Strategic Protective Clauses" : isDocumentReview ? "Core Target Framework" : (isLegalNotices || isBondDrafting || isNda || isMou) ? "Operational Structure & Types" : (isLLP || isPvtLtd || isPublicLtd || isOPC || isSubsidiary || isSection8 || isTrust || isProprietorship || isPartnership || isShopAct || isTradeLicense || isClra || isBocw || isFssai || isDsc || isIec || isDrug || isIcegate || isIso || isPf || isPsara || isEsic || isPt || isLwf || isPosh || isRegisters || isAdvisor || isNotice || isTds || isRevisedItr || isGstNew || isGstFiling || isGstAnnual || isGstCancel || isGstNotice || isMcaCompliance || isMcaName || isMcaAddress || isMcaShares || isMcaMoa || isMcaDirectors || isMcaWinding || isMcaRevival || isMcaRegisters || isCopyright || isStartup || isTrademark || isUdyam || isDarpan) ? "Eligibility Criteria" : `Who Needs ${service.title}?`}
                </h2>
                <div className="space-y-3">
                  {whoNeeds.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-600 dark:text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-150 dark:border-zinc-800 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">List of Required Documents</h2>
                
                {isShopAct ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Name of the Shop/Establishment</li>
                              <li>Number of active employees/workers</li>
                              <li>Precise category of business (e.g., Retail, IT Office, Food Joint)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof (Owner / Partners / Directors)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Self-attested PAN Card</li>
                              <li>Aadhaar Card, Recent Passport-size Photograph</li>
                              <li>Active Mobile Number & Email ID</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Premises Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>If Owned:</strong> Sale Deed / Property Tax Receipt / Recent Utility Bill</li>
                              <li><strong>If Rented:</strong> Notarized Rent Agreement & Latest Utility Bill (Electricity/Water)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Visual Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>A high-resolution smartphone photograph of the storefront/office entrance showing the business name clearly on the signboard.</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isTradeLicense ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Exact Nature of Trade (e.g., Restaurant, Retail Store, General Manufacturing)</li>
                              <li>Total built-up area of the commercial space (in sq. ft. or sq. meters)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof (Applicant / Promoters)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Self-attested PAN Card</li>
                              <li>Aadhaar Card, Recent Passport-size Photograph</li>
                              <li>Active Mobile Number & Valid Email ID</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Premises Ownership Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>If Owned:</strong> Registered Sale Deed, Property Tax Receipt, or Latest Municipal Utility Bill</li>
                              <li><strong>If Rented:</strong> Notarized Rent/Lease Agreement and a signed No Objection Certificate (NOC) from the property owner</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isClra ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Entity Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copy of Principal Employer's CLRA Registration Certificate</li>
                              <li>Valid Form III (Certificate of Authorization issued by Principal Employer)</li>
                              <li>True copy of the active Work Order / Service Agreement</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity & Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Self-attested PAN Card and Aadhaar Card</li>
                              <li>Passport-size Photographs, Active Mobile Number, and Corporate Email ID</li>
                              <li>Business Registration Proof (COI, Partnership Deed, or GST Certificate)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Labor Welfare Compliance</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Signed declaration promising to provide basic drinking water, washrooms, and creche facilities</li>
                              <li>Initial details regarding total proposed workers, daily shifts, and wage rates</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isBocw ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Site & Project Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Approved building blueprint plan and construction layout drawings</li>
                              <li>Estimated total cost of construction and projected date of project completion</li>
                              <li>Nature of specific construction works</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Employer/Contractor Profile</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>PAN of the business entity and PAN/Aadhaar of the authorized manager</li>
                              <li>Certificate of Incorporation, Partnership Deed, or dynamic local Trade License</li>
                              <li>Complete active headcount data of site laborers and supervisors</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Address Proof of Site</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Legal occupancy proof of the project land (Deed, Allotment Letter, or Rent/Lease Agreement)</li>
                              <li>Latest local utility bill (Electricity/Water) matching the construction zone premises</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isFssai ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Operations</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Comprehensive list of food product categories to be manufactured or sold</li>
                              <li>Form B completely filled and signed (for State & Central categories)</li>
                              <li>Detailed kitchen blueprint layout and list of machinery (for Manufacturers)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof (Authorized Signatory)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Passport-size Photograph, PAN Card, and Aadhaar Card</li>
                              <li>Copy of COI, LLP Agreement, or Partnership Deed (if applicable)</li>
                              <li>Board Resolution or Authorization Letter assigning applicant power</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Premises Setup Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>If Owned:</strong> Sale Deed / Property Tax Receipt / Recent Utility Bill</li>
                              <li><strong>If Rented:</strong> Notarized Rent Agreement along with an NOC from the owner</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Technical Compliance</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Water test report from a certified laboratory confirming portability status</li>
                              <li>Detailed analysis of production capacity, source of raw materials, and raw milk handling parameters</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isDsc ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">For Individual DSC</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Self-attested PAN Card (Primary identification metric)</li>
                              <li>Aadhaar Card (Must be actively linked to a functional mobile number)</li>
                              <li>Recent clear passport-size color photograph</li>
                              <li>Active verified email address and mobile phone number</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">For Organization DSC</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>True copy of the Company PAN Card and Certificate of Incorporation (COI)</li>
                              <li>Copy of recent bank statement or GST Certificate matching organization name</li>
                              <li>Official Authorization Letter or Board Resolution signed by other directors</li>
                              <li>Organization ID proof of the authorized applicant</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isIec ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Entity Core Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Permanent Account Number (PAN) of the business or individual proprietor</li>
                              <li>Digital copy of Certificate of Incorporation, Partnership Deed, or Trade License</li>
                              <li>Passport-size photograph of the authorized managing individual</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Banking Validation</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Pre-printed cancelled cheque showing the exact business name clearly</li>
                              <li>Dynamic Bank Certificate / Account Statement confirming the active current account details</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Address Verification</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>If Owned:</strong> Sale Deed or recent corporate property utility bills</li>
                              <li><strong>If Rented:</strong> Notarized Lease Contract alongside an explicit utility bill copy</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isDrug ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Premises Layout & Blueprint</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed architectural layout blueprint plan of the pharmacy storefront/warehouse</li>
                              <li>True documentation proving a physical cold-storage system (Refrigerator data loggers)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Technical Staff Credentials</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Degree/Diploma certificate of a registered, qualified Pharmacist (for Retail)</li>
                              <li>Pharmacy Council Registration Certificate and active appointment letter</li>
                              <li>Graduation experience certificate of a qualified trader (for Wholesale)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity & Incorporation</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Business PAN card, COI, Partnership Deed, or dynamic LLP Agreement</li>
                              <li>Identity and address proofs (PAN/Aadhaar) of all directors or partners</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Property Legality</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>If Owned:</strong> Sale Deed / Registered Property Document / Recent Tax Bill</li>
                              <li><strong>If Rented:</strong> Legal Notarized Lease Agreement and a signed landlord NOC</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isIcegate ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Customs Tracking Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Active 10-digit Import Export Code (IEC) issued by the DGFT</li>
                              <li>Valid Permanent Account Number (PAN) matching the trade entity name</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Signatory Verification</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Valid Class 3 Digital Signature Certificate (DSC) mapped onto a USB token</li>
                              <li>High-resolution Aadhaar Card / Passport copy of the authorized individual</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Profiles</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Official Authorization Letter on company letterhead naming the applicant trader</li>
                              <li>Valid corporate email address and active mobile number for multi-factor OTP setups</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isIso ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Profile</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Certificate of Incorporation, Partnership Deed, or dynamic local Trade License</li>
                              <li>Detailed Company Profile outlining the complete scope of business operations</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Operational Blueprint</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed Quality Manual / Standard Operating Procedures (SOPs) for core processes</li>
                              <li>Main organizational chart mapping out leadership roles and workflows</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Compliance & Layout</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copy of active commercial address proofs along with valid GSTIN certificates</li>
                              <li>Record logs of recent internal quality checks, customer feedback, or safety reviews</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isPf ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Entity Legal Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Permanent Account Number (PAN) of the business entity</li>
                              <li>Certificate of Incorporation (COI), Registered Partnership Deed, or local Shop License</li>
                              <li>Active GST Registration Certificate and cross-matched office address proofs</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Promoter / Director Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>PAN Card and Aadhaar Card copies of all active directors, partners, or proprietors</li>
                              <li>Complete contact data including active mobile numbers and email addresses</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Workforce & Banking Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Exact total headcount data along with monthly payroll/salary sheets</li>
                              <li>Copy of a cancelled cheque or bank statement matching the entity's current account</li>
                              <li>Initial list of employee names, Aadhaar numbers, and dates of joining</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isPsara ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Agency Branding Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Distinctive uniform design layout, including shirt, trousers, and batch insignia</li>
                              <li>Detailed character and criminal antecedent verification report of the promoters</li>
                              <li>Logo design blueprint and formal security training module handbook</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Entity Foundation Info</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Business PAN, Certificate of Incorporation, or registered Partnership Deed</li>
                              <li>Fully executed Training MoU with a state-certified guard training center</li>
                              <li>Active Shops & Establishment License, PF, and ESIC registration copies</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Premises Authenticity</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>If Owned:</strong> Sale Deed / Property Tax Document / Latest Office Utility Bills</li>
                              <li><strong>If Rented:</strong> Notarized Lease Contract accompanied by a signed landlord NOC</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isEsic ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Identity Info</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Permanent Account Number (PAN) of the business entity and all promoters</li>
                              <li>Certificate of Incorporation (COI), dynamic Partnership Deed, or local Shop License</li>
                              <li>Copy of a pre-printed cancelled cheque showing the exact corporate bank account</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Employee Operational Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete list of working employees along with dates of birth and family structures</li>
                              <li>Individual Aadhaar card copies and recent passport-size photographs of the team</li>
                              <li>Up-to-date monthly payroll breakdown and employee joining dates</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Premises Verification</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Valid business address proof (Sale deed, Property tax bill, or Rent Agreement)</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isCopyright ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Work Artifact Copy</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Three (3) hard or digital copies of the original creative work (Source code, manuscript, or graphics)</li>
                              <li>Clear description of the work, date of creation, and language used</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Applicant Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>PAN Card and Aadhaar Card copy of the author/creator</li>
                              <li>Certificate of Incorporation or Partnership Deed if the copyright is owned by a business entity</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Authorizations</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>A signed No Objection Certificate (NOC) from the author if the applicant is different from the creator</li>
                              <li>Formal Power of Attorney authorizing our legal experts to represent your case</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isStartup ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Incorporation Proofs</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Certificate of Incorporation (COI) or registered Partnership Deed</li>
                              <li>Permanent Account Number (PAN) of the business entity</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Innovation Pitch Deck</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>A clean, detailed Write-up / Pitch Deck outlining your innovative product or service</li>
                              <li>Brief summary explaining how your startup plans to generate scalable employment or wealth</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">IPR Documents</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copies of any filed or granted Patents, Trademarks, or Copyrights linked to your innovation</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isTrademark ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Brand Asset Metadata</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Clear, high-resolution soft copy of the proposed brand name or logo layout</li>
                              <li>Exact Trademark Class selection matching your business industry (Classes 1 to 45)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Applicant Identity</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>PAN Card and Aadhaar Card copy of the individual promoter or business owner</li>
                              <li>Certificate of Incorporation or Partnership Deed if registered under an organization</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Legal Authorizations</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>A signed User Affidavit stating the exact date your brand first started using the mark</li>
                              <li>Power of Attorney authorizing our legal experts to file and manage your application</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isUdyam ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Promoter Base Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Aadhaar Card of the individual owner, managing partner, or authorized director</li>
                              <li>Permanent Account Number (PAN) card of the business entity</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Financial Tracking</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Up-to-date GSTIN certificate matching the active business entity</li>
                              <li>Basic details regarding recent investments in plant, machinery, or equipment</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Operational Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Accurate business name, commercial address proof, and total active employee headcount</li>
                              <li>Core bank account number along with valid IFSC codes to facilitate transfers</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isPublicLtd ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Proposed Corporate Names (Must be unique, distinct, and must end with the suffix 'Limited')<br/>
                            Exhaustive description of core business domains
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof (All Directors/Shareholders)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Self-attested PAN Card (Mandatory for Indian Citizens)<br/>
                            Aadhaar Card, Recent Passport-size Photograph<br/>
                            Active Mobile Number & Verified Email ID
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Address Proof (All Directors/Shareholders)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Any one (Not older than 2 months): Bank Account Statement, Electricity Bill, Telephone Bill, or Gas Bill (Name must precisely match PAN)
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            If Owned: Registered Sale Deed / Property Tax Receipt & Latest Utility Bill<br/>
                            If Rented/Leased: Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a signed No Objection Certificate (NOC) from the property owner
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isLLP ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Proposed LLP Names (1 or 2 unique names for verification)<br/>
                            Detailed description of the business activities/services
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof (All Partners)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Self-attested PAN Card (Mandatory for Indian Citizens)<br/>
                            Aadhaar Card, Recent Passport-size Photograph<br/>
                            Active Mobile Number & Email ID
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Address Proof (All Partners)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Any one (Not older than 2 months): Bank Statement, Electricity Bill, Telephone Bill, or Gas Bill (Name must match PAN perfectly)
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            If Owned: Sale Deed & Latest Utility Bill (Electricity/Water)<br/>
                            If Rented: Notarized Rent Agreement, Latest Utility Bill, and a No Objection Certificate (NOC) from the property owner
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isTrust ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business/Trust Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Proposed Trust Name (Must be unique and not conflict with existing well-known institutions)<br/>
                            Clearly defined objectives of the trust
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof (Settlor & Trustees)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Self-attested PAN Card (Mandatory)<br/>
                            Aadhaar Card, Recent Passport-size Photograph<br/>
                            Active Mobile Number & Email ID
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Address Proof (Settlor & Trustees)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Voter ID, Valid Passport, or Driving License
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Trust Office Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            If Owned: Sale Deed / Property Tax Receipt & Latest Utility Bill<br/>
                            If Rented: Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a signed No Objection Certificate (NOC) from the landlord
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Witnesses</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Identity proofs of two (2) independent witnesses who will sign the deed during registration
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isSubsidiary ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">From the Foreign Parent Company</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Certificate of Incorporation / Business Charter<br/>
                            Memorandum & Articles of Association (MOA/AOA)<br/>
                            Certified Board Resolution authorizing the India expansion and nominating an authorized representative
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">From Foreign Directors / Signatories</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Valid, high-resolution color copy of Passport (Identity Proof)<br/>
                            Overseas Address Proof (Utility Bill or Bank Statement not older than 2 months)<br/>
                            Passport-size photographs, Email ID, and active contact numbers
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">From Indian Resident Director</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Self-attested PAN Card (Mandatory)<br/>
                            Aadhaar Card<br/>
                            Bank Statement or Utility Bill reflecting the current residential address
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Indian Registered Office Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            If Rented/Leased: Notarized Lease/Rent Agreement, Latest Utility Bill (Electricity/Water), and a signed No Objection Certificate (NOC) from the property owner
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isSection8 ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Proposed NGO Names (Must include words like Foundation, Forum, Association, Council, or Federation)<br/>
                            A detailed 3-year projection of future social activities and estimated income/expenditure
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof (All Directors & Members)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Self-attested PAN Card (Mandatory for Indian Nationals)<br/>
                            Aadhaar Card, Recent Passport-size Photograph<br/>
                            Active Mobile Number & Verified Email ID
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Address Proof (All Directors & Members)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Any one (Not older than 2 months): Bank Statement, Electricity Bill, Mobile Bill, or Gas Bill (Name must match PAN card exactly)
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            If Owned: Sale Deed / Property Tax Receipt & Latest Utility Bill<br/>
                            If Rented: Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a signed No Objection Certificate (NOC) from the landlord
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isOPC ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Proposed OPC Names (1 or 2 unique name preferences ending with the suffix 'OPC Private Limited')<br/>
                            Main business objectives / Industry category
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof (Owner & Nominee)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Self-attested PAN Card (Mandatory)<br/>
                            Aadhaar Card, Recent Passport-size Photograph<br/>
                            Active Mobile Number & Email ID
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Address Proof (Owner & Nominee)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Any one (Not older than 2 months): Bank Statement, Electricity Bill, Mobile Bill, or Gas Bill (Name must match PAN card exactly)
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            If Owned: Sale Deed / Property Tax Receipt & Latest Utility Bill<br/>
                            If Rented: Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a signed No Objection Certificate (NOC) from the landlord
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isPvtLtd ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details &amp; Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Proposed Company Names (Provide 1 or 2 unique names in order of preference)</li>
                              <li>Main business objectives / Industry category</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof (All Directors/Shareholders)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Self-attested PAN Card (Mandatory for Indian Nationals)</li>
                              <li>Aadhaar Card, Recent Passport-size Photograph</li>
                              <li>Active Mobile Number &amp; Email ID</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Address Proof (All Directors/Shareholders)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Any one (Not older than 2 months): Bank Statement, Electricity Bill, Mobile Bill, or Gas Bill (Name must match exactly with the PAN card)
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>If Owned:</strong> Sale Deed &amp; Latest Utility Bill (Electricity/Water)</li>
                              <li><strong>If Rented:</strong> Notarized Rent Agreement, Latest Utility Bill (Electricity/Water), and a No Objection Certificate (NOC) from the property owner</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isPartnership ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details &amp; Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Proposed Company/Firm Name (Must be unique and not violate existing trademarks)</li>
                              <li>Core Business Activities / Nature of Trade</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof (All Partners)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Self-attested PAN Card (Mandatory)</li>
                              <li>Aadhaar Card, Recent Passport-size Photograph</li>
                              <li>Active Mobile Number &amp; Email ID</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Address Proof (All Partners)</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Voter ID, Driving License, or Valid Passport
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>If Owned:</strong> Sale Deed / Property Tax Receipt &amp; Latest Utility Bill (Electricity/Water)</li>
                              <li><strong>If Rented:</strong> Notarized Rent Agreement, Latest Utility Bill, and a No Objection Certificate (NOC) from the property owner</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isProprietorship ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Category</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details &amp; Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Proposed Company Name
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            Aadhaar, PAN, Passport-size Photograph, Mobile Number, and Email ID
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>If Owned:</strong> Sale Deed &amp; Latest Utility Bill (Electricity/Water)</li>
                              <li><strong>If Rented:</strong> Notarized Rent Agreement &amp; Latest Utility Bill (Electricity/Water)</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isPt ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Foundation Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Certificate of Incorporation, Partnership Deed, or local Shop Act License</li>
                              <li>Permanent Account Number (PAN) card of the business entity and all directors</li>
                              <li>Current Bank Account Statement along with valid canceled cheque copies</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Employee & Payroll Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed list of employees along with state-specific gross salary breakdowns</li>
                              <li>Month-on-month staff payroll logs and active employee headcount metrics</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>If Owned: Sale Deed / Property Tax Receipt / Recent Corporate Utility Bill</li>
                              <li>If Rented: Notarized Lease Contract accompanied by a recent utility bill</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isLwf ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Entity Credentials</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copy of the main Shops & Establishment License, Factory License, or COI</li>
                              <li>Permanent Account Number (PAN) card and active GSTIN certificate of the firm</li>
                              <li>Registered EPF and ESIC establishment code allocations</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Payroll Records</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed employee payroll sheets indicating exact headcounts and designations</li>
                              <li>Month-on-month attendance records, gross salary metrics, and employee joining logs</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isPosh ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Policy & Committee Blueprints</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Customized POSH Workplace Policy Document tailored to your company culture</li>
                              <li>Formal Constitution Matrix of the Internal Committee (IC) with official order letters</li>
                              <li>Bio data and written consent forms of the designated External Member</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Training & Report Assets</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Documentation of regular employee training sessions and leadership sensitization logs</li>
                              <li>Standardized formats for filing complaints, maintaining minutes, and case tracking</li>
                              <li>Annual POSH Compliance Report draft prepared for submission to the local authorities</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isRegisters ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Master Employee Metadata</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Full list of workers along with employee codes, Aadhaar, PAN, and emergency contact details</li>
                              <li>Official appointment letters, employment contracts, and exact dates of joining/exit</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Operational & Payroll Inputs</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Monthly attendance logs, shift rosters, and approved overtime records</li>
                              <li>Comprehensive salary sheets outlining basic pay, allowances, and statutory deductions (PF/ESI)</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isAdvisor ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Foundation Files</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Active Certificate of Incorporation, Partnership Deeds, and main Trade Licenses</li>
                              <li>Current state-specific corporate tax filings and compliance certificates (PF, ESI, PT)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Internal HR & Vendor Blueprints</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Standard Employee Handbook, Onboarding Templates, and Non-Disclosure Agreements</li>
                              <li>Master service agreements with third-party vendors and manpower supply contractors</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isItr ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Salary & Personal Income Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Form 16 (Part A & Part B) issued by the employer</li>
                              <li>Annual Information Statement (AIS) and Taxpayer Information Summary (TIS)</li>
                              <li>Form 26AS highlighting tax credits and advance tax payments</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business & Banking Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Audited or compiled Balance Sheet and Profit & Loss Statement (for ITR-3, 5, 6)</li>
                              <li>Comprehensive bank statements for the entire financial year for all active accounts</li>
                              <li>Asset-liability logs, capital accounts, and major vendor ledgers</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Investment & Capital Gains</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Capital gains tax statements from stockbrokers, mutual fund houses, or property sale deeds</li>
                              <li>Tax-saving investment receipts under Section 80C, 80D, 80G, etc.</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isAssessment ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Accounting Records</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete books of accounts, including general ledgers, cash books, and bank books</li>
                              <li>Itemized sales register, purchase invoices, and business expense vouchers</li>
                              <li>Inventory valuation certificates and physical stock-taking logs</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Tax Certificates</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Direct correlation charts linking the audited balance sheet numbers to the filed ITR fields</li>
                              <li>Complete copies of TDS certificates (Form 16/16A) and advance tax payment receipts</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Financial Declarations</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copy of the formal notice received from the tax department under Section 143(2) or 142(1)</li>
                              <li>Written legal submissions and cross-matched expense explanations</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isNotice ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Notice Metadata</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete copy of the original notice showing the unique Document Identification Number (DIN)</li>
                              <li>Copy of the original ITR acknowledgment receipt and ITR form schema for that year</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Financial Proofs</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Comprehensive bank account statements explaining the source of high-value deposits</li>
                              <li>Real estate purchase/sale deeds, asset valuation reports, or loan disbursement cards</li>
                              <li>Form 26AS, AIS, TIS, and internal accounting ledger books matching the notice period</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isTds ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Entity Setup Base</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Valid 10-digit Tax Deduction and Collection Account Number (TAN) of the deductor</li>
                              <li>Permanent Account Number (PAN) of the business entity and the authorized signatory</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Transaction & Challan Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Paid ITNS 281 Challan receipts featuring unique BSR codes, challan serial numbers, and payment dates</li>
                              <li>Consolidated monthly statement mapping deductor transactions to individual PANs</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Deductee Profiles</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete list of deductees with their correct PAN cards, gross transaction values, and date of payments</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isRevisedItr ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Original Filing Context</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copy of the original ITR filing acknowledgment receipt showing the 15-digit E-filing Acknowledgement Number</li>
                              <li>Copy of the past processed return schema along with any Section 143(1) intimation sheets</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">New Financial Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Corrected bank statements, revised profit & loss books, or missing capital gains statements</li>
                              <li>Comprehensive AIS, TIS, and Form 26AS profiles matching the target financial year</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Tax Clearance Proofs</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Fresh Challan ITNS 280 payment receipts clearing the additional tax liabilities along with the mandatory 25% or 50% ITR-U statutory penalties</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isGstNew ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Entity Foundation Info</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Permanent Account Number (PAN) card of the business entity or individual proprietor</li>
                              <li>Certificate of Incorporation (COI), registered Partnership Deed, or LLP Agreement</li>
                              <li>Passport-size photographs and PAN/Aadhaar cards of all active promoters/directors</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Business Address Proof</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>If Owned: Registered Sale Deed / Property Tax Receipt / Recent Utility Bill</li>
                              <li>If Rented: Notarized Rent Agreement, latest utility bill (Electricity/Water), and a signed landlord No Objection Certificate (NOC)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Banking Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copy of a pre-printed cancelled cheque or bank statement showing the exact legal name, account number, and valid IFSC details</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isGstFiling ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Outward Sales Invoices</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Itemized sales register containing tax invoices, B2B distributions, and B2C sales totals</li>
                              <li>Detailed logs of HSN/SAC codes, applicable tax rates (5%, 12%, 18%, 28%), and total tax collected</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Inward Purchase Ledgers</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Inward purchase register detailing raw materials sourced or business assets purchased</li>
                              <li>Reconciled GSTR-2B / 2A data logs extracted from the portal to verify valid ITC claims</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Payment Records</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Corporate bank statement history showing tax payment logs and active electronic cash ledger balances</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isGstAnnual ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Year-End Financial Books</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Audited Balance Sheet, Profit & Loss Statement, and Trial Balance for the financial year</li>
                              <li>Complete copies of the statutory Tax Audit Report (Form 3CD) if applicable</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Consolidated Return Logs</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Full history of GSTR-1 and GSTR-3B returns filed for the targeted financial year</li>
                              <li>Annual GSTR-2A and GSTR-2B ledger logs highlighting total available tax credits</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Reconciliation Sheets</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Internal reconciliation registers cross-matching your accounting ledger sales against your filed GST return values</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isGstCancel ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Identity Info</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Valid GSTIN registration credentials, primary PAN card, and business foundation files</li>
                              <li>Identity and address proof documents of the primary authorized director or partner</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Financial & Inventory Logs</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed list of remaining raw material stock, semi-finished goods, and capital assets held on the cancellation date</li>
                              <li>Calculation sheet showing input tax credit reversal values</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">For Revocation Cases</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Official copy of the department's cancellation order (Form GST REG-17 / REG-19)</li>
                              <li>Receipt copies showing payment of all past overdue taxes, late fees, and interest penalties</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isGstNotice ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Notice Metadata</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete copy of the original notice showing its unique Reference Number and Date</li>
                              <li>Filed copies of the GSTR-1, GSTR-3B, and GSTR-9 returns matching the notice period</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Data Reconciliation Sheets</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Comprehensive GSTR-1 vs GSTR-3B and GSTR-3B vs GSTR-2B reconciliation registers</li>
                              <li>Itemized sales ledgers, e-way bill transaction summaries, and matching tax invoice files</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Property & Legal Credentials</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Legitimate property deeds, updated rent agreements, and valid Class 3 DSC tokens</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isMcaCompliance ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Financial & Accounting Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Audited Balance Sheet and Profit & Loss Statement for the financial year</li>
                              <li>Director's Report, Auditor's Report, and corporate cash flow statements</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Credentials</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Certificate of Incorporation (COI), active PAN card, and updated MOA & AOA</li>
                              <li>Valid Class 3 Digital Signature Certificates (DSC) for all authorized directors/partners</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Operational Trackers</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Fixed assets registers, dynamic bank current account statements, and major loan ledgers</li>
                              <li>Up-to-date registers of board meetings, annual general meetings (AGM), and share allocations</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isMcaName ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Identity Info</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copy of the current Certificate of Incorporation (COI), PAN Card, and active MOA & AOA</li>
                              <li>Copy of the company's up-to-date active client list and corporate website link</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Proposed Name Records</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Formulated nomenclature preferences (1 or 2 new name choices in order of preference)</li>
                              <li>Comprehensive description of the exact business domain mapping to the name prefix</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Legal Authorizations</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Valid Class 3 Digital Signature Certificate (DSC) of the authorized director</li>
                              <li>Board Resolution copy authorizing the director to file name reservation forms</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isMcaAddress ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">New Address Verification</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>If Owned: Registered Sale Deed / Property Tax Receipt / Current Utility Bill</li>
                              <li>If Rented: Notarized Lease/Rent Agreement and a signed No Objection Certificate (NOC) from the landlord matching the utility bill exactly</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Records</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Certified copy of the Board Resolution authorizing the change in office address</li>
                              <li>Special Resolution copy along with newspaper print proofs (for inter-RoC/inter-state moves)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Signatory Verification</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Valid Class 3 Digital Signature Certificate (DSC) of the managing corporate director</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isMcaShares ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Transfer Instrument</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Executed Form SH-4 (Securities Transfer Form) signed by both transferor and transferee</li>
                              <li>Physical Share Certificates matching the exact allocation numbers being transferred</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Approvals</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Certified true copy of the Board Resolution approving the transfer of shares</li>
                              <li>Signed Notice of Transfer issued by the transferor to the company board</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity & Tax Proofs</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Self-attested PAN and Aadhaar copies of both the Transferor and Transferee</li>
                              <li>Proof of payment of appropriate share transfer stamp duty (calculated on market value)</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isMcaMoa ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Current Constitutional Set</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>True copy of the active Certificate of Incorporation, current PAN, and original MOA & AOA</li>
                              <li>Up-to-date list of shareholders along with their exact equity allocation details</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Drafted Amendments</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copy of the newly formulated, altered clauses for the MOA or Articles of Association</li>
                              <li>Certified true copy of the Board Minutes and formal EGM Special Resolution</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Administrative Files</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Formal notice of the Extraordinary General Meeting accompanied by the required Explanatory Statement</li>
                              <li>Class 3 Digital Signature Certificates (DSC) of the managing corporate director</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isMcaDirectors ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">For Onboarding Director</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Form DIR-2: Consent letter to act as a corporate director of the company</li>
                              <li>Form MBP-1 & DIR-8: Disclosure of financial interests in other entities and non-disqualification certificate</li>
                              <li>Self-attested copies of identity and address proofs (PAN, Aadhaar, Passport, and recent utility bills)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">For Resignation / Removal</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Signed formal Resignation Letter or official Notice of Removal with statement profiles</li>
                              <li>Copy of special notice or proof of serving notice to the director being removed</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Approvals</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Certified true copies of the Board Resolution or EGM Ordinary Resolution</li>
                              <li>Valid Class 3 DSC of the company's existing authorized managing director</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isMcaWinding ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Financial Closure Assets</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Statement of Accounts: Financial snapshot certified by a practicing Chartered Accountant (CA) dated within 30 days of filing</li>
                              <li>Official Bank Account Closure Certificate from your corporate current account managers</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Director Affidavits</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Form STK-4: Individual indemnity bonds executed by all active directors on stamp paper</li>
                              <li>Form STK-3: Notarized affidavits from directors confirming zero liabilities and operations</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Resolutions</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Certified true copy of the Board Resolution or 75% Shareholder Consent special resolution</li>
                              <li>Valid Class 3 Digital Signature Certificates (DSC) of all active directors</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isMcaRevival ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Evidence of Active Operations</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Up-to-date bank account statements (reflecting active transaction histories prior to freezing)</li>
                              <li>Copies of sales invoices, commercial contracts, purchase orders, or active GST returns</li>
                              <li>Property lease deeds or utility bills proving the active maintenance of the registered office</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">NCLT Petition Stack</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Comprehensive Revival Petition (Form NCLT-1) with detailed explanatory statements</li>
                              <li>Certified copies of the official RoC strike-off notice (Form STK-7)</li>
                              <li>Up-to-date compiled copies of all pending financial returns (AOC-4 & MGT-7)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Identity Verification</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Self-attested PAN and Aadhaar copies of the petitioning shareholder or director</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isMcaRegisters ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Equity & Share Data</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Allocation ledgers, share application forms, and complete histories of share transfers</li>
                              <li>Up-to-date share capitalization tables matching your authorized and paid-up limits</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Meeting & Leadership Records</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Signed minutes of all past Board of Directors meetings, AGM proceedings, and EGMs</li>
                              <li>Signed copies of director consent letters (DIR-2) and interest disclosures (MBP-1)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Loan & Charge Instruments</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Sanction letters from commercial banks and verified Form CHG-1/CHG-4 filing sheets</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isContractDrafting ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Party Onboarding Profiles</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete legal names, registered office addresses, and corporate identifiers (CIN/PAN) of all entering parties</li>
                              <li>Valid identification copies of the authorized individuals signing the agreement</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Commercial Intent Summary</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed summary of the business arrangement, project milestones, and delivery timelines</li>
                              <li>Complete financial details, fee structures, profit-sharing models, or royalty calculations</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Special Protective Targets</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Specific details regarding non-disclosure restrictions, intellectual property ownership transfers, or non-compete geographic bounds</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isLegalNotices ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Defaulter Profile</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete legal name, active physical residential or corporate office address, and contact details of the defaulting party</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Evidence Foundation</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copies of original signed agreements, purchase orders, or work orders establishing the relationship</li>
                              <li>Outstanding unpaid invoices, statement ledgers, email strings, or chat receipts proving default</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Claim Matrix</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Exact financial amount to be recovered, applicable interest calculations, or specific actions required from the defaulting party</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isBondDrafting ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Obligor & Surety Profiles</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete legal names, identity proofs, and residential or business addresses of the person signing the bond</li>
                              <li>Co-signatory or Guarantor profiles (if an external surety is backing the bond)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Investment Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed description of the specific training program, corporate project, or asset being secured</li>
                              <li>Itemized breakdown proving the actual costs or expenses incurred by your business</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Penalty Matrix</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Exact financial penalty amount (Liquidated Damages) to be paid if a breach occurs, along with the specified tenure limits</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isEmploymentContract ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Company & Employee Basics</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Registered corporate name, brand identifiers, and corporate office address details</li>
                              <li>Full legal name, permanent address, and academic/professional background data of the employee</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Operational & Compensation Profiles</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Specific job designation, core duties, reporting hierarchy, and office location mapping</li>
                              <li>Comprehensive cost-to-company (CTC) salary breakdown, bonus metrics, and provident fund allocations</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Special Restrictions</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Predefined lengths for probation periods, required notice periods, and specific non-compete restrictions</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isNda ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Entering Parties Info</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete legal names, corporate office addresses, and entity types of all signing parties</li>
                              <li>Names and titles of the authorized executives signing the agreement</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Data Scope Definitions</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed summary of the specific project, commercial transaction, or technology discussion taking place</li>
                              <li>Exhaustive list of what information must be protected (Source codes, client lists, financial records)</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Protection Tenure Limits</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Predefined length of the protection period (e.g., 3 years, 5 years, or permanent lifetime limits for core trade secrets)</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isMou ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Partner Identity Profiles</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete legal corporate names, registered business addresses, and corporate identifiers (CIN/PAN) of all entering organizations</li>
                              <li>Names and titles of the authorized executives signing the agreement</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Operational Blueprint</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed summary of the proposed project, joint service model, or asset development venture</li>
                              <li>Expected contribution timelines, budget guidelines, and management responsibility splits</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isFranchise ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Brand Owner & Partner Basics</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Registered corporate names, brand identifiers, and corporate office address details of both parties</li>
                              <li>Valid identification copies of the authorized individuals signing the agreement</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Operational & Financial Profiles</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed list of trademarks, software patents, or operations manuals being licensed</li>
                              <li>Comprehensive financial details, upfront fee structures, ongoing royalty percentages, and payment schedules</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Territory & Performance Metrics</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Predefined geographic boundaries, exclusivity rights, and minimum performance targets</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isShareholder ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Corporate Identity Info</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copy of the current Certificate of Incorporation (COI), PAN Card, and active MOA & AOA</li>
                              <li>Up-to-date share capitalization table highlighting authorized capital, paid-up limits, and current investor splits</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Deal & Investment Terms</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete Term Sheet summarizing the total investment value, share pricing models, and equity class definitions</li>
                              <li>Detailed summary of the proposed joint venture's management structure, operational roles, and profit-sharing models</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isDocumentReview ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-850">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Target Document Stack</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Editable digital copy (MS Word format preferred) of the target contract, lease deed, or vendor agreement to be audited</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Commercial Context Brief</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Brief summary explaining your position in the deal (e.g., Supplier vs. Buyer), key commercial goals, and critical deal-breaker terms</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Historical Precedents</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Copies of any past addendums, initial term sheets, or corporate guidelines that must be incorporated into the final contract</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isDarpan ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-855">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0F4C81] text-white text-xs font-semibold uppercase">
                        <tr>
                          <th className="px-6 py-4 border border-zinc-700/10">Section</th>
                          <th className="px-6 py-4 border border-zinc-700/10">Required Details & Documents</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Entity Registration Foundation</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>True copy of the active Trust Deed, Society Registration Certificate, or Section 8 COI</li>
                              <li>Permanent Account Number (PAN) card mapped strictly to the NGO's legal name</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Board Executive Profiles</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Complete PAN Card and Aadhaar Card copies of all active trustees or board members</li>
                              <li>Valid contact details including verified mobile numbers and email addresses for the board</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Social Impact Profile</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Detailed summary of the NGO's key areas of operations (e.g., Education, Healthcare)</li>
                              <li>Summary of key achievements, operational states, and active project footprints</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {docs.map((doc) => (
                      <div key={doc} className="flex items-start gap-3 p-3 rounded-lg bg-[#F5F8FC] dark:bg-[#060e1d]/50">
                        <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-gray-600 dark:text-zinc-300">{doc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
                </>
              )}

              {/* Process */}
              <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {(isWebDev || isBilling) ? "The Technical Engineering Process" : (isLogoDesign || isMarketing) ? "The Creative Production Process" : (isPf || isEsic || isPt || isLwf || isPosh || isRegisters || isAdvisor) ? "The Compliance & Filing Process" : (isItr || isTds || isRevisedItr || isGstFiling || isGstAnnual) ? "The Operational Filing Process" : (isAssessment || isNotice || isGstCancel || isGstNotice) ? "The Compliance & Resolution Process" : isGstNew ? "The Filing & Onboarding Process" : isDocumentReview ? "The Review & Redlining Process" : isLegalNotices ? "The Legal Dispatch & Resolution Process" : (isContractDrafting || isBondDrafting || isEmploymentContract || isNda || isMou || isFranchise || isShareholder) ? "The Legal Formulation & Advisory Process" : (isMcaName || isMcaAddress || isMcaShares || isMcaMoa || isMcaDirectors) ? "The Amendment & Filing Process" : (isMcaCompliance || isMcaWinding || isMcaRevival || isMcaRegisters) ? "The Corporate Process" : "Our Registration Process"}
                </h2>
                <div className="space-y-4">
                  {process.map(({ step, title, desc }) => (
                    <div key={step} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#EEF4FB] dark:bg-[#060e1d]">
                        <span className="text-sm font-bold text-[#0F4C81] dark:text-blue-400">{step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{title}</h4>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {faqs.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              
              {/* Pricing Card */}
              <div
                className="bg-white dark:bg-[#0c1a30] rounded-2xl p-7 border-2 sticky top-24 shadow-lg"
                style={{ borderColor: "#0F4C81" }}
              >
                <div className="text-xs font-semibold mb-1 text-[#0F4C81] dark:text-blue-400">Starting at</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{price}</div>
                <div className="text-sm text-gray-500 dark:text-zinc-400 mb-6">All-inclusive, no hidden charges</div>
                
                <button
                  onClick={() => {
                    setActivePage("home");
                    setTimeout(() => {
                      const el = document.getElementById("calendar-booking");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm mb-3 bg-[#0F4C81] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Get Started Today
                </button>
                <button
                  onClick={() => {
                    setActivePage("home");
                    setTimeout(() => {
                      const el = document.getElementById("calendar-booking");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm border transition-all hover:bg-blue-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 cursor-pointer border-[#0F4C81] text-[#0F4C81] dark:text-blue-400 dark:border-blue-400"
                >
                  <Phone className="w-4 h-4" />
                  Free Consultation
                </button>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                  <div className="space-y-3">
                    {["3–7 working days", "100% online process", "Expert CA assistance", "Free follow-up support"].map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-650 dark:text-blue-400" />
                        <span className="text-sm text-gray-650 dark:text-zinc-300">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Services */}
              <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Related Services</h3>
                <div className="space-y-3">
                  {SERVICES.filter((s) => s.id !== service.id).slice(0, 4).map((s) => {
                    const SI = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedServiceId(s.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-[#060e1d]/50 transition-colors text-left cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#EEF4FB] dark:bg-[#060e1d]">
                          <SI className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{s.title}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────

function PricingPage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  // WhatsApp link with pre-filled message
  const openWhatsApp = (serviceName: string) => {
    const phoneNumber = "919591578333";
    const message = encodeURIComponent(`Hi! I'm interested in ${serviceName}. Can you provide more details?`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div>
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 100%)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
          <SectionBadge>Pricing</SectionBadge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Get Customized Quotes
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            No hidden fees. No surprises. Enquire now for the right plan for your business stage.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PLANS.map(({ name, desc, features, popular, turnaround, idealFor }) => (
              <div
                key={name}
                className={`rounded-2xl p-8 flex flex-col transition-all duration-300 ${popular ? "relative" : "bg-white dark:bg-[#0c1a30] text-gray-900 dark:text-white"}`}
                style={{
                  backgroundColor: popular ? "#0F4C81" : undefined,
                  boxShadow: popular ? "0 20px 60px rgba(15,76,129,0.3)" : "0 2px 12px rgba(15,76,129,0.06)",
                  border: popular ? "none" : "1px solid #e8eef5",
                  transform: popular ? "scale(1.04)" : "none",
                }}
              >
                {popular && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "#FFD700", color: "#121212" }}
                  >
                    Most Popular
                  </div>
                )}
                <div className="mb-6 text-left">
                  <div className="text-xs font-semibold mb-3" style={{ color: popular ? "#93C5FD" : "#0F4C81" }}>
                    {name}
                  </div>
                  <p className={`text-sm mt-3 leading-relaxed ${popular ? "text-blue-100" : "text-gray-500 dark:text-zinc-400"}`}>
                    {desc}
                  </p>
                </div>

                <div className="space-y-3 mb-6 flex-1 text-left">
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${popular ? "text-blue-200" : "text-gray-400 dark:text-zinc-500"}`}>
                    What's Included
                  </div>
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: popular ? "rgba(255,255,255,0.2)" : "#EEF4FB" }}
                      >
                        <Check className="w-3 h-3" style={{ color: popular ? "#ffffff" : "#0F4C81" }} />
                      </div>
                      <span className={`text-xs ${popular ? "text-blue-50" : "text-gray-600 dark:text-zinc-300"}`}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Turnaround */}
                {turnaround && (
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-200/50 dark:border-zinc-800/80 text-left">
                    <span className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-zinc-500 mb-1">
                      Turnaround Time
                    </span>
                    <span className={`text-xs font-semibold ${popular ? "text-white" : "text-gray-800 dark:text-zinc-300"}`}>
                      {turnaround}
                    </span>
                  </div>
                )}

                {/* Ideal For */}
                {idealFor && (
                  <div className="mt-3 mb-6 text-left">
                    <span className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-zinc-500 mb-1">
                      Ideal For
                    </span>
                    <span className={`text-[11px] leading-snug block ${popular ? "text-blue-100" : "text-gray-500 dark:text-zinc-400"}`}>
                      {idealFor}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => openWhatsApp(name)}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                  style={{
                    backgroundColor: popular ? "#ffffff" : "#0F4C81",
                    color: popular ? "#0F4C81" : "#ffffff",
                  }}
                >
                  Enquire Now
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-2">Need a custom solution for your enterprise?</p>
            <button
              onClick={() => openWhatsApp("Custom Enterprise Solution")}
              className="inline-flex items-center gap-2 font-semibold text-sm"
              style={{ color: "#0F4C81" }}
            >
              Talk to our team <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature Comparison */}
          <div className="mt-16 bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Full Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#F5F8FC" }}>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900">Feature</th>
                    {["Business Setup", "Business Compliance", "Tax & Accounting"].map((name) => (
                      <th key={name} className="p-4 text-sm font-semibold text-center text-gray-900">
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Entity Registration", true, false, false],
                    ["GST Registration", true, true, false],
                    ["FSSAI / Trade License", true, true, false],
                    ["Trademark Registration", "Optional", true, false],
                    ["ROC Compliance", false, true, false],
                    ["GST Return Filing", false, true, true],
                    ["Income Tax Return Filing", false, true, true],
                    ["Monthly Bookkeeping", false, true, true],
                    ["Dedicated Relationship Manager", true, true, true],
                    ["Priority Support", true, true, true],
                  ].map(([feature, s, b, e]) => (
                    <tr key={feature as string} className="border-b border-gray-50 bg-white">
                      <td className="p-4 text-sm text-gray-600">{feature as string}</td>
                      {[s, b, e].map((has, i) => (
                        <td key={i} className="p-4 text-center">
                          {has === true ? (
                            <div className="w-5 h-5 mx-auto bg-[#75C88F] rounded flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            </div>
                          ) : has === false ? (
                            <X className="w-5 h-5 mx-auto text-[#F36B6B] stroke-[3]" />
                          ) : (
                            <span className="text-gray-600 text-sm font-medium">{has as string}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── INDUSTRIES PAGE ──────────────────────────────────────────────────────────

function IndustriesPage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  return (
    <div>
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 100%)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionBadge>Industries</SectionBadge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Compliance for Every Industry
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Every sector has unique regulatory requirements. Our specialized teams deliver tailored compliance solutions across India's most active industries.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {INDUSTRIES.map(({ name, icon: Icon, desc, image }) => (
              <div
                key={name}
                className="bg-white rounded-2xl overflow-hidden flex hover:shadow-xl transition-all duration-300 group"
                style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
              >
                <div className="relative overflow-hidden flex-shrink-0" style={{ width: "160px" }}>
                  <img
                    src={`https://images.unsplash.com/${image}?w=320&h=200&fit=crop&auto=format`}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 70%, rgba(15,76,129,0.2) 100%)" }} />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#EEF4FB" }}>
                      <Icon className="w-4 h-4" style={{ color: "#0F4C81" }} />
                    </div>
                    <h3 className="font-bold text-gray-900">{name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                  <button
                    onClick={() => { setActivePage("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: "#0F4C81" }}
                  >
                    Get Compliance Advice <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── BLOG PAGE ────────────────────────────────────────────────────────────────

function BlogPage() {
  const [activeTag, setActiveTag] = useState("All");
  const tags = ["All", "GST & Tax", "Company Registration", "Startup", "Legal", "MSME", "Compliance"];

  return (
    <div>
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 100%)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionBadge>Resource Hub</SectionBadge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Compliance & Business Insights
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Stay updated with the latest changes in GST, company law, and business regulations — written by our expert CAs and legal advisors.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-2 mb-10">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeTag === tag ? "#0F4C81" : "#ffffff",
                  color: activeTag === tag ? "#ffffff" : "#64748B",
                  border: activeTag === tag ? "1px solid #0F4C81" : "1px solid #e2e8f0",
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.filter((p) => activeTag === "All" || p.category === activeTag).map(
              ({ title, category, date, image, excerpt, readTime }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
                >
                  <div className="relative overflow-hidden" style={{ height: "220px" }}>
                    <img
                      src={`https://images.unsplash.com/${image}?w=600&h=220&fit=crop&auto=format`}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: "#0F4C81" }}>
                        {category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{readTime}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug group-hover:text-blue-700 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">{excerpt}</p>
                    <button className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#0F4C81" }}>
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activeOffice, setActiveOffice] = useState<"corporate" | "branch">("corporate");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 100%)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-left">
          <SectionBadge>Contact Us</SectionBadge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Let's Talk Compliance
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Schedule a free consultation or send us a message. Our experts respond within 2 business hours.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 text-left" style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}>
                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#EEF4FB" }}>
                      <CheckCircle2 className="w-8 h-8" style={{ color: "#0F4C81" }} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Message Sent!</h2>
                    <p className="text-gray-500">
                      Thank you for reaching out. Our team will get back to you within 2 business hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm font-semibold cursor-pointer"
                      style={{ color: "#0F4C81" }}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Rajesh Sharma"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="rajesh@company.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Service Interested In</label>
                          <select
                            value={form.service}
                            onChange={(e) => setForm({ ...form, service: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 transition-colors text-gray-600"
                          >
                            <option value="">Select a service</option>
                            {SERVICES.map((s) => (
                              <option key={s.id} value={s.title}>{s.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Message *</label>
                        <textarea
                          required
                          rows={5}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder="Tell us about your business and what you need help with..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 transition-colors resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-4 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 cursor-pointer bg-[#0f4c81]"
                      >
                        Send Message & Request Callback
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-5 text-left">
              {[
                { icon: Phone, title: "Phone", lines: ["+91 9591578333", "+91 6361556801"], label: "Mon–Sat, 9 AM to 7 PM" },
                { icon: Mail, title: "Email", lines: ["support@triotax.in"], label: "Response within 2 hours" },
                { icon: MapPin, title: "Office Address", lines: ["Corporate Office: Bengaluru, KA", "Branch Office: Bengaluru Rural, KA"], label: "Dedicated legal advisory support" },
              ].map(({ icon: Icon, title, lines, label }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-6"
                  style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#EEF4FB]">
                      <Icon className="w-5 h-5 text-[#0F4C81]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 mb-1">{title}</h3>
                      {lines.map((l) => <p key={l} className="text-sm text-gray-700">{l}</p>)}
                      <p className="text-xs text-gray-400 mt-1">{label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OUR OFFICES SECTION */}
      <section className="py-20 bg-zinc-950 text-white border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Our Offices</h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-10 leading-relaxed">
            Visit us in person at our Corporate Office in Bengaluru or our Branch Office in Bengaluru Rural.
          </p>

          {/* Tabs */}
          <div className="inline-flex bg-zinc-900 border border-zinc-800/80 p-1.5 rounded-full mb-12">
            <button
              onClick={() => setActiveOffice("corporate")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeOffice === "corporate"
                  ? "bg-[#00d2ff] text-black shadow-lg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Corporate Office
            </button>
            <button
              onClick={() => setActiveOffice("branch")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeOffice === "branch"
                  ? "bg-[#00d2ff] text-black shadow-lg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Branch Office
            </button>
          </div>

          {/* Office Cards Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto text-left">
            {/* Left Card Info */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/20 flex items-center justify-center text-[#00d2ff]">
                  {activeOffice === "corporate" ? <Building2 className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {activeOffice === "corporate" ? "Corporate Office" : "Branch Office"}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#00d2ff] mt-1 shrink-0" />
                      <span className="text-sm text-zinc-300 leading-relaxed">
                        {activeOffice === "corporate"
                          ? "#27, Sriranga complex, 2nd Floor, 2nd Main Road, Dr.MC Modi Hospital Road, West of Chord Road, 2nd Stage, Bengaluru-560086"
                          : "#02, Venkateshwara Sawmill Complex, Court Road, Vinayakanagara, Doddballapura, Bengaluru Rural-561203"
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#00d2ff] shrink-0" />
                      <a href={activeOffice === "corporate" ? "tel:+919591578333" : "tel:+916361556801"} className="text-sm text-[#00d2ff] hover:underline">
                        {activeOffice === "corporate" ? "+91 9591578333" : "+91 6361556801"}
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#00d2ff] shrink-0" />
                      <a href="mailto:support@triotax.in" className="text-sm text-zinc-300 hover:text-white">
                        support@triotax.in
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href={
                    activeOffice === "corporate"
                      ? "https://maps.google.com/?q=27,+Sriranga+complex,+2nd+Floor,+2nd+Main+Road,+Dr.MC+Modi+Hospital+Road,+West+of+Chord+Road,+2nd+Stage,+Bengaluru-560086"
                      : "https://maps.google.com/?q=02,Venkateshwara+Sawmill+Complex,+Court+Road,+Vinayakanagara,Doddballapura,Bengaluru+Rural-561203"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3 px-5 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors text-xs font-semibold gap-2 border border-zinc-700/50 cursor-pointer"
                >
                  Get Directions on Google Maps <ArrowRight className="w-3.5 h-3.5 text-[#00d2ff]" />
                </a>
              </div>
            </div>

            {/* Right Map */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-zinc-800/80 relative min-h-[350px]">
              <iframe
                title="Office Location Map"
                src={
                  activeOffice === "corporate"
                    ? "https://maps.google.com/maps?q=%2327,%20Sriranga%20complex,2nd%20Floor,%202nd%20Main%20Road,%20Dr.MC%20Modi%20Hospital%20Road,%20West%20of%20Chord%20Road,%202nd%20Stage,%20Bengaluru-560086&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    : "https://maps.google.com/maps?q=%2302,Venkateshwara%20Sawmill%20Complex,%20Court%20Road,%20Vinayakanagara,Doddballapura,Bengaluru%20Rural-561203&t=&z=15&ie=UTF8&iwloc=&output=embed"
                }
                className="w-full h-full border-0 absolute inset-0"
                style={{
                  filter: "invert(90%) hue-rotate(180deg) grayscale(10%) contrast(110%)",
                }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── FAQ PAGE ─────────────────────────────────────────────────────────────────

function FAQPage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  const categories = [
    {
      title: "GST & Taxation",
      faqs: [
        { q: "Who needs to register for GST in India?", a: "Any business with annual turnover exceeding ₹20 lakhs (₹10 lakhs for special category states) must register. E-commerce sellers and inter-state suppliers must register regardless of turnover." },
        { q: "How long does GST registration take?", a: "GST registration typically takes 3–7 working days from the date of application, provided all documents are correctly submitted." },
        { q: "Can a GST registration be cancelled?", a: "Yes, GST registration can be cancelled either voluntarily (if turnover drops below threshold) or by the tax authorities for non-compliance. We assist with both cancellation and revocation." },
        { q: "What is the penalty for not registering for GST?", a: "The penalty is 10% of the tax amount due, subject to a minimum of ₹10,000. In cases of deliberate fraud, the penalty can be 100% of the tax evaded." },
      ],
    },
    {
      title: "Company Registration",
      faqs: [
        { q: "What is the minimum capital required to register a Pvt Ltd company?", a: "There is no minimum paid-up capital requirement for registering a Private Limited Company in India as per the Companies Act, 2013." },
        { q: "How many directors are needed for a Pvt Ltd company?", a: "A minimum of 2 directors and 2 shareholders are required. A maximum of 200 shareholders and 15 directors are permitted." },
        { q: "How long does company registration take?", a: "Company registration typically takes 7–15 working days, subject to MCA processing times. We ensure all documents are accurate to avoid delays." },
        { q: "Can a foreign national be a director of an Indian company?", a: "Yes, a foreign national can be a director of an Indian company. However, at least one director must be a resident of India." },
      ],
    },
    {
      title: "Compliance & Filing",
      faqs: [
        { q: "What is ROC compliance?", a: "ROC (Registrar of Companies) compliance includes annual filings such as Annual Return (MGT-7), Financial Statements (AOC-4), Director KYC, and other statutory forms." },
        { q: "What happens if a company misses ROC filings?", a: "Late filing attracts additional fees of ₹100 per day per form. Prolonged non-compliance can lead to strike-off of the company name from the MCA register." },
        { q: "How often do I need to file GST returns?", a: "GSTR-1 (outward supplies) is filed monthly or quarterly. GSTR-3B (summary return) is filed monthly. GSTR-9 (annual return) is filed once a year." },
      ],
    },
  ];

  return (
    <div>
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 100%)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionBadge>FAQ</SectionBadge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Find answers to the most common questions about compliance, registration, and our services.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="space-y-12">
            {categories.map(({ title, faqs }) => (
              <div key={title}>
                <h2
                  className="text-xl font-bold text-gray-900 mb-5 pb-3 border-b-2"
                  style={{ borderColor: "#EEF4FB" }}
                >
                  {title}
                </h2>
                <div className="space-y-3">
                  {faqs.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-14 rounded-2xl p-8 text-center"
            style={{ background: "linear-gradient(135deg, #0F4C81 0%, #1565c0 100%)" }}
          >
            <h3 className="text-xl font-bold text-white mb-3">Still Have Questions?</h3>
            <p className="text-blue-100 mb-6 text-sm">
              Our compliance experts are available Monday to Saturday, 9 AM to 7 PM.
            </p>
            <button
              onClick={() => { setActivePage("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "#ffffff", color: "#0F4C81" }}
            >
              <Phone className="w-4 h-4" />
              Talk to an Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── CAREER PAGE ──────────────────────────────────────────────────────────────

function CareerPage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 100%)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionBadge>Careers</SectionBadge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Build Your Career at TRIOTAX
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Join a team of 80+ compliance professionals making a real difference for thousands of Indian businesses every day.
          </p>
        </div>
      </section>

      {/* Culture */}
      <section className="py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="rounded-2xl overflow-hidden" style={{ height: "400px" }}>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=400&fit=crop&auto=format"
                alt="TRIOTAX team culture"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <SectionBadge>Life at TRIOTAX</SectionBadge>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Where Expertise Grows and Careers Flourish
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                At TRIOTAX, we believe our people are our greatest asset. We foster a culture of continuous learning, collaboration, and professional excellence — where every team member is empowered to grow alongside our clients.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: GraduationCap, label: "Learning & Development", sub: "Regular training & certifications" },
                  { icon: Heart, label: "Health & Wellness", sub: "Comprehensive health insurance" },
                  { icon: Users2, label: "Collaborative Culture", sub: "Cross-functional team projects" },
                  { icon: TrendingUp, label: "Growth Opportunities", sub: "Fast-track promotions" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="p-4 rounded-xl" style={{ backgroundColor: "#F5F8FC" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: "#EEF4FB" }}>
                      <Icon className="w-4 h-4" style={{ color: "#0F4C81" }} />
                    </div>
                    <div className="font-semibold text-xs text-gray-900">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <SectionBadge>Open Positions</SectionBadge>
            <h2 className="text-3xl font-bold text-gray-900">Current Openings</h2>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {CAREERS.map(({ title, dept, type, location, exp }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{ boxShadow: "0 2px 8px rgba(15,76,129,0.05)" }}
                onClick={() => setSelected(selected === title ? null : title)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { icon: Briefcase, label: dept },
                        { icon: MapPin, label: location },
                        { icon: Clock, label: exp },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Icon className="w-3.5 h-3.5" style={{ color: "#0F4C81" }} />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: type === "Internship" ? "#FFF7ED" : "#EEF4FB",
                        color: type === "Internship" ? "#C2410C" : "#0F4C81",
                      }}
                    >
                      {type}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${selected === title ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {selected === title && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">
                      We are looking for a talented {title} to join our growing team. This role involves working closely with clients across industries to deliver accurate, timely compliance solutions while maintaining the highest standards of professional excellence.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActivePage("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
                        style={{ backgroundColor: "#0F4C81" }}
                      >
                        Apply Now <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border"
                        style={{ borderColor: "#0F4C81", color: "#0F4C81" }}
                      >
                        Download JD
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm mb-3">Don't see a role that fits? We always welcome exceptional talent.</p>
            <button
              onClick={() => { setActivePage("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ backgroundColor: "#0F4C81" }}
            >
              Send Open Application <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("gst-registration");
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (document.documentElement.classList.contains("dark") ? "dark" : "light")
  );
  
  // Auth state
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [isUserAuth, setIsUserAuth] = useState(false);

  const handleAdminLogin = (password: string, username: string) => {
    if (username === "admin" && password === "admin123") {
      setIsAdminAuth(true);
      return true;
    }
    return false;
  };

  const handleUserLogin = () => {
    setIsUserAuth(true);
    navigateToPage("user");
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    setIsUserAuth(false);
    navigateToPage("home");
  };

  // Watch for dark mode changes on <html> element
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Enforce theme restrictions: Only allow dark mode on User and Admin pages
  useEffect(() => {
    if (activePage !== "user" && activePage !== "admin") {
      document.documentElement.classList.remove("dark");
    } else {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [activePage]);

  // Sync state with URL pathname on initial load and handle back/forward actions
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, "");
      const matchedPage = (path || "home") as Page;
      const validPages: Page[] = ["home", "about", "services", "service-detail", "pricing", "industries", "blog", "contact", "faq", "career", "login", "admin", "user"];
      if (validPages.includes(matchedPage)) {
        setActivePage(matchedPage);
      } else {
        setActivePage("home");
      }
    };

    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  // Dynamic SEO Metadata based on active page
  useEffect(() => {
    const seoData: Record<string, { title: string, desc: string }> = {
      home: { title: "TrioTax | End-to-End Business Compliance & Registration in India", desc: "TrioTax offers premium financial consulting, GST filing, company registration, and compliance services with expert guidance in India." },
      about: { title: "About TrioTax | India's Most Trusted Compliance Partner", desc: "Learn about TrioTax, founded by industry experts to make business compliance accessible, affordable, and stress-free for Indian entrepreneurs." },
      services: { title: "Our Services | TrioTax Registration & Compliance", desc: "Explore our comprehensive suite of services including company incorporation, GST filing, trademark registration, and monthly compliance." },
      "service-detail": { title: "Service Details | TrioTax", desc: "Detailed information about TrioTax business compliance and registration services tailored to your needs." },
      pricing: { title: "Pricing & Plans | TrioTax", desc: "Transparent and affordable pricing for business registration, licensing, and compliance services in India." },
      industries: { title: "Industries We Serve | TrioTax", desc: "Discover how TrioTax provides specialized compliance and registration services across various industries and sectors." },
      blog: { title: "Blog & Insights | TrioTax", desc: "Read the latest news, insights, and updates on taxation, compliance, and business growth from TrioTax experts." },
      contact: { title: "Contact Us | TrioTax", desc: "Get in touch with TrioTax for expert advice on business registration, GST, tax filing, and compliance in India." },
      faq: { title: "Frequently Asked Questions | TrioTax", desc: "Find answers to common questions about company registration, GST, trademarks, and more with TrioTax." },
      career: { title: "Careers at TrioTax | Join Our Team", desc: "Build your career with TrioTax. We foster a culture of continuous learning and professional excellence." }
    };
    const currentSeo = seoData[activePage] || seoData.home;
    document.title = currentSeo.title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", currentSeo.desc);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', currentSeo.desc);
      document.head.appendChild(metaDesc);
    }

    // Update Open Graph and Twitter tags dynamically
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", currentSeo.title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", currentSeo.desc);
    
    const twTitle = document.querySelector('meta[property="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", currentSeo.title);
    
    const twDesc = document.querySelector('meta[property="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", currentSeo.desc);
  }, [activePage]);

  const navigateToPage = (page: Page) => {
    setActivePage(page);
    const path = page === "home" ? "/" : `/${page}`;
    window.history.pushState(null, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (activePage) {
      case "home": return <HomePage setActivePage={navigateToPage} setSelectedServiceId={setSelectedServiceId} />;
      case "about": return <AboutPage setActivePage={navigateToPage} />;
      case "services": return <ServicesPage setActivePage={navigateToPage} setSelectedServiceId={setSelectedServiceId} />;
      case "service-detail": return (
        <ServiceDetailPage
          setActivePage={navigateToPage}
          selectedServiceId={selectedServiceId}
          setSelectedServiceId={setSelectedServiceId}
        />
      );
      case "pricing": return <PricingPage setActivePage={navigateToPage} />;
      case "industries": return <IndustriesPage setActivePage={navigateToPage} />;
      case "blog": return <BlogPage />;
      case "contact": return <ContactPage />;
      case "faq": return <FAQPage setActivePage={navigateToPage} />;
      case "career": return <CareerPage setActivePage={navigateToPage} />;
      case "login": return <TravelConnectSignIn onLogin={handleUserLogin} />;
      case "admin": return <AdminPage isAdminAuth={isAdminAuth} onLogin={handleAdminLogin} onLogout={handleLogout} />;
      case "user": return <UserDashboard onLogout={handleLogout} />;
      default: return <HomePage setActivePage={navigateToPage} setSelectedServiceId={setSelectedServiceId} />;
    }
  };

  const isDashboardLayout = activePage === "admin" || activePage === "user";

  if (isDashboardLayout) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#060e1d] text-gray-900 dark:text-white transition-colors duration-300">
        {renderPage()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#060e1d] text-gray-900 dark:text-white transition-colors duration-300">
      <NavBar activePage={activePage} setActivePage={navigateToPage} setSelectedServiceId={setSelectedServiceId} theme={theme} setTheme={setTheme} />
      <main style={{ paddingTop: "72px" }}>
        {renderPage()}
      </main>
      <Footer setActivePage={navigateToPage} setSelectedServiceId={setSelectedServiceId} />
      <Chatbot />
    </div>
  );
}
