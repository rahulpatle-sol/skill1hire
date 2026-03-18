"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";
import { Btn, Field } from "@/components/ui";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await authAPI.forgotPassword(email); setSent(true); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  if (sent) return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: "var(--green-dim)" }}>
        <CheckCircle size={26} style={{ color: "#34d399" }} />
      </div>
      <h2 className="font-display font-black text-2xl mb-2" style={{ color: "var(--text)" }}>Check your email</h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>Reset link sent to <strong>{email}</strong></p>
      <Link href="/login"><Btn variant="secondary" className="w-full">Back to Login</Btn></Link>
    </div>
  );

  return (
    <div>
      <Link href="/login" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: "var(--text-2)" }} onMouseEnter={e => e.currentTarget.style.color = "var(--amber)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
        <ArrowLeft size={14} />Back to login
      </Link>
      <h1 className="font-display font-black text-3xl mb-1" style={{ color: "var(--text)" }}>Forgot password?</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-2)" }}>We'll send a reset link to your email.</p>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" placeholder="you@example.com" icon={Mail} value={email} onChange={e => setEmail(e.target.value)} required />
        <Btn type="submit" loading={loading} className="w-full" size="lg">Send Reset Link</Btn>
      </form>
    </div>
  );
}
