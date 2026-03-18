"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Btn, Field } from "@/components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Login failed. Check credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display font-black text-3xl mb-1" style={{ color: "var(--text)" }}>Welcome back</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-2)" }}>Sign in to your Skill1 Hire account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email" type="email" placeholder="you@example.com" icon={Mail}
          error={errors.email?.message}
          {...register("email", { required: "Email required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } })}
        />
        <div className="relative">
          <Field label="Password" type={show ? "text" : "password"} placeholder="Your password" icon={Lock}
            error={errors.password?.message}
            {...register("password", { required: "Password required" })}
          />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-4 top-10 transition-colors" style={{ color: "var(--text-3)" }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs font-semibold" style={{ color: "var(--amber)" }}>Forgot password?</Link>
        </div>

        <Btn type="submit" loading={loading} className="w-full" size="lg">
          Sign in <ArrowRight size={15} />
        </Btn>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--text-2)" }}>
        No account?{" "}
        <Link href="/register" className="font-semibold" style={{ color: "var(--amber)" }}>Create one free</Link>
      </p>

      {/* Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: "var(--border)" }} /></div>
        <div className="relative flex justify-center"><span className="px-3 text-xs" style={{ background: "var(--bg)", color: "var(--text-3)" }}>or continue with</span></div>
      </div>

      <a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/google`}
        className="btn-secondary w-full justify-center">
        <svg width="17" height="17" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </a>
    </div>
  );
}
