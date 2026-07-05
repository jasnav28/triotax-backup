import { useState, useEffect, useRef } from "react";
import {
  FileText, RefreshCw, Building2, Users, Shield, Award, Briefcase,
  TrendingUp, CheckCircle2, Globe, Calculator, Store, Key, CreditCard,
  BookOpen, BarChart2, ClipboardList, Rocket, FileCheck, Scale, Search,
  Star, ArrowRight, Phone, Mail, MapPin, ChevronDown,
  Menu, X, Check, Zap, DollarSign, IndianRupee, Headphones, Lock,
  ThumbsUp, Send, Facebook, Twitter, Linkedin, Instagram,
  Calendar, Clock, GraduationCap, Heart, Target,
  ChevronRight, Building, Users2, Lightbulb, Sun, Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { Chatbot } from "@/app/components/ui/chatbot";

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


const WHY_US = [
  { icon: GraduationCap, title: "Experienced Professionals", desc: "CAs, CSs, and legal experts with 12+ years of hands-on industry experience." },
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
  { title: "Senior CA / Compliance Manager", dept: "Finance & Compliance", type: "Full-time", location: "Mumbai / Remote", exp: "5+ Years" },
  { title: "GST & Tax Consultant", dept: "Taxation", type: "Full-time", location: "Delhi NCR", exp: "3+ Years" },
  { title: "Company Secretary (CS)", dept: "Corporate Law", type: "Full-time", location: "Bangalore", exp: "2+ Years" },
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

type Page = "home" | "about" | "services" | "service-detail" | "pricing" | "industries" | "blog" | "contact" | "faq" | "career";

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{ backgroundColor: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative">
        <div className="flex items-center justify-between" style={{ height: "72px" }}>
          <button onClick={() => navigate("home")} className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#0F4C81" }}
            >
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg leading-tight" style={{ fontFamily: "'Poppins', sans-serif", color: "#121212" }}>
                TRIO<span style={{ color: "#0F4C81" }}>TAX</span>
              </div>
              <div className="text-xs text-gray-400">Advisory & Legal Services</div>
            </div>
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
                      className={`text-sm font-medium transition-colors pb-0.5 flex items-center gap-1.5 ${
                        activePage === page
                          ? "border-b-2"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                      style={
                        activePage === page
                          ? { color: "#0F4C81", borderColor: "#0F4C81" }
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
                  className={`text-sm font-medium transition-colors pb-0.5 ${
                    activePage === page
                      ? "border-b-2"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  style={
                    activePage === page
                      ? { color: "#0F4C81", borderColor: "#0F4C81" }
                      : {}
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle size="md" />

            <button
              onClick={() => navigate("contact")}
              className="text-sm font-medium px-4 py-2 rounded-lg border transition-all hover:bg-blue-50"
              style={{ borderColor: "#0F4C81", color: "#0F4C81" }}
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
            {/* Mobile Theme Toggle Button */}
            <ThemeToggle size="md" />
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4">
            {navLinks.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-lg mx-2"
                style={{ width: "calc(100% - 16px)", color: activePage === page ? "#0F4C81" : undefined, fontWeight: activePage === page ? 600 : undefined }}
              >
                {label}
              </button>
            ))}
            <div className="px-4 pt-3">
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

        {/* Megamenu backdrop overlay */}
        {megaOpen && (
          <div
            className="fixed inset-0 z-40 bg-[#060e1d]/50 backdrop-blur-sm transition-all duration-300 pointer-events-none"
            style={{ top: "72px" }}
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
            <div className="col-span-3 bg-[#F8FAFC] rounded-2xl p-5 flex flex-col justify-between border border-gray-50">
              <div>
                <span className="text-[10px] font-bold text-gray-400 tracking-wider block mb-2 uppercase">Category Overview</span>
                <h4 className="font-bold text-xs text-gray-900 mb-2">{activeCategory.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4">{activeCategory.desc}</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider block mb-3 uppercase">Category Features</span>
                <ul className="space-y-2">
                  {activeCategory.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] font-medium text-gray-600">
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

  return (
    <footer style={{ backgroundColor: "#0a1628" }} className="text-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#0F4C81" }}>
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  TRIO<span style={{ color: "#60A5FA" }}>TAX</span>
                </div>
                <div className="text-xs text-gray-400">Advisory & Legal Services</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              India's trusted partner for business compliance, tax registration, and legal advisory services since 2022. Serving 5,000+ clients across all sectors.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-blue-600"
                  style={{ backgroundColor: "#1a2d4a" }}
                >
                  <Icon className="w-4 h-4 text-gray-300" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Quick Links</h4>
            <ul className="space-y-3">
              {(["home", "about", "pricing", "blog", "contact", "faq", "career"] as Page[]).map((p) => (
                <li key={p}>
                  <button
                    onClick={() => navigate(p)}
                    className="text-gray-400 text-sm hover:text-white transition-colors capitalize"
                  >
                    {p === "faq" ? "FAQ" : p === "home" ? "Home" : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Our Services</h4>
            <ul className="space-y-3">
              {SERVICES.slice(0, 8).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => { setSelectedServiceId(s.id); setActivePage("service-detail"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-gray-400 text-sm hover:text-white transition-colors text-left font-medium"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Contact</h4>
            <div className="space-y-4 mb-7">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">#27, Sriranga complex, 2nd Floor, Dr.MC Modi Hospital Road, 2nd Stage, Bengaluru-560086</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  +91 9591578333<br />
                  +91 6361556801
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">support@triotax.in</span>
              </div>
            </div>
            <h4 className="font-bold text-sm mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none"
                style={{ backgroundColor: "#1a2d4a", border: "1px solid #2d4a6b" }}
              />
              <button
                className="px-3 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#0F4C81" }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 TRIOTAX Compliance Advisory Pvt Ltd. All rights reserved.
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
  const [bookingDate, setBookingDate] = useState<number | null>(5);
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
          paddingTop: "96px",
          paddingBottom: "80px",
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
            <div className="flex gap-5 shrink-0 animate-marquee-ltr">
              {SERVICES.slice(0, 11).map((service) => (
                <div key={`${service.id}-row1-1`} className="w-[300px] shrink-0">
                  <ServiceCard
                    service={service}
                    onClick={() => { setSelectedServiceId(service.id); navigate("service-detail"); }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-5 shrink-0 animate-marquee-ltr" aria-hidden="true">
              {SERVICES.slice(0, 11).map((service) => (
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
            <div className="flex gap-5 shrink-0 animate-marquee-rtl">
              {SERVICES.slice(11).map((service) => (
                <div key={`${service.id}-row2-1`} className="w-[300px] shrink-0">
                  <ServiceCard
                    service={service}
                    onClick={() => { setSelectedServiceId(service.id); navigate("service-detail"); }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-5 shrink-0 animate-marquee-rtl" aria-hidden="true">
              {SERVICES.slice(11).map((service) => (
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
                {["ISO 9001:2015 Certified Firm", "MCA Authorized Partner", "GSTN Approved Service Provider", "Registered with ICAI & ICSI"].map((badge) => (
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
            <div className="grid grid-cols-2 gap-5">
              {WHY_US.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#EEF4FB" }}>
                    <Icon className="w-5 h-5" style={{ color: "#0F4C81" }} />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 mb-2">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
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

      {/* TESTIMONIALS */}
      <section className="py-20" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <SectionBadge>Client Stories</SectionBadge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              What Our Clients Say
            </h2>
            <p className="text-gray-500">Trusted by thousands of businesses across India.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, image, rating, text }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
              >
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-600 text-sm leading-relaxed mb-7 italic">
                  &ldquo;{text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-bold text-sm text-gray-900 dark:text-white">{name}</div>
                  </div>
                </div>
              </div>
            ))}
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
                    <h3 className="text-white font-semibold text-lg">July 2026</h3>
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
                  {/* Empty offsets for Wednesday start of July 2026 */}
                  <span />
                  <span />
                  <span />
                  
                  {/* Render 31 days */}
                  {Array.from({ length: 31 }, (_, i) => {
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
                      const message = encodeURIComponent(`Hello, I am ${bookingName}. I would like to book a consultation on ${bookingDate} July 2026.`);
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
                TRIOTAX Compliance was founded by Arvind Kapoor, a seasoned Chartered Accountant with a vision to make business compliance accessible, affordable, and stress-free for every Indian entrepreneur.
              </p>
              <p className="text-gray-500 leading-relaxed mb-5">
                What began as a small GST advisory firm in Mumbai quickly expanded across states, driven by word-of-mouth and an unwavering commitment to client satisfaction. Today, our team of 80+ professionals handles everything from startup registrations to enterprise-level compliance.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                We believe every business deserves expert compliance support — not just the large corporates. That philosophy shapes every service we offer and every client relationship we build.
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

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <SectionBadge>Leadership Team</SectionBadge>
            <h2 className="text-3xl font-bold text-gray-900">Meet the Experts Behind TRIOTAX</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, image, bio }) => (
              <div
                key={name}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                style={{ boxShadow: "0 2px 12px rgba(15,76,129,0.06)" }}
              >
                <div className="relative overflow-hidden" style={{ height: "240px" }}>
                  <img
                    src={`https://images.unsplash.com/${image}?w=400&h=240&fit=crop&auto=format`}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
                    style={{ background: "linear-gradient(to top, rgba(15,76,129,0.9) 0%, transparent 60%)" }}>
                    <div className="p-4">
                      <p className="text-white text-xs leading-relaxed">{bio}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-sm text-gray-900">{name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{role}</p>
                </div>
              </div>
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
  const isPf = service.id === "pf-reg";
  const isPsara = service.id === "psara";
  const isEsic = service.id === "esic-reg";
  const isCopyright = service.id === "copyright";
  const isStartup = service.id === "startup-india";
  const isTrademark = service.id === "trademark-reg";
  const isUdyam = service.id === "udyam-msme";
  const isDarpan = service.id === "darpan-reg";

  const whatIsTitle = `What is ${service.title}?`;
  const whatIsDesc = isShopAct 
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
    ? "Are you expanding your corporate team, onboarding permanent employees, or aiming to establish high human resource standards within your business? Securing an EPFO (Employees' Provident Fund Organisation) Registration is a mandatory legal milestone under the EPF Act. It provides a long-term social security and retirement savings framework."
    : isPsara
    ? "Are you planning to launch a private security agency, provide manned guarding services to corporate parks, or deploy cash logistics bouncers to banking networks? Securing a PSARA (Private Security Agencies Regulation Act) License is your mandatory legal requirement. It serves as a strict regulatory shield."
    : isEsic
    ? "Are you building an operational workforce, managing manufacturing plants, or running an office with multiple entry-level employees? Securing an ESIC (Employees' State Insurance Corporation) Registration is a mandatory statutory obligation under Indian social security laws. It provides a robust, state-backed health insurance framework."
    : isCopyright
    ? "Are you a software developer writing proprietary source code, an author publishing a book, a musician composing original tracks, or an artist designing unique branding graphics? Securing a Copyright Registration is your ultimate legal shield. Governed under the Copyright Act, 1957, this intellectual property right grants you ownership."
    : isStartup
    ? "Are you launching a tech startup, scaling an innovative business model, or developing an original proprietary solution? Getting your business recognized under the Startup India Scheme (DPIIT Recognition) is a major milestone. It unlocks access to tax holidays, patent fast-tracks, and public funds."
    : isTrademark
    ? "Are you launching a brand name, creating a distinct logo, or designing a unique corporate slogan? Securing a Trademark Registration (™) is your most vital step to protect your brand identity. It grants you exclusive legal ownership over your brand elements across India, shielding your business from copycats."
    : isUdyam
    ? "Are you operating a small business, managing a local retail shop, running a consulting agency, or setting up a manufacturing unit? Getting an Udyam Aadhaar (MSME) Registration is a highly valuable step for your business. This free, state-backed registration formally recognizes your business under the MSME Development Act, 2006."
    : isDarpan
    ? "Are you operating a non-profit organization, managing a registered public charitable trust, running a welfare society, or executing a Section 8 social impact company? Securing a DARPAN Registration (often called an NGO Darpan ID) is your absolute mandatory requirement. Managed directly by the NITI Aayog, this links you to ministries."
    : `${service.title} is the official registration and licensing required to operate legally. ${service.desc}`;

  const whoNeeds = isShopAct ? [
    "Commercial Premises: The business must operate out of a real, physical commercial property, shop, or designated office space located within state boundaries.",
    "Timeline Constraint: The application must ideally be filed with the state labor department within 30 days of starting your commercial activities.",
    "Nature of Business: The premises must be classified as a commercial establishment, retail shop, theater, restaurant, or service-oriented office."
  ] : isTradeLicense ? [
    "Age Limit: The applicant or business owner must be at least 18 years old.",
    "Clean Legal Standing: The applicant must have a clean legal record with no history of serious criminal activities or severe environmental violations.",
    "Commercial Zone: The physical premises where the business operates must be located within a commercially approved zone or an area permitted by the local urban planning authority.",
    "Lawful and Safe Activity: The specific trade or business category must be entirely legal and safe for the surrounding public community."
  ] : isClra ? [
    "Principal Employer Registration: Before a contractor can apply for a license, the principal employer must possess a valid CLRA Registration Certificate.",
    "Worker Count Threshold: Applicable to any establishment or contractor engaging twenty (20) or more contract workers on any given day.",
    "Valid Work Contract: Contractors must have an authentic work order or agreement issued by the principal employer specifying the nature and duration of the contract assignment."
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
    "Mandatory Workforce Limit: Every business establishment that employs twenty (20) or more employees on any single day must register within 15 days.",
    "Voluntary Option: Small businesses with less than 20 employees can opt for a voluntary PF registration to provide retirement benefits to their team.",
    "Universal Application: Applies to all business structures, including factories, retail establishments, IT offices, startups, and consulting firms."
  ] : isPsara ? [
    "Indian Citizenship Base: The principal promoter, CEO, or managing director must be a citizen of India and maintain a clean criminal history.",
    "Financial Credibility: The business must possess clean financial records, and the promoters must have a solid credit history without any bankruptcy marks.",
    "Mandatory Training Tie-Up: The applicant agency must execute a formal Memorandum of Understanding (MoU) with a state-recognized security training institute to train guards."
  ] : isEsic ? [
    "Mandatory Employee Baseline: Applicable to any commercial establishment, factory, or office that employs ten (10) or more individuals on any single day.",
    "Salary Threshold: Employees whose gross monthly salary is ₹21,000 or below are covered under this scheme.",
    "Regional Coverage: The business must be located within an ESIC-implemented geographic zone or municipal territory."
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

  const docs = isGst ? [
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

  const process = isShopAct ? [
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
    { step: "01", title: "Shram Suvidha Integration", desc: "We access the centralized Shram Suvidha unified labor portal, setting up your corporate account using an authorized signatory's Class 3 DSC or Aadhaar profile." },
    { step: "02", title: "Form Drafting & Employer Profile Setup", desc: "Our corporate HR team drafts the application form, entering specific setup details, main business activities, and your active current bank details." },
    { step: "03", title: "Document Verification & Electronic Filing", desc: "All supporting business deeds, PAN files, and payroll metrics are attached to the portal, and the application is signed using digital security keys." },
    { step: "04", title: "UAN Generation & Portal Activation", desc: "The EPFO system reviews and verifies the application data. Once cleared, your formal EPF Registration Number is issued." }
  ] : isPsara ? [
    { step: "01", title: "Antecedent Verification Filing", desc: "We assist you in filing an intense background check application with the local police department to verify the clean legal records of all promoters." },
    { step: "02", title: "Training MoU Execution", desc: "We coordinate with a state-certified security academy to secure your mandatory guard training partnership agreement, ensuring compliance with state regulations." },
    { step: "03", title: "Application Compilation", desc: "We assemble and submit your comprehensive license application to the state's PSARA Controlling Authority, accompanied by uniform blueprints and tax compliance certificates." },
    { step: "04", title: "Department Inspection & License Grant", desc: "A Controlling Officer or senior police inspector performs a physical audit of your office space and training logs. Once cleared, your official PSARA License is generated." }
  ] : isEsic ? [
    { step: "01", title: "Labor Portal Account Integration", desc: "We set up your corporate account on the unified Shram Suvidha / ESIC portal using your digital security keys or Aadhaar profiles." },
    { step: "02", title: "Employer Form Filing", desc: "We carefully draft the employer enrollment application, filling in precise operational details, business category classifications, and your current bank details." },
    { step: "03", title: "Document Stack Attachment", desc: "All self-attested payroll sheets, director identity proofs, and property titles are securely uploaded to the system." },
    { step: "04", title: "TIC Generation & Registration Activation", desc: "The automated ESIC framework processes the application data. Once cleared, your formal 17-digit ESIC Registration Number is issued." }
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
  ] : isDarpan ? [
    { step: "01", title: "NITI Aayog Portal Configuration", desc: "We access the centralized NGO Darpan portal, building a fresh organizational identity profile directly linked to your business PAN card." },
    { step: "02", title: "Executive Mapping Sequence", desc: "Our compliance experts accurately input the individual identity profiles, Aadhaar numbers, and dynamic contact credentials of all active board members to ensure complete transparency." },
    { step: "03", title: "Sectoral Activities Specification", desc: "We map your specific non-profit activities to the correct government sectors, detailing your primary geographic footprint and active project locations." },
    { step: "04", title: "Validation & Unique ID Issuance", desc: "The NITI Aayog system reviews your attached deeds and board data. Once cleared, your formal NGO DARPAN Unique ID Number is generated." }
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

  const faqs = isGst ? [
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
                <p className="text-gray-500 dark:text-zinc-300 leading-relaxed mb-4">
                  {isGst 
                    ? "GST (Goods and Services Tax) Registration is the process by which a business obtains a unique GSTIN (GST Identification Number) from the government. It enables businesses to collect GST from customers, claim input tax credits, and comply with India's unified indirect tax system."
                    : whatIsDesc
                  }
                </p>
                <p className="text-gray-500 dark:text-zinc-300 leading-relaxed">
                  {isShopAct
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
                    ? "Once registered, an employer must deduct a statutory percentage (typically 12% of basic wages) from eligible employees' salaries and contribute an equal matching amount into their dedicated provident fund account monthly. Failure to register or timely deposit monthly PF contributions can lead to severe financial penalties."
                    : isPsara
                    ? "The PSARA framework is regulated strictly by individual state-appointed Controlling Authorities. Operating an uncertified private guarding business without a valid PSARA license is a serious, non-bailable criminal offense."
                    : isEsic
                    ? "The ESIC ecosystem ensures that eligible employees receive comprehensive medical care, maternity benefits, sick leave pay, and disability compensation. Employers must contribute a statutory percentage of the monthly payroll, while employees contribute a fractional amount from their basic wages."
                    : isCopyright
                    ? "A copyright protects the unique expression of an idea rather than the idea itself. It grants creators the exclusive legal authority to reproduce, translate, perform, and distribute their work globally. It serves as an essential protection tool against digital piracy."
                    : isStartup
                    ? "This central government scheme aims to fuel economic growth and generate large-scale employment by supporting innovative, early-stage businesses. It transforms regular startups into highly credible, investment-ready organizations recognized nationally."
                    : isTrademark
                    ? "A trademark protects your brand's unique assets—such as your name, logo, or slogan—from being copied or misused by competitors. It ensures customers can easily identify your authentic products or services in the market."
                    : isUdyam
                    ? "The Udyam framework automatically classifies your business as Micro, Small, or Medium based strictly on your investment in plant and machinery alongside your annual financial turnover metrics. It maps your enterprise directly into the national economic database."
                    : isDarpan
                    ? "The DARPAN platform enhances the transparency, credibility, and institutional accountability of NGOs across India. Possessing a valid Darpan ID is an essential prerequisite for any non-profit aiming to participate in high-value central government funding projects."
                    : isGst
                    ? "Once registered, the business is legally recognized as a supplier of goods or services under the GST regime. Registration is mandatory for businesses meeting the turnover threshold and for certain categories regardless of turnover, such as e-commerce operators and inter-state suppliers."
                    : `Obtaining this registration ensures compliance with local laws and regulations. It helps build credibility with partners, customers, and financial institutions, smoothing your business operations.`
                  }
                </p>
              </div>

              {/* Who needs it / Eligibility Criteria */}
              <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h2 className="text-xl font-bold text-gray-905 dark:text-white mb-4">
                  {(isShopAct || isTradeLicense || isClra || isBocw || isFssai || isDsc || isIec || isDrug || isIcegate || isIso || isPf || isPsara || isEsic || isCopyright || isStartup || isTrademark || isUdyam || isDarpan) ? "Eligibility Criteria" : `Who Needs ${service.title}?`}
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
                              <li>Certificate of Incorporation (COI), Partnership Deed, or local Trade License</li>
                              <li>Active GST Registration Certificate and cross-matched address proofs</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-[#F5F8FC]/40 dark:bg-[#060e1d]/30">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Promoter / Director Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>PAN Card and Aadhaar Card copies of all active directors or partners</li>
                              <li>Complete contact data including active mobile numbers and email addresses</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#0c1a30]">
                          <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white align-top w-1/3 border border-gray-100 dark:border-zinc-800">Workforce & Banking Details</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-zinc-300 leading-relaxed border border-gray-100 dark:border-zinc-800">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Exact total headcount data along with monthly payroll sheets</li>
                              <li>Copy of a cancelled cheque or bank statement matching the entity's precise name</li>
                              <li>Active list of employee names, Aadhaar numbers, and dates of joining</li>
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

              {/* Process */}
              <div className="bg-white dark:bg-[#0c1a30] rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Our Registration Process</h2>
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
  return (
    <div>
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0d3d6b 0%, #0F4C81 100%)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
          <SectionBadge>Pricing</SectionBadge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Transparent, Affordable Pricing
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            No hidden fees. No surprises. Just the right plan for your business stage.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#F5F8FC" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PLANS.map(({ name, price, period, desc, features, cta, popular, turnaround, idealFor }) => (
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
                  <div className={`text-4xl font-bold mb-1 ${popular ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {price}
                  </div>
                  <div className={`text-xs ${popular ? "text-blue-200" : "text-gray-400 dark:text-zinc-500"}`}>
                    {period}
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
                  onClick={() => { setActivePage("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                  style={{
                    backgroundColor: popular ? "#ffffff" : "#0F4C81",
                    color: popular ? "#0F4C81" : "#ffffff",
                  }}
                >
                  {cta}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-2">Need a custom solution for your enterprise?</p>
            <button
              onClick={() => { setActivePage("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Feature</th>
                    {PRICING_PLANS.map((p) => (
                      <th key={p.name} className="p-4 text-sm font-semibold text-center" style={{ color: p.popular ? "#0F4C81" : "#374151" }}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["GST Registration", true, true, true],
                    ["Company / LLP Registration", false, true, true],
                    ["Trademark Registration", false, true, true],
                    ["Annual ROC Compliance", false, false, true],
                    ["Monthly Bookkeeping", false, false, true],
                    ["Dedicated Manager", false, true, true],
                    ["Income Tax Filing", false, false, true],
                    ["24/7 Priority Access", false, false, true],
                  ].map(([feature, s, b, e]) => (
                    <tr key={feature as string} className="border-t border-gray-50">
                      <td className="p-4 text-sm text-gray-600">{feature as string}</td>
                      {[s, b, e].map((has, i) => (
                        <td key={i} className="p-4 text-center">
                          {has ? (
                            <CheckCircle2 className="w-5 h-5 mx-auto" style={{ color: "#0F4C81" }} />
                          ) : (
                            <div className="w-5 h-0.5 bg-gray-200 mx-auto" />
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

  // Sync state with URL pathname on initial load and handle back/forward actions
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, "");
      const matchedPage = (path || "home") as Page;
      const validPages: Page[] = ["home", "about", "services", "service-detail", "pricing", "industries", "blog", "contact", "faq", "career"];
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
      default: return <HomePage setActivePage={navigateToPage} setSelectedServiceId={setSelectedServiceId} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#060e1d] text-gray-900 dark:text-white transition-colors duration-300">
      <NavBar activePage={activePage} setActivePage={navigateToPage} setSelectedServiceId={setSelectedServiceId} />
      <main style={{ paddingTop: "72px" }}>
        {renderPage()}
      </main>
      <Footer setActivePage={navigateToPage} setSelectedServiceId={setSelectedServiceId} />
      <Chatbot />
    </div>
  );
}
