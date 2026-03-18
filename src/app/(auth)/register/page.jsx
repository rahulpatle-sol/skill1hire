"use client";
import { useState, Suspense } from "react"; // Added Suspense
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Btn, Field } from "@/components/ui";

const ROLES = [
  { id: "candidate", emoji: "👨‍💻", label: "Candidate", sub: "I'm looking for a job" },
  { id: "hr", emoji: "🏢", label: "Recruiter", sub: "I'm hiring talent" },
  { id: "mentor", emoji: "🎓", label: "Mentor", sub: "I want to teach" },
];

// 1. Move the form logic into a sub-component
function RegisterForm() {
  const { register: reg } = useAuth();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  
  // Now useSearchParams is safe because it's inside Suspense
  const [role, setRole] = useState(params.get("role") || "candidate");
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await reg({ ...data, role });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Role selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {ROLES.map(r => (
          <button key={r.id} type="button" onClick={() => setRole(r.id)}
            className="flex flex-col items-center gap-1 p-3.5 rounded-2xl border transition-all duration-150"
            style={{
              borderColor: role === r.id ? "var(--amber)" : "var(--border)",
              background: role === r.id ? "var(--amber-dim)" : "transparent",
            }}>
            <span className="text-xl">{r.emoji}</span>
            <span className="text-xs font-bold" style={{ color: role === r.id ? "var(--amber)" : "var(--text-2)" }}>{r.label}</span>
            <span className="text-[10px] leading-tight text-center" style={{ color: "var(--text-3)" }}>{r.sub}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Full Name" type="text" placeholder="Rahul Mehta" icon={User}
          error={errors.name?.message}
          {...register("name", { required: "Name required", minLength: { value: 2, message: "Too short" } })}
        />
        <Field label="Email" type="email" placeholder="you@example.com" icon={Mail}
          error={errors.email?.message}
          {...register("email", { required: "Email required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } })}
        />
        <div className="relative">
          <Field label="Password" type={show ? "text" : "password"} placeholder="Min 8 characters" icon={Lock}
            error={errors.password?.message}
            {...register("password", { required: "Password required", minLength: { value: 8, message: "Minimum 8 chars" } })}
          />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-10" style={{ color: "var(--text-3)" }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <Btn type="submit" loading={loading} className="w-full" size="lg">
          Create Account <ArrowRight size={15} />
        </Btn>
      </form>
    </>
  );
}

// 2. The main export just provides the layout and the Suspense boundary
export default function RegisterPage() {
  return (
    <div>
      <h1 className="font-display font-black text-3xl mb-1" style={{ color: "var(--text)" }}>Create account</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>Join Skill1 Hire — free, forever.</p>

      <Suspense fallback={<div className="p-10 text-center text-sm opacity-50">Loading form...</div>}>
        <RegisterForm />
      </Suspense>

      <p className="mt-4 text-[11px] text-center" style={{ color: "var(--text-3)" }}>
        By registering you agree to our Terms & Privacy Policy.
      </p>
      <p className="mt-4 text-center text-sm" style={{ color: "var(--text-2)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold" style={{ color: "var(--amber)" }}>Sign in</Link>
      </p>
    </div>
  );
}