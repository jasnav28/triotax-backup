import React, { useState } from 'react';
import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const staffTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    name: "Sarah Chen",
    handle: "@sarah_triotax",
    text: "TrioTax ERP accelerates GST filing and compliance audits by 10x with zero manual errors."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    name: "Marcus Johnson",
    handle: "@marcus_audit",
    text: "The real-time statutory HSN lookup and GST reconciliation save our team hours every week."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    name: "David Martinez",
    handle: "@david_compliance",
    text: "Managing thousands of client corporate filings is completely effortless with TrioTax."
  },
];

interface StaffLoginProps {
  onStaffLogin?: (email: string) => void;
  onNavigateHome?: () => void;
}

export const StaffLoginPage: React.FC<StaffLoginProps> = ({
  onStaffLogin,
  onNavigateHome
}) => {
  const [authError, setAuthError] = useState("");

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string) || "";
    const password = (formData.get("password") as string) || "";

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // Authenticate staff member
    if (onStaffLogin) {
      onStaffLogin(email);
    } else {
      localStorage.setItem("triotax_is_user_auth", "true");
      localStorage.setItem("triotax_logged_in_user", email.split("@")[0] || "staff");
      localStorage.removeItem("triotax_logged_out");
      window.location.href = `/${email.split("@")[0] || "staff"}-user/home`;
    }
  };

  const handleGoogleSignIn = () => {
    alert("Redirecting to TrioTax Google Workspace SSO...");
  };

  const handleResetPassword = () => {
    const email = prompt("Enter your TrioTax staff email to receive a password reset link:");
    if (email) {
      alert(`Password reset instructions sent to ${email}`);
    }
  };

  const handleCreateAccount = () => {
    alert("Staff accounts are provisioned by your TrioTax System Administrator.");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-1">
              <ShieldCheck size={12} />
              <span>Staff Portal</span>
            </div>
            <span className="block font-bold text-foreground tracking-tight text-3xl sm:text-4xl">
              TrioTax Staff Sign In
            </span>
          </div>
        }
        description="Access internal administrative tools, client compliance engines, and automated GST reconciliation."
        heroImageSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
        testimonials={staffTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default StaffLoginPage;
