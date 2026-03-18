"use client";
import { clsx } from "clsx";
import { Loader2, AlertCircle } from "lucide-react";

/* ─── Button ─────────────────────────────────── */
export function Btn({ children, variant = "primary", size = "md", loading, icon: Icon, className, ...p }) {
  const V = { primary: "btn-primary", secondary: "btn-secondary", ghost: "btn-ghost", danger: "btn-danger" };
  const S = { sm: "btn-sm", md: "", lg: "btn-lg", xl: "btn-xl" };
  return (
    <button className={clsx(V[variant] || V.primary, S[size], className)} disabled={loading || p.disabled} {...p}>
      {loading ? <Loader2 size={13} className="animate-spin shrink-0" /> : Icon && <Icon size={14} className="shrink-0" />}
      {children}
    </button>
  );
}

/* ─── Input ──────────────────────────────────── */
export function Field({ label, error, icon: Icon, hint, className, inputClass, ...p }) {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-2)" }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />}
        <input
          className={clsx("input", Icon && "input-icon", error && "input-error", inputClass)}
          {...p}
        />
      </div>
      {error && <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: "#fca5a5" }}><AlertCircle size={11} />{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs" style={{ color: "var(--text-3)" }}>{hint}</p>}
    </div>
  );
}

/* ─── Textarea ───────────────────────────────── */
export function TextArea({ label, error, className, ...p }) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-2)" }}>{label}</label>}
      <textarea className={clsx("input resize-none", error && "input-error", className)} rows={4} {...p} />
      {error && <p className="mt-1.5 text-xs" style={{ color: "#fca5a5" }}>{error}</p>}
    </div>
  );
}

/* ─── Select ─────────────────────────────────── */
export function Sel({ label, error, children, className, ...p }) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-2)" }}>{label}</label>}
      <select className={clsx("input", error && "input-error", className)} {...p}>{children}</select>
      {error && <p className="mt-1.5 text-xs" style={{ color: "#fca5a5" }}>{error}</p>}
    </div>
  );
}

/* ─── Card ───────────────────────────────────── */
export function Card({ children, hover, className, ...p }) {
  return (
    <div className={clsx(hover ? "card-hover" : "card", className)} {...p}>
      {children}
    </div>
  );
}

/* ─── Badge ──────────────────────────────────── */
const BV = { amber: "badge-amber", green: "badge-green", red: "badge-red", indigo: "badge-indigo", purple: "badge-purple", dim: "badge-dim", yellow: "badge-amber", gray: "badge-dim", blue: "badge-indigo" };
export function Badge({ children, variant = "dim", className }) {
  return <span className={clsx("badge", BV[variant] || BV.dim, className)}>{children}</span>;
}

/* ─── Avatar ─────────────────────────────────── */
export function Avatar({ name = "", src, size = "md", className }) {
  const S = { xs: "w-7 h-7 text-[10px]", sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-xl" };
  const initials = (name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  if (src) return <img src={src} alt={name} className={clsx("rounded-2xl object-cover shrink-0", S[size], className)} />;
  return (
    <div className={clsx("rounded-2xl flex items-center justify-center font-black font-display shrink-0", S[size], className)}
      style={{ background: "var(--amber-dim)", color: "var(--amber)" }}>
      {initials}
    </div>
  );
}

/* ─── Spinner ────────────────────────────────── */
export function Spinner({ size = 20 }) {
  return (
    <div className="animate-spin rounded-full border-2"
      style={{ width: size, height: size, borderColor: "var(--border-2)", borderTopColor: "var(--amber)" }} />
  );
}

/* ─── Skeleton ───────────────────────────────── */
export function Skel({ className }) {
  return <div className={clsx("skeleton", className)} />;
}

/* ─── Empty State ────────────────────────────── */
export function Empty({ icon: Icon, title, desc, cta }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5"
          style={{ background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <Icon size={26} style={{ color: "var(--amber)" }} />
        </div>
      )}
      <h3 className="text-base font-bold mb-2 font-display" style={{ color: "var(--text)" }}>{title}</h3>
      {desc && <p className="text-sm mb-5 max-w-xs" style={{ color: "var(--text-2)" }}>{desc}</p>}
      {cta}
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────── */
export function StatCard({ label, value, icon: Icon, color = "amber", trend }) {
  const C = {
    amber: { bg: "var(--amber-dim)", text: "var(--amber)" },
    green: { bg: "var(--green-dim)", text: "#34d399" },
    indigo: { bg: "var(--indigo-dim)", text: "#a5b4fc" },
    purple: { bg: "var(--purple-dim)", text: "#d8b4fe" },
    red: { bg: "var(--red-dim)", text: "#fca5a5" },
    yellow: { bg: "var(--amber-dim)", text: "var(--amber)" },
  };
  const c = C[color] || C.amber;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: c.bg }}>
          {Icon && <Icon size={20} style={{ color: c.text }} />}
        </div>
        {trend !== undefined && (
          <span className="text-xs font-bold px-2 py-1 rounded-full"
            style={{ background: trend >= 0 ? "var(--green-dim)" : "var(--red-dim)", color: trend >= 0 ? "#34d399" : "#fca5a5" }}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black mb-1 font-display" style={{ color: "var(--text)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--text-2)" }}>{label}</p>
    </Card>
  );
}

/* ─── Page Header ────────────────────────────── */
export function PageHdr({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-xl font-black font-display" style={{ color: "var(--text)" }}>{title}</h1>
        {sub && <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ─── Progress Bar ───────────────────────────── */
export function Progress({ value, max = 100, color = "amber", label }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const C = { amber: "var(--amber)", green: "var(--green)", indigo: "var(--indigo)", red: "var(--red)" };
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-2)" }}>
        <span>{label}</span><span className="font-bold" style={{ color: C[color] }}>{pct}%</span>
      </div>}
      <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: C[color] || C.amber }} />
      </div>
    </div>
  );
}

/* ─── Tabs ───────────────────────────────────── */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-0.5 mb-6" style={{ borderBottom: "1px solid var(--border)" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className="px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all duration-150 rounded-t-lg"
          style={{ borderColor: active === t.id ? "var(--amber)" : "transparent", color: active === t.id ? "var(--amber)" : "var(--text-2)" }}>
          {t.label}
          {t.count !== undefined && (
            <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: active === t.id ? "var(--amber-dim)" : "rgba(255,255,255,0.05)", color: active === t.id ? "var(--amber)" : "var(--text-3)" }}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ─── Modal ──────────────────────────────────── */
export function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card w-full max-w-md p-6 animate-[slideUp_0.3s_ease]">
        {title && <h3 className="font-black font-display text-lg mb-5" style={{ color: "var(--text)" }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}
