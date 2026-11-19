import React, { useState } from 'react';
import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { validateStaffLogin, getStoredStaff } from "@/lib/marketing-data";

const staffTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    name: "Sarah Chen",
    handle: "TX-M-00020 · Senior Tele-Marketing",
    text: "TrioTax ERP accelerates GST filing and compliance audits by 10x with zero manual errors."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    name: "Marcus Johnson",
    handle: "TX-M-00021 · Corporate Outreach",
    text: "The real-time statutory HSN lookup and GST reconciliation save our team hours every week."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    name: "David Martinez",
    handle: "TX-M-00022 · SME Compliance",
    text: "Managing thousands of client corporate filings is completely effortless with TrioTax."
  },
];

interface StaffLoginProps {
  onStaffLogin?: (email: string, staffId?: string, employeeId?: string) => void;
  onNavigateHome?: () => void;
}

export const StaffLoginPage: React.FC<StaffLoginProps> = ({
  onStaffLogin,
  onNavigateHome
}) => {
  const [authError, setAuthError] = useState("");

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    const formData = new FormData(event.currentTarget);
    const identifier = ((formData.get("email") as string) || "").trim();
    const password = ((formData.get("password") as string) || "").trim();

    if (!identifier || !password) {
      setAuthError("Please enter your Employee ID (e.g. TX-M-00020) or Email and password.");
      return;
    }

    // Authenticate against stored staff credentials
    const validatedStaff = validateStaffLogin(identifier, password);

    if (!validatedStaff) {
      // Check if user entered demo credentials that don't match
      setAuthError("Invalid credentials. Please enter a valid Employee ID (e.g. TX-M-00020) or Email and the password set by the admin.");
      return;
    }

    // Success authentication
    const userClean = validatedStaff.email.split("@")[0] || "staff";
    localStorage.setItem("triotax_is_user_auth", "true");
    localStorage.setItem("triotax_logged_in_user", userClean);
    localStorage.setItem("triotax_current_staff_id", validatedStaff.id);
    localStorage.setItem("triotax_current_staff_emp_id", validatedStaff.employeeId);
    localStorage.removeItem("triotax_logged_out");

    if (onStaffLogin) {
      onStaffLogin(validatedStaff.email, validatedStaff.id, validatedStaff.employeeId);
    } else {
      window.location.href = `/${userClean}-user/marketing-leads`;
    }
  };

  const handleGoogleSignIn = () => {
    alert("Redirecting to TrioTax Google Workspace SSO...");
  };

  const handleResetPassword = () => {
    const email = prompt("Enter your TrioTax Employee ID or staff email to receive a password reset link:");
    if (email) {
      alert(`Password reset instructions sent to ${email}`);
    }
  };

  const handleCreateAccount = () => {
    alert("Staff accounts with system Employee IDs (TX-M-00020) are provisioned directly by the System Administrator in the Marketing Data tab.");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans">
      {/* Return to Home / Back Link */}
      <div className="absolute top-4 left-4 z-50">
        <button
          type="button"
          onClick={() => {
            if (onNavigateHome) {
              onNavigateHome();
            } else {
              window.location.href = "/";
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-200 shadow-xs hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>
      </div>

      <SignInPage
        title={
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#003153]/15 text-[#003153] dark:bg-sky-950/60 dark:text-sky-300 border border-[#003153]/25 mb-1">
              <ShieldCheck size={12} className="text-[#003153] dark:text-sky-300" />
              <span>Internal Staff Portal</span>
            </div>
            <span className="block font-bold text-foreground tracking-tight text-3xl sm:text-4xl">
              TrioTax Staff Sign In
            </span>
          </div>
        }
        description="Sign in using your Employee ID (e.g. TX-M-00020) or staff email and admin-given password."
        heroImageSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
        testimonials={staffTestimonials}
        identifierLabel="Employee ID or Email"
        identifierPlaceholder="e.g. TX-M-00020 or sarah@triotax.com"
        identifierType="text"
        themeColor="#003153"
        errorMessage={authError}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default StaffLoginPage;
